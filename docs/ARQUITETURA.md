# Arquitetura

Como o app funciona por dentro. Estado descrito: **versão 1.0.0**.

## 1. Visão geral

- **Um único arquivo**: `app/index.html` (~2.400 linhas: ~310 de CSS e ~2.070 de JavaScript, 172 funções). HTML + CSS + JS puro, **sem dependências**, sem build, sem fontes ou scripts externos.
- Todo o JavaScript fica dentro de uma **IIFE** (`(function(){ ... })();`). Nada vaza para `window`.
- **Estado em memória**: um objeto `S` (e algumas variáveis de tela). **Persistência**: `localStorage`, chave `caderneta:v2`.
- **Renderização**: cada tela é uma função que devolve **uma string de HTML**; `desenhar()` coloca no `#tela`. Cliques são tratados por **delegação** (`data-a="nome"` → objeto `ACOES`).
- **PWA**: `manifest.webmanifest` + `sw.js` (abre sem internet). Cache "abre do cache e atualiza em segundo plano".

```
app/
  index.html           app inteiro
  sw.js                service worker (VERSAO = "caderneta-<versão>")
  manifest.webmanifest nome, cores, ícones
  icon.svg, icon-180/192/512.png, icon-maskable-512.png
tests/                 preparar.js + rodar.js + 15 arquivos *.test.js (jsdom)
tools/                 servidor-local.js, gerar-icones.js
```

## 2. Dados (`S`)

Todos os valores em **centavos (inteiros)**. Datas em `"AAAA-MM-DD"`. Ids: `[A-Za-z0-9_-]`.

```js
S = {
  contas:      [ Conta ],
  categorias:  [ Categoria ],
  lancamentos: [ Lancamento ],
  fixas:       [ ContaFixa ],
  caixas:      [ Caixinha ],
  reservas:    [ MovimentoDeCaixinha ],
  config:      { tamanho:"m|g|gg", tema:"auto|claro|escuro", contador:bool, ultimoBackup:data|null,
                 pronto:bool, movimento:"vivo|parado", renda:centavos, sobraRef:"AAAA-MM"|null }
}
```

| Entidade | Campos |
|---|---|
| **Conta** | `id, nome, tipo:"ativo"\|"passivo", inicial` + opcionais: `fecha, vence, limite` (cartão), `abertas:[{data\|null,valor}]` (dívida inicial por vencimento; `inicial` = soma), `pessoa:true, cobrar` (dinheiro com pessoas), `bem:true, taxa, desde, ajustadoAte` (bens) |
| **Categoria** | `id, nome, tipo:"despesa"\|"receita"`, `meta` (despesa; só planejamento) |
| **Lançamento** | `id, tipo, valor, desc, contaId, destinoId, catId, data` + `parcelas:[{data,valor}]`, `caixaId`, `fixaId`+`ref`, `sinal` |
| **ContaFixa** | `id, nome, valor, dia, freq:"mensal"\|"anual", mes, contaId, catId, inicio, vezes?, puladas:["AAAA-MM"]` |
| **Caixinha** | `id, nome, alvo, prazo?` |
| **Movimento de caixinha** | `id, data, de, para, valor, conta?` (`de`/`para`: `"livre"` ou id da caixinha) |

**Tipos de lançamento**: `saida` (gasto), `entrada` (ganho), `transferencia` (entre contas, inclui pagar dívida e emprestar), `bem` (compra de bem), `ajuste` (valor de um bem mudou; `sinal:"alta"|"baixa"`).

**Chaves do `localStorage`**: `caderneta:v2` (dados) e `caderneta:v2:corrompido` (cópia do original quando os dados estavam ilegíveis ou tinham itens inválidos).

**Backup (arquivo `.json`)**: `{ app:"caderneta", versao:2 (formato), appVersao:"1.0.0", dados:S }`. Ao restaurar, o `dados` passa por `higienizar()`.

## 3. Motor contábil

### 3.1 Partidas dobradas (`partidas(l)`)
Todo lançamento gera **duas partidas de mesmo valor**:

| Lançamento | Débito | Crédito |
|---|---|---|
| `saida` | categoria (despesa) | conta |
| `entrada` | conta | categoria (receita) |
| `transferencia` | conta destino | conta origem |
| `bem` | bem (destino) | conta (origem) |
| `ajuste` alta | bem | "Valorização de bens" (`__valoriza`) |
| `ajuste` baixa | "Desvalorização de bens" (`__desvaloriza`) | bem |

Ativo cresce a débito; passivo cresce a crédito. **Patrimônio líquido (PL) = ativo − passivo.** Só **competência** (a despesa nasce inteira na data da compra; `parcelas` é só o cronograma de pagamento).

### 3.2 Regras que não podem quebrar
- **Pagar fatura = transferência** banco → cartão, nunca uma despesa nova.
- **Pagar dívida com juros**: dois lançamentos: transferência do principal + saída dos juros (categoria "Juros e multas", paga pela conta de origem).
- **Comprar bem não é despesa** (PL não muda). **Ajuste** muda o PL mas **não** entra em "Entrou/Saiu" (é `resumoMes().aj`).
- **Perdoar dívida** de uma pessoa = saída para "Dívidas não pagas" (aí sim vira gasto).
- **Pagamentos quitam as parcelas mais antigas primeiro** (FIFO) em `itensDevidos(c)`.
- **Ciclo do cartão** (`proximoFechamento`, `primeiroVencimento`): compra até o dia do fechamento (inclusive) cai na fatura que fecha neste mês; se `vence > fecha` vence no mesmo mês do fechamento, senão no seguinte; dia inexistente cai no último dia do mês (`addMes` nunca "rola" para o mês seguinte). Casos protegidos por teste: fecha 25/vence 5 (20/set→05/out; 27/set→05/nov); fecha 1/vence 5 (12/set→05/out; 01/set→05/set); fecha 5/vence 15 (04/set→15/09; 06/set→15/10); virada de ano; vencimento 31 em fevereiro.
- **Parcelas** (`dividir`): a sobra de centavos fica na última; a soma sempre fecha.

### 3.3 Bens
- `taxa` = % ao ano (negativo perde valor). `atualizarBens()` roda **ao abrir o app e ao restaurar backup**: gera **um ajuste por mês completo**, composto (taxa/12 sobre o valor do fim do mês); idempotente por `ajustadoAte`.
- **Venda**: ajuste até o preço (ganho/perda) + transferência bem → conta.
- "Já tenho um bem + ainda estou pagando": cria o bem (`inicial` = valor) e a dívida `"Financiamento: <bem>"` (`inicial` = saldo devedor, `abertas` = parcelas mês a mês). O saldo **não** inclui juros futuros: entram parcela a parcela.

### 3.4 Caixinhas (fora da contabilidade)
- **Meta do mês**: `categoria.meta` (só planejamento; o pote enche/esvazia com os gastos do mês).
- **Caixinha de guardar**: dinheiro separado dentro das contas. Não gera partidas, não aparece no balancete, **não muda o PL**.
- Só conta o **dinheiro real nas contas**: `dinheiroEmConta()` = contas `ativo` que não são pessoa nem bem (dívidas, bens e o que devem a você **não** entram).
- **Invariante**: `dinheiroEmConta() = livreAgora() + totalReservado()`.
- **Por conta**: cada movimento pode ter `conta`. `bucketsCaixa(id)` calcula em qual conta está o guardado de cada caixinha (movimentos e gastos `caixaId` em ordem de data). Tirar libera primeiro o da conta escolhida; gasto pago com caixinha libera primeiro o da conta que pagou. `guardadoConta(c)`, `livreConta(c)`; guardar só vale até o livre da conta escolhida.
- Na balança (modo comum) o guardado **sai** de "Dinheiro que eu tenho" e aparece como "Guardado nas caixinhas" (moedas roxas). No **Modo contador** as caixinhas são ignoradas.

### 3.5 O que pagar no mês e agenda
- `aPagar()`: itens em aberto de dívidas, agrupados por conta e data. Dívida com pessoa (`passivo`) usa `cobrar`.
- `pagarNoMes(ym)`: o que vence no mês (dívidas + contas fixas pendentes + pessoas). No mês de hoje entram também **atrasadas** e **sem data**. "Já pago" = transferências para dívidas, contas fixas pagas por conta de dinheiro (não por cartão, para não contar duas vezes) e juros/multas.
- `agenda()`: dívidas + contas fixas pendentes + a receber (até 35 dias).
- **Contas fixas**: são compromisso, **não** despesa, até a pessoa tocar em "Paguei" (cria uma saída com `fixaId` e `ref` "AAAA-MM"). `puladas` guarda meses pulados. `ocorrencias(f, deYM, ateYM)` gera as datas (mensal/anual, `vezes`).

### 3.6 Simulador e previsão
- `comprometidoMeses(12)`: dívidas em aberto + contas fixas por mês, comparado com a renda (`rendaMedia()` ou `config.renda`). Semáforo (<30% / <50% / ≥50%) é **referência, não conselho**.
- Gráfico "para onde o que é meu está indo": do primeiro mês de uso (até 5 atrás) até 6 meses à frente; futuro = **previsão** pela sobra média dos últimos meses (pontilhado).
- `taxaMensal(valor, parcela, n)`: taxa de juros por bisseção (mostrada quando há total com juros).

## 4. Telas e navegação

`VIEW` (tela atual) → função `tela*()`. Menu: **Início · Dinheiro · [+ Anotar] · Planejar · Mais**. `ABA` mapeia telas internas para a aba marcada.

| VIEW | Aba | Conteúdo |
|---|---|---|
| `inicio` | Início | frase, balança, legenda, resumo do mês, **O que pagar** (setas de mês), avisos, cofres, metas, últimas anotações |
| `contas` | Dinheiro | contas e cartões, **Meus bens**, **Pessoas** |
| `planejar` | Planejar | total do mês, agenda, atalhos |
| `caixinhas`, `fixas`, `simulador` | Planejar | caixinhas; contas fixas; "e se eu comprar" |
| `mais` | Mais | atalhos |
| `anotacoes` | Mais | busca e ordem (data/valor/nome), filtros, 15 por vez |
| `relatorios`, `ajustes` | Mais | resumo do mês, o que pagar, gráfico, anotações do mês, balancete (modo contador); ajustes |

**Janelas**: `#folha` (Anotar, tela cheia, com botão voltar do celular via `history`), `#modal` (formulários e confirmações), `#onb` (primeiros passos), `#toast`, `#carimbo`.

**Anotar** (`F` = estado): tipo (Gastei/Recebi/Transferi/Comprei um bem), valor, **duas colunas** (de onde saiu | para onde foi) ligadas por um fio dourado, data, parcelas (se a conta é dívida), campo de juros (se paga dívida), caixinha (se há guardado), anotação, **prévia** em frase simples. Salvar fica no fim do formulário.

### Variáveis de tela (globais dentro da IIFE)
`S, VIEW, REF` (mês dos relatórios), `F` (Anotar), `G` (conta), `K` (categoria), `PS` (pessoa), `X` (conta fixa), `BM` (bem), `CX`/`MV` (caixinha e movimento), `SIM` (simulador), `O` (primeiros passos), `AN` (filtros de anotações), `PAG_OFF` (mês do cartão "O que pagar"), `ULT`/`ULTIMO`/`WOB` (animações), `FRASE_OFF`, `MOK` (ação do modal de confirmação).

## 5. Mapa do código (ordem em `app/index.html`)

| Seção | Funções principais |
|---|---|
| utilidades | `lsGet lsSet uid esc ehObj num brl pad isoDe hojeISO dataBR ultimoDia addMes addDias diasAte dividir` |
| ciclo do cartão | `proximoFechamento primeiroVencimento` |
| dados | `S higienizar higienizarConfig carregar salvar conta cat nomeConta nomeCat` |
| vocabulário | `VOC v` (comum × contador) |
| **motor** | `partidas saldoConta totais resumoMes itensDevidos aPagar` |
| caixinhas, pessoas, fixas, agenda | `saldoCaixa totalReservado contasDinheiro bucketsCaixa guardadoConta livreConta melhorConta bensLista bensTotal dinheiroEmConta livreAgora metasMes sobraMesPassado pessoasLista contasNormais aReceber fixaPaga ocorrencias fixasPendentes agenda quandoTxt quandoFrase pagarNoMes cartaoPagar rendaMedia comprometidoMeses taxaMensal` |
| toast e modal | `toast abrirModal fecharModal confirmar ligarDinheiro cent` |
| navegação | `ir desenhar` |
| visual vivo | `calmo capa balanca legendaBalanca modalComoLer rolarNum animarInicio carimbo moedaFio` |
| anotações (busca/filtros) | `semAcento tituloLanc textoBusca anotacoesFiltradas blocoAnotacoes pintarAnot iniciarAnot telaAnotacoes` |
| listas e avisos | `linha avisos` |
| telas | `telaInicio telaContas blocoPessoas telaRel graficoEvolucao blocoContador telaAjustes telaMais telaPlanejar telaFixas telaCaixinhas telaSimulador` |
| cofres e potes | `cofreN cofreSvg cofre jarra jarraMeta` |
| Anotar | `novaFolha ajustarFolha gerarParcelas desenharFolha ligarFio previa salvarFolha abrirFolha fecharFolha` |
| contas e categorias | `modalGaveta salvarGaveta addLinhaFatura lerFaturas modalCategoria salvarCategoria repetido` |
| bens | `atualizarBens blocoBens modalBem salvarBem modalAjusteBem modalVendaBem textoVariacao` |
| pessoas | `modalPessoaNova salvarPessoaNova modalPessoa primeiraGaveta jurosCat perdasCat` |
| fixas e caixinhas | `modalFixa salvarFixa linhaAgenda modalCaixa salvarCaixa modalMov salvarMov modalTirarRapido blocoContasGuardar blocoContasTirar modalMeta guardarNaCaixa` |
| simulador | `iniciarSim calcSim` |
| backup | `guardarCopia lerCopia` |
| primeiros passos | `iniciarOnb desenharOnb finalizarOnb categoriasPadrao` |
| eventos | `aplicarConfig ACOES` (≈90 ações) e os *listeners* de clique, mudança e teclado |

> Os nomes internos antigos (`modalGaveta`, `data-a="gaveta"`) vêm de quando o app chamava "conta" de "gaveta". Na tela é sempre "conta".

## 6. Visual

- **Tokens** em `:root` (papel creme, verde de capa, latão, azul tinta = entrou, vermelho tinta = saiu) com **tema escuro "lamparina"** (`prefers-color-scheme` + `data-tema`).
- **Letra**: `html[data-tam="g|gg"]` (grande/enorme); com "Enorme" a conta em T vira lista de uma coluna e o fio some.
- **Movimento**: classe `calmo` no `<html>` (config "Parado" **ou** `prefers-reduced-motion`) desliga tudo. Animar só `transform`/`opacity`.
- Gráficos, balança, cofres e potes são **SVG desenhado à mão** (sem biblioteca). Fontes: só as do sistema (Georgia para números/títulos).

## 7. Segurança dos dados no navegador
- Entrada sempre validada por `higienizar()` (tipos, datas, ids; descarta item inválido e guarda cópia do original).
- Texto de usuário só entra no HTML por `esc()`; ids só `[A-Za-z0-9_-]`.
- `localStorage` **não é criptografado** e é **por endereço (origem)**: mudar o endereço do app = dados começam vazios (use Guardar/Recuperar cópia). Detalhes de risco em `AVALIACAO.md`.

## 8. Testes

- `npm test` → `tests/rodar.js`: **prepara uma cópia** do app em `tests/.tmp/app-teste.html` (com um gancho `window.__T` que expõe funções internas listadas em `tests/preparar.js`), confere a sintaxe do JS e roda cada `tests/*.test.js` em **jsdom**, simulando a pessoa: cliques, digitação, navegação.
- Os testes ligam a classe `calmo` (sem esperas de animação). Animação, layout e toque **só se conferem no navegador/celular**.
- Cobertura (470 verificações, 15 arquivos): fluxo básico, dívida por vencimento, pessoas/fixas/caixinhas/simulador, bens, juros, bem financiado, apagar, vocabulário (varre todas as telas atrás de jargão), "o que pagar no mês", caixinhas com dinheiro real, guardado por conta, cofres/setas, filtros de anotações, **segurança contra textos maliciosos (XSS)**. Os testes também conferem **invariantes** (partidas dobradas, ativo − passivo = PL, dinheiro = livre + guardado).
- **Escrever um teste novo**: copie um arquivo parecido, mude o `seed` (dados iniciais no `localStorage`) e os passos; use `eq(nome, obtido, esperado)`; termine com `console.log(ok?"TUDO OK":"HÁ FALHAS")`. O corredor reconhece "OK", "FAIL" e "TUDO OK".

## 9. Publicação
GitHub Actions (`.github/workflows/publicar.yml`): a cada envio para `main`, roda `npm ci && npm test` e, **só se passar**, publica a pasta `app/` no GitHub Pages. Passo a passo em `PUBLICACAO.md`.
