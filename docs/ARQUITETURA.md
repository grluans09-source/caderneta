# Arquitetura

Como o app funciona por dentro. Estado descrito: **versão 1.26.0-beta.1** (a base de dados e o motor vêm da 1.0.0; as telas foram reorganizadas conforme `MAPA-DO-APP.md`).

## 1. Visão geral

- **Um único arquivo**: `app/index.html` (~5.030 linhas: ~880 de CSS e ~4.050 de JavaScript, ~370 funções e ~125 ações). HTML + CSS + JS puro, **sem dependências**, sem build, sem fontes ou scripts externos.
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
tests/                 preparar.js + rodar.js + 37 arquivos *.test.js (jsdom) + golden/ (massa de teste e valores da 1.24.1)
tools/                 servidor-local.js, brasao.js (desenho do logo), gerar-icones.js, noticias.js (robô das notícias), medir-desempenho.js
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
                 pronto:bool, movimento:"vivo|parado", renda:centavos, sobraRef:"AAAA-MM"|null,
                 favoritas:[3 ids de conta], favCats:{despesa:[...],receita:[...]},
                 idx:{cdi:[{d,v}], selic:[{d,v}], ipca:[{m,v}]} }   // índices oficiais guardados (D65)
}
```

| Entidade | Campos |
|---|---|
| **Conta** | `id, nome, tipo:"ativo"\|"passivo", inicial` (saldo **antes** da primeira anotação) + opcionais: `fecha, vence, limite` (cartão), `abertas:[{data\|null,valor}]` (dívida inicial por vencimento; `inicial` = soma), `pessoa:true, cobrar` (dinheiro com pessoas), `bem:true, taxa, desde, ajustadoAte` (bens), `carteira:true, cedulas, contagem` (conta Dinheiro), `inv:{modo,taxa,ir,banco,ate,calc0,desde}` (aplicação: `modo` = cdi/fixa/ipca/poup/varia; `taxa` = % do CDI, % ao ano ou % acima do IPCA; `ir` = paga Imposto de Renda; `calc0` = início do cálculo; `desde` = data da aplicação, para o IR), `conferido` (data do último Conferir com o banco) |
| **Categoria** | `id, nome, tipo:"despesa"\|"receita"`, `meta` (despesa; só planejamento), `sis` (categoria do sistema, achada pelo código e nunca pelo nome: `conf` diferença do Conferir, `rend` Rendimentos, `invtax` impostos e taxas dos investimentos, `juros` Juros e multas, `perdas` Dívidas não pagas) |
| **Lançamento** | `id, tipo, valor, desc, contaId, destinoId, catId, data` + `parcelas:[{data,valor}]`, `caixaId`, `fixaId`+`ref`, `sinal`, `rend:"AAAA-MM"` (rendimento do mês de uma aplicação), `rendCx` (id da caixinha que rendeu) e `cxAj` (ajuste de valor de uma caixinha, D65) |
| **ContaFixa** | `id, nome, valor, dia, freq:"mensal"\|"anual", mes, contaId, catId, inicio, vezes?, puladas:["AAAA-MM"]` |
| **Caixinha** | `id, nome, alvo, prazo?`, `modo?` (cdi ou fixa) e `taxa?` (% do CDI ou % ao ano, se rende), `ir`, `ate`, `calc0` e `conferido` (até que dia o rendimento já foi calculado) |
| **Movimento de caixinha** | `id, data, de, para, valor, conta?` (`de`/`para`: `"livre"` ou id da caixinha), `rend?` ("AAAA-MM": guarda o rendimento do mês na caixinha) |

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
- **Pagar dívida com juros**: dois lançamentos: transferência do principal + saída dos juros (categoria "Juros e multas", achada por `sis:"juros"`, paga pela conta de origem).
- **Comprar bem não é despesa** (PL não muda). **Ajuste** muda o PL mas **não** entra em "Entrou/Saiu" (é `resumoMes().aj`).
- **Perdoar dívida** de uma pessoa = saída para "Dívidas não pagas" (`sis:"perdas"`; aí sim vira gasto).
- **O passado não muda por correção de saldo**: Conferir com o banco e contar as cédulas lançam a diferença como anotação **de hoje**; o `inicial` de uma conta com anotações não aparece para editar (auditoria 1.21.1).
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
- Só conta o **dinheiro real nas contas**: `dinheiroEmConta()` = contas `ativo` que não são pessoa, bem nem aplicação (dívidas, bens, aplicações e o que devem a você **não** entram).
- **Caixinha que rende** (`taxa`): o rendimento vira anotação de Rendimentos na conta com mais dinheiro dela e um movimento `rend` o guarda na caixinha (ver Investimentos, mais abaixo).
- **Invariante**: `dinheiroEmConta() = livreAgora() + totalReservado()`.
- **Por conta**: cada movimento pode ter `conta`. `bucketsCaixa(id)` calcula em qual conta está o guardado de cada caixinha (movimentos e gastos `caixaId` em ordem de data). Tirar libera primeiro o da conta escolhida; gasto pago com caixinha libera primeiro o da conta que pagou. `guardadoConta(c)`, `livreConta(c)`; guardar só vale até o livre da conta escolhida.
- Na balança (modo comum) o guardado **continua dentro do prato do dinheiro** (o total não muda), mas sai de "Dinheiro para usar agora" e aparece como "Guardado nas caixinhas" (moedas roxas), como na caixinha de um banco. Cada conta mostra "guardado · para usar". No **Modo contador** as caixinhas são ignoradas.

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

`VIEW` (tela atual) → função `tela*()`. Menu (barra de baixo, 6 abas): **Início · Dinheiro · Investir · Planejar · Saúde · Mais** (a aba Saúde é a VIEW `graficos`; desde a 1.23.0 os relatórios moram dentro dela); o botão de anotar (`.fab`, a pena) fica fora da barra, no canto direito. `ABA` mapeia telas internas para a aba marcada.

| VIEW | Aba | Conteúdo |
|---|---|---|
| `inicio` | Início | frase, dica de instalar, Mordomo, legenda, resumo do mês, "<mês> fechou" (dias 1 a 10), "Falta pagar", avisos, Hoje no Brasil, cofres, metas, últimas anotações |
| `contas` | Dinheiro | 4 abas (`DIN_ABA`): Contas, Dívidas, Bens, Pessoas |
| `investir` | Investir | investido, rendeu no mês e no ano, aplicações, caixinhas que rendem |
| `planejar` | Planejar | ferramentas, acerto de contas do mês, agenda |
| `caixinhas`, `fixas`, `metas`, `simulador` | Planejar | caixinhas; contas fixas e contas do ano; metas do mês; "e se eu comprar" |
| `graficos` | Saúde | panorama, 4 indicadores (`IND_TOPO`), "Ver mais indicadores" (os outros 6), "Mês a mês", atalho para a lista de relatórios; balancete no Modo contador |
| `relatorios`, `relatorio` | Saúde | lista de relatórios (volta para a Saúde); um relatório (`REL_ID`, volta para `REL_VOLTA`); balancete no Modo contador |
| `mais` | Mais | Anotações, Notícias, Ajustes |
| `anotacoes` | Mais | busca e ordem (data/valor/nome), filtros, 15 por vez |
| `noticias` | Início ou Mais | notícias oficiais com selo e "para você"; `NOT_VOLTA` lembra de onde veio (e a barra marca essa aba) |
| `ajustes` | Mais | seções Aparência, Categorias, Seus dados, Ajuda |

**Peças reutilizáveis (1.23.0)**: `recolhivel(id,titulo,corpo,aberto,extra)` (um `<details class="rec">` que guarda aberto/fechado em `KEY+":rec:"+id`, por aparelho); `maisDetalhes(corpo,abrir,titulo)` (campos opcionais dos formulários, abre sozinho quando já há valor); `ajuda(texto)` (botão "?" + `.ajuda-t`, ação `ajuda`); `vazio(titulo,texto,botao)` (tela vazia com o próximo passo). Títulos e textos que entram nessas peças já vão escapados (`esc`).

**Janelas**: `#folha` (Anotar, tela cheia, com botão voltar do celular via `history`), `#modal` (formulários, confirmações, acerto de contas e chat), `#onb` (primeiros passos), `#toast` (aviso único, role=status), `#splash` (abertura; desde a 1.25.0 só no primeiro uso e ao atualizar, 1,2 s, chave `KEY+":abertura"` = versão), `.momento` (mascotes). `#folha` e `#modal` são diálogos (role=dialog, aria-modal).

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
| travas (D57) | `efeitoConta saldoApos conferirAnotacao valorEstranho janelaTrava` |
| funções contábeis (D53) | `modalConferir pintarConferir catConferir contasDoAno blocoContasDoAno compMes cardMesAMes cardFechou` |
| investimentos (D58) | `contasInvest investidoTotal diaUtil feriados pascoa fatorDia atualizarRendimentos telaInvestir modalInvest salvarInvest` |
| notícias (D59) | `buscarNoticias noticiasValidas linkOficial itensNoticias gastoMedioCat cardHojeBrasil telaNoticias` |
| chat (D56) | `PERGS abrirChat responder buscaPerg rostoPerg pergReage` |
| Mordomo e momentos (D54) | `balanca momento svgMoedinha svgLacre svgPeso checaPesao` |
| gráficos e relatórios | `indicadores relatorioTexto telaGraficos telaRel telaRelatorio` |
| eventos | `aplicarConfig ACOES` (≈108 ações) e os *listeners* de clique, mudança e teclado |

> Os nomes internos antigos (`modalGaveta`, `data-a="gaveta"`) vêm de quando o app chamava "conta" de "gaveta". Na tela é sempre "conta".

## 6. Visual

- **Tokens** (D67, desde a 1.26.0) em `:root`: `--color-*` da seção 6.1 do prompt de redesign (bg, surface, surface-2, text, text-2, text-3, border, border-field, action, on-action, brand, brand-text, brand-bg, in, out, transfer, asset, ok, warn, danger e os fundos, scrim), `--tinta*` (painéis escuros: Perguntar, acerto de contas, panorama, chat), `--latao-claro`, `--dv-*` (cores de gráficos e ilustrações), `--fs-*`/`--lh-*` (escala de letra), `--e1`…`--e9` (espaçamento), `--raio`/`--raio-g`. Os nomes antigos (`--bg`, `--card`, `--ink`, `--latao`, `--capa`...) continuam e **apontam para os novos**. Tema escuro em `@media (prefers-color-scheme:dark) :root:not([data-tema="claro"])` e `:root[data-tema="escuro"]` (os dois iguais; o teste `37` confere). **Tinta = ação, latão = marca**; nenhuma cor solta nas regras.
- **Letra**: `html[data-tam="g|gg"]` (grande/enorme); com "Enorme" a conta em T vira lista de uma coluna e o fio some.
- **Movimento**: classe `calmo` no `<html>` (config "Parado" **ou** `prefers-reduced-motion`) desliga tudo. Animar só `transform`/`opacity`.
- Gráficos, balança, cofres e potes são **SVG desenhado à mão** (sem biblioteca). Letras (1.26.0): `@font-face` local de `app/fontes/fraunces-wght.woff2` (Fraunces variável, títulos e valores: `--font-display`, e `--serif` aponta para ela) e `app/fontes/atkinson-hyperlegible-next-wght.woff2` (texto: `--font-ui`), `font-display:swap`, as duas no cache do service worker; licenças OFL ao lado; o `body` liga `font-variant-numeric: lining-nums tabular-nums`, então **todo número tem algarismos alinhados** (padrão contábil). O resto do texto usa a letra do celular (`system-ui`).

## 7. Segurança dos dados no navegador
- Entrada sempre validada por `higienizar()` (tipos, datas, ids; descarta item inválido e guarda cópia do original).
- Texto de usuário só entra no HTML por `esc()`; ids só `[A-Za-z0-9_-]`.
- `localStorage` **não é criptografado** e é **por endereço (origem)**: mudar o endereço do app = dados começam vazios (use Guardar/Recuperar cópia). Detalhes de risco em `AVALIACAO.md`.

## 8. Testes

- `npm test` → `tests/rodar.js`: **prepara uma cópia** do app em `tests/.tmp/app-teste.html` (com um gancho `window.__T` que expõe funções internas listadas em `tests/preparar.js`), confere a sintaxe do JS e roda cada `tests/*.test.js` em **jsdom**, simulando a pessoa: cliques, digitação, navegação.
- Os testes ligam a classe `calmo` (sem esperas de animação). Animação, layout e toque **só se conferem no navegador/celular**.
- Cobertura (968 verificações, 37 arquivos; inclui o golden master do redesign (`35`), a fase B (`36`) e a fase C (`37`, tokens, contraste e letras); inclui a simplificação da interface, item por item (`32-simplificacao`); inclui planejar com acerto de contas, anotar em dois toques, conta Dinheiro, gráficos e relatórios, mapa do app, funções contábeis, identidade, Mordomo, chat, travas, investimentos, notícias (inclusive as do IBGE buscadas pelo celular) e as correções da auditoria): fluxo básico, dívida por vencimento, pessoas/fixas/caixinhas/simulador, bens, juros, bem financiado, apagar, vocabulário (varre todas as telas atrás de jargão), "o que pagar no mês", caixinhas com dinheiro real, guardado por conta, cofres/setas, filtros de anotações, **segurança contra textos maliciosos (XSS)**. Os testes também conferem **invariantes** (partidas dobradas, ativo − passivo = PL, dinheiro = livre + guardado).
- **Escrever um teste novo**: copie um arquivo parecido, mude o `seed` (dados iniciais no `localStorage`) e os passos; use `eq(nome, obtido, esperado)`; termine com `console.log(ok?"TUDO OK":"HÁ FALHAS")`. O corredor reconhece "OK", "FAIL" e "TUDO OK".

## 9. Publicação
GitHub Actions (`.github/workflows/publicar.yml`): a cada envio para `main`, roda `npm ci && npm test` e, **só se passar**, publica a pasta `app/` no GitHub Pages. Passo a passo em `PUBLICACAO.md`.


## O que mudou no código da 1.2 à 1.23 (resumo para quem lê)
- **Telas**: `telaInicio` enxuta e `linhaFalta()` (uma linha que leva ao Planejar); `telaPlanejar` com `ferr()` (4 ferramentas no topo), `cartaoPagarInicio()` (cartão do mês com setas, `PAG_OFF`) e agenda recolhida (`AG_TODAS`, ação `agMais`); nova `telaMetas`; `telaContas` em 4 abas (`DIN_ABA`, ação `dinAba`); `telaRel` sem repetições; `telaAjustes` em 3 grupos (Aparência, Dados, Ajuda).
- **Anotar em dois toques**: o `.fab` (`novo`, a **pena** num medalhão de ouro em SVG, com `.pena-i` e `.pena-x`: aberto, a classe `aberto` troca a pena por "×"; botão fixo no canto direito de baixo, **fora** da `nav`, que tem 7 colunas iguais) alterna `fabMenu()`, que mostra `#fabMenu` com 4 bolinhas `.fb` (ação `novoT`). Cada bolinha é desenhada por `medalha(k)` (D61, k = `gasto`, `ganho`, `transf`, `bem` ou `x`): aro de ouro serrilhado com os metais `#mg-oV`/`#mg-oR`, esmalte `#mg-e-<k>` (gradientes no SVG escondido do topo; `x` usa `#mg-esm`) e o símbolo de `MED_IC` em ouro; o `.fbc` vazio com `data-m` é preenchido ao abrir o app e o `#dockTipo` recebe `medalha()` em `atualizarDock()`. `fabMenu()` liga `body.menu-tipo`, que esconde a pílula Perguntar enquanto o menu está aberto. Cada bolinha tem `--cx`/`--cy` (cosseno e seno de 0°, 30°, 60° e 90° medidos a partir da esquerda; o x é negativo) e o raio `--R` (`.fabmenu`), então ficam num quarto de círculo exato, igualmente espaçadas e espelhadas na diagonal do canto; `.fabarco` e `.dock` ancoram no canto direito (`right`), e o nome de cada bolinha (`.fbl`) fica à esquerda dela (o da última, em cima); entram por `transition` de `transform` com atraso `--d`. Na folha o seletor é o botão fixo `#dockTipo` (mostra o tipo atual, `atualizarDock()`); ele abre o mesmo menu com a classe `emfolha`, a bolinha do tipo atual ganha `.atual` (apagada) e `novoT` troca `F.tipo` sem fechar a folha. Colunas: `pintarColuna()` com `listaColuna(cfg,q,todas)`; o foco no campo `.bcol` liga `F.tE`/`F.tD` (lista completa em ordem alfabética); contas favoritas em `S.config.favoritas` (3) e categorias favoritas em `S.config.favCats` (5 por tipo, `favCatsValidas()`, `modalFavCats()`).
- **Conta Dinheiro**: conta com `carteira:true` (uma só; `marcarCarteira()` marca uma conta chamada Dinheiro/Carteira em dados antigos e `finalizarOnb` cria a conta nova). Não se apaga (`gApagar` barra). `modalCarteira()` conta cédulas (`CED`) e guarda `cedulas` e `contagem`; se o total contado for diferente do saldo, `salvarCarteira()` lança a diferença como **anotação de hoje** ("Diferença ao contar as cédulas", categoria de `catConferir`), sem mexer no `inicial` (até a 1.21.0 ele mudava o `inicial`, o que alterava o passado). `pintarArred()` sugere reais inteiros ao anotar com a carteira.
- **Desfazer ao apagar**: `foto()` guarda uma cópia dos dados; `toastDesfazer()` mostra o botão por 8 s; ação `desfazer` restaura.
- **Cores (histórico: paleta preto, dourado e branco, D44, até a 1.25.0; desde a 1.26.0 valem os tokens "Tinta & Latão" descritos em 6. Visual)**: variáveis em `:root` e nos 2 blocos do tema escuro. `--capa` preto, `--latao`/`--ouro` dourado (**clicável**: `.btn` em degradê dourado, contornos e links), `--selbg`/`--selink` **selecionado** (preto com texto dourado; creme no tema escuro), `--in` safira = entrou, `--out` bordô = saiu/dívida, `--tr` ardósia = transferência/compromisso fixo, `--am` ametista = guardado, `--cobre` = bens. O verde **não** é usado.
- **Visual vivo**: ícones SVG **cheios** (classes `.cut` e `.acc` para recortes e partes claras) dentro de `nav .ic`; `ir()` faz o ícone da aba quicar (`.pop`) e a tela entrar (`#tela.entra`, blocos em sequência); `#splash` é a abertura: o Brasão vivo (`.br-moeda` cai girando, `.br-reflexo` passa, `.br-pino` cresce e `.br-olhos` abrem e piscam, `.br-trav` balança), some em 4,1 s ou ao tocar; com `.calmo` fica parado e some em 1,2 s; gráficos crescem por `animation` de `transform` (`cresceX`/`cresceY`). Tudo usa só `transform` e `opacity`, e `html.calmo *` desliga as animações.
- **Migração de dados antigos**: `marcarCarteira()` roda dentro de `higienizar()` (por isso vale para dados do aparelho e para backups restaurados). Sem conta de carteira e com pelo menos uma conta, ela reconhece uma conta chamada Dinheiro/Carteira ou **cria** "Dinheiro" (ou "Dinheiro vivo"/"Carteira" se o nome já estiver em uso por outra conta) e liga `CARTEIRA_NOVA`; `carregar()` então salva e mostra o aviso uma vez. Dados vazios não criam conta.
- **Indicadores**: `indicadores()` calcula os 10 (cada um com `id`, `valor`, `st` = ok/atencao/critico/info/sem, `leitura`, `d` com os números e `graf` com o desenho em HTML/SVG); `relatorioTexto(i)` gera as 5 partes do relatório; `telaGraficos`, `telaRel` (panorama + lista) e `telaRelatorio` (detalhe, `REL_ID`, ações `relInd` e `relShare`). Faixas de referência: dívidas ≤30% / ≤50%; reserva ≥6 / ≥3 meses; poupança ≥20% / ≥10%; renda reservada ≤30% / ≤50%; folga ≥2x / ≥1x; dinheiro no patrimônio ≥30% / ≥10%.
- **Planejar**: `cartaoPagar()` é o acerto de contas: no Planejar mostra a prévia de 3; `acToggle` chama `abrirAcerto()`, que abre o modal com a classe `acm` (preto e dourado) e `cartaoPagar(ym,{aberto:true})` dentro de `#acCorpo`, com todas as contas e **Pagar** (`pagar`) ou **Paguei** (`fxPagar`). Pagar fecha a janela e liga `AC_VOLTA`; `fecharFolha()` (e o botão voltar do celular) chama `voltaAcerto()`, que reabre a janela. `ir()` fecha a janela ao trocar de tela. `abrirModal(html,cls)` aceita uma classe e `fecharModal()` a limpa. Atrasada = vencimento antes de hoje (`hojeISO()`), igual a `quandoTxt()` da agenda.
- **Identidade (D54)**: o desenho do Brasão mora em `tools/brasao.js` (`brasao({p,vivo,fundo,margem})`). Dele saem `app/icon.svg` e os PNGs (`npm run icones`, que usa o Chrome sem janela; `CHROME=caminho` se ele estiver em outro lugar) e as duas cópias dentro do `index.html`: o `<symbol id="brasaoSimb">` (sem olhos, usado no cabeçalho por `<use href="#brasaoSimb">`) e o SVG da abertura (com olhos). Se mudar o desenho, gere os ícones e recopie os dois SVGs no `index.html`. Por dentro o app continua "caderneta": a chave dos dados (`caderneta:v2`), o formato da cópia (`app:"caderneta"`), o nome do cache do service worker e o endereço `/caderneta/`; mudar isso faria as pessoas perderem os dados.
- **Notícias (D59)**: `tools/noticias.js` (Node 22, sem dependências) busca Banco Central (SGS 1 dólar, 432 Selic por intervalo de datas até hoje, 4389 CDI, 433 e 13522 IPCA; Focus pela API Olinda), IBGE (SIDRA tabela 7060 por grupo; API de notícias, releases) e ANP (planilha semanal `resumo_semanal_*.xlsx`, aba BRASIL, lida com um leitor de .zip/.xlsx próprio) e grava `app/noticias.json` (fora do Git). O workflow `publicar.yml` roda também às 15h UTC (meio-dia em Brasília) e executa o robô antes de publicar, com `continue-on-error`. No app: `buscarNoticias()` (ao abrir e na tela, no máximo a cada 10 min) busca `noticias.json` do próprio site, passa por `noticiasValidas()` (faixas de valores, textos cortados, só links `https` de gov.br, bcb.gov.br e ibge.gov.br) e guarda em `localStorage` (`KEY+":noticias"`); o service worker deixa esse arquivo passar direto (sem cache). `itensNoticias(n)` monta título, fato, significado, selo (`certeza`/`possibilidade`) e o "para você" com `gastoMedioCat()` (média de 3 meses das categorias cujo nome combina com o grupo do IPCA ou combustível), `livreAgora()`, `contasInvest()` e `totais()`. `cardHojeBrasil()` no Início; `telaNoticias()` (VIEW `noticias`, aba Início). **Notícias do IBGE direto do celular (D62)**: a API de notícias do IBGE recusa o robô (servidores fora do Brasil), então `buscarIbge()` (chamada por `buscarNoticias()`) pede `IBGE_URL` com `credentials:"omit"`, `referrerPolicy:"no-referrer"` e `cache:"no-store"`, no máximo 1 vez por hora (e 1 tentativa a cada 10 min), converte com `ibgeDaApi()` (data dd/mm/aaaa → aaaa-mm-dd, http → https, tira o "DESTAQUES -" do começo) e guarda `{em,itens}` em `KEY+":noticiasIbge"`; `ibgeGuardadas()` relê e revalida. `ibgeItensValidos()` é a mesma validação para o robô e para o celular (só link oficial, textos cortados). `itensNoticias()` usa a lista do celular e, se não houver, a do robô; `telaNoticias()` abre mesmo sem o arquivo do robô. O `sw.js` não intercepta pedidos a outros sites (só guarda os arquivos do próprio app).
- **Investimentos (D58)**: aplicação = conta `ativo` com `inv:{taxa,banco,ate}` (taxa em % ao ano; `ate` = até que dia o rendimento já foi calculado). `contasDinheiro()`, `dinheiroEmConta()`, `primeiraGaveta()` e as listas de Dinheiro **excluem** aplicações (não são "para usar"); `investidoTotal()` entra junto do guardado na balança, na legenda ("Guardado e investido") e nos indicadores. `diaUtil(iso)` tira fim de semana e `feriados(ano)` (fixos + `pascoa(ano)` −48, −47, −2 e +60 dias). `atualizarRendimentos()` (no `carregar()` e ao abrir Investir) soma, dia útil a dia útil, `(saldo do dia + o já calculado) × fatorDia(taxa)` com `fatorDia = (1+taxa)^(1/252) − 1`, e grava **uma anotação por mês** (`entrada`, categoria `sis:"rend"`, campo `rend: "AAAA-MM"`, atualizada a cada dia). Caixinha com `taxa` rende sobre `saldoCaixa`: a anotação vai para a conta com mais dinheiro dela (`rendCx`) e uma reserva `rend` guarda o mesmo valor na caixinha. Na aplicação, "Conferir com o banco" lança a diferença em Rendimentos (`sis:"rend"`) ou em "Impostos e taxas dos investimentos" (`sis:"invtax"`). Migração: conta chamada "Poupança" sem `inv` ganha `inv` com taxa 0 (`INV_NOVA` avisa uma vez). `telaInvestir()`, `modalInvest()`/`salvarInvest()`, ações `invAplicar`, `invResgatar`, `invEditar`.
- **Travas de coerência (D57)**: `efeitoConta(l,c)` repete a regra de `saldoConta` para uma anotação; `saldoApos(c,antes,depois)` dá o saldo se as anotações `antes` forem trocadas pelas `depois` (serve para nova, alteração e apagar). `conferirAnotacao(l,extra,antiga)` devolve `{impede,avisa}`: impede carteira negativa e cartão (passivo com `limite`, não pessoa) acima do limite; avisa banco negativo, pagar dívida a mais, receber de pessoa a mais, data a mais de 60 dias ou 5 anos e `valorEstranho()` (acima de 20 vezes a média das últimas 30 do mesmo tipo e de R$ 1.000, com pelo menos 5 anotações). `salvarFolha()` chama antes de gravar; com aviso, `janelaTrava(msgs,true)` mostra "Sim, está certo" (`fConfirma` liga `F.confirmado` e salva de novo). `fApagar` impede apagar o que deixaria a carteira negativa; `salvarGaveta()` pergunta (via `confirmar`) quando o limite é menor que a dívida. **D63**: `conferirAnotacao()` também pergunta quando a anotação usa dinheiro que está guardado numa caixinha (o saldo da conta fica abaixo do guardado, `guardadoConta`), dizendo qual caixinha; não vale quando o gasto já escolhe pagar com a caixinha (`caixaId`). `pagar` e `pPagar` usam `melhorConta()`.
- **Chat (D56, D66)**: `PERGS` é a lista das 63 perguntas (`g` grupo, `q` texto, `kw` palavras para a busca, `ir`/`aba` destino do "Ver no app" e `r()` que devolve o HTML da resposta, calculado na hora com `totais`, `pagarNoMes`, `agenda`, `indicadores`, `contasDoAno`, `compMes` etc.). `abrirChat()` usa o modal com as classes `acm chatm` e abre no grupo da aba (`ABA_GRUPO`); `responder(i)` põe a pergunta e a resposta em `#chMsgs`; `buscaPerg(txt)` pontua as perguntas pelas palavras (`norm`, 2 pontos por palavra inteira e 1 pelo começo) e devolve até 3. A pílula `.perg` (`data-a="chat"`) tem o `rostoPerg()`; `ir()` chama `pergReage(vw)`, que muda a reação (`r-nod`, `r-baixo`, `r-cima`, `r-le`) e o balão `#pergBal` só quando a aba muda. `chIr` fecha o chat e navega (com `acerto` abrindo `abrirAcerto()` e `aba` mudando `DIN_ABA`).
- **Mordomo e momentos (D54)**: `balanca(t)` desenha o **Mordomo** (`#bal`, `data-a="mordomo"`): pedestal, coluna, gravata, travessão `.beam` com os pratos `.pA`/`.pB` (as pilhas de moedas de sempre, base em y=156) e o medalhão `.md-cab` com `.md-olho`/`.md-pup`. O humor (`data-h`) vem da situação: `preocupado` se o "é meu" é negativo, `atento` se é menor que 10% do que tem ou há conta atrasada (`pagarNoMes`), senão `feliz`; a balança nunca entorta (a equação sempre fecha). Um `pointermove` move as pupilas. Os gradientes de metal são compartilhados (`#mg-oV`, `#mg-oH`, `#mg-oR`, `#mg-esm`, `#mg-prato`, gerados por `defs("mg-")` de `tools/brasao.js`) no SVG escondido do topo do `body`. `momento(tipo)` mostra `.momento` com `svgMoedinha()` (`moeda`, em `salvarFolha` para Recebi novo), `svgLacre()` (`selo`, transferência para dívida ou saída de conta fixa) e `svgPeso(false)` (`peso`, em `salvarMov` ao guardar); nada aparece com `.calmo`. `checaPesao()` roda a cada `desenhar()`: só no Início, se há atrasada e se `KEY+":pesao:"+hoje` não está marcado; `pesaoIr` abre `abrirAcerto()`.
- **Funções contábeis (D53)**:
  - **Conferir com o banco**: `modalConferir(id)` e `pintarConferir()` (estado em `CF`). `cfOk` grava `conta.conferido` (data); `cfAnotar` abre `novaFolha` com a diferença; `cfCorrigir` cria uma anotação `saida`/`entrada` comum (débito = crédito) na categoria do sistema devolvida por `catConferir(tipo)`. Essa categoria é reconhecida pela marca `sis:"conf"`, **não pelo nome**; `higienizar()` preserva `sis` e `conferido`.
  - **Contas do ano**: `contasDoAno()` usa `ocorrencias()` e `fixaPaga()` das fixas anuais. Uma caixinha com o mesmo nome (`norm`) conta como guardado. `porMes` = falta ÷ meses até o mês do vencimento, arredondado para cima em reais. `blocoContasDoAno()` fica no fim de `telaFixas()`; `cxAno` chama `modalCaixa(null,null,{nome,alvo,prazo})` (o 3º parâmetro preenche a caixinha nova).
  - **Mês a mês**: `compMes(ym)` compara `resumoMes` do mês e do anterior e devolve as 3 categorias que mais mudaram. `cardMesAMes()` abre os Gráficos (`MM_OFF`, ação `mmMes`, de −12 a 0). `cardFechou()` aparece no Início do dia 1 ao 10, uma vez por mês e por aparelho (`localStorage` `KEY+":fechou:"+ym`, ação `fechouOk`).
  - **Custo fixo de vida**: indicador `custo` (7º de 10). Soma as fixas mensais ativas nos próximos 3 meses, `valor/12` das anuais ativas nos próximos 12 meses e a média de `comprometidoMeses(3).div`. Status pela renda (`rendaMedia()`): até 50% ok, até 70% atenção.
- **Dica de instalar**: `dicaInstalar()` no Início, só se `matchMedia` existe e o app não está instalado (`display-mode: standalone` ou `navigator.standalone`); guardada por aparelho em `localStorage` (`KEY+":dicaInstalar"`), fora dos dados da pessoa; `beforeinstallprompt` vira o botão **Instalar agora** (`instalar`).
- **Planejar (cont.)**: `pagarNoMes()` agora devolve `cid`/`fid`/`ref` de cada item.
- **Removido**: os jeitos Razão e Cofre (D39) não existem mais; não há `config.jeito`.
- **Testes**: 37 arquivos, 968 verificações; o teste 03 conta 6 botões na `nav` (o `.fab` fica fora dela, direto no `body`) e 4 bolinhas no `#fabMenu`; os testes antigos abrem a folha por `abreFolha(tipo)` (toque no + e na bolinha).
- **Auditoria (1.21.1)**: `modalGaveta()` mostra, para conta `ativo` com anotações, o saldo de hoje só para ler (`.g-saldo`, sem `#gInicial`); `salvarGaveta()` mantém o `inicial` quando o campo não existe. No cartão com anotações, a lista de `abertas` diz "O que você já devia aqui antes de usar o app" e mostra o que deve hoje. `jurosCat()` e `perdasCat()` procuram `sis:"juros"`/`sis:"perdas"` (e `pagarNoMes` e o indicador de juros também); `higienizar()` aceita esses códigos e dá o código à categoria antiga com o nome de sempre (uma vez). CSS: data atrasada da agenda usa `var(--bg)` sobre `var(--out)`; regras repetidas do `.fab` e as do antigo `.seg3` saíram. `tools/noticias.js`: `tenta()` faz até 3 tentativas. `tools/medir-desempenho.js` voltou a funcionar (Relatórios na barra; salva pela pena).
- **Simplificação da interface (1.23.0, D64)**: `avisos()` monta no máximo 3 avisos e junta as contas atrasadas num só (ação `acertoIr` abre o acerto); `cardFechou()`, `cardHojeBrasil()` e `objetivosInicio()` usam `recolhivel`; `fmtRoll` e os resumos mostram R$; `modalAplicacao(id)` é a janela da aplicação (ações `aplicacao`, `invApagar`); `modalGaveta(id,tipoNovo)` abre `modalAplicacao` para contas com `inv` e aceita `data-t="passivo"` ("+ Nova dívida"); o botão Conferir fica no topo; `pergReage` mostra o balão uma vez por aba por dia (`KEY+":balao:"+aba+":"+dia`); `TERMO_NOT` dá o "?" de Selic, CDI, IPCA e Focus; `pintarAnot` põe ordem e filtros em `recolhivel("anFiltros")`. Na folha, a coluna E de Gastei e Comprei um bem tem `semInv`: `contasRapidas(excl,semInv)` tira as aplicações da lista curta (salvo favoritas) e `listaColuna` as põe por último com "(resgatar)" (1.23.1). A aba Relatórios saiu da barra (`ABA.relatorios = ABA.relatorio = "graficos"`).
- **Como cada investimento rende (1.24.0, D65)**: `MODOS_REND`; `registrarIndices(n)` guarda CDI, Selic (por data) e IPCA (por mês) das notícias em `S.config.idx` (chamada ao abrir e quando as notícias chegam, recalculando); `idxEm(k,d)` e `ipcaDoMes(ym)` leem o índice de um dia; `fatorRend(o,d)` dá o fator de um dia útil (cdi: `fatorDia(CDI do dia)×taxa/100`; ipca: taxa real mais o IPCA do mês dividido pelos dias úteis; null se falta o índice, e o cálculo espera); poupança: `taxaPoupMes` (0,5% ao mês com Selic > 8,5%, senão 70% da Selic; TR ignorada) no dia do aniversário; `rendeAuto`, `rendeTxt`, `taxaAnual` (equivalente ao ano, usado nas notícias e no chat); `lucroDe` + `estimaResgate`/`textoResgate` (IR regressivo e IOF `IOF_TAB`; sem data, 22,5% e sem IOF); `avisoTaxa` ("era isso?"); `refazerRendimentos(o,cid,cx)` apaga os lançamentos com `rend`/`rendCx` e as reservas `rend` e recalcula desde `calc0` (ou, em dados antigos, `inicioRendimentos`). Janelas: `modalInvest` com `blocoComoRende`/`camposRende` (ações `rendModo`, `rendIr`), `modalAplicacao`, `modalConferirCaixa` (ações `cxConferir`, `cxcOk`, `cxcRend`, `cxcGuard`), `modalConferirTudo` (lembrete semanal: `lembreteConferir` em `avisos()`, ações `conferirTudo`, `confTudoOk`, `confSemana`; dispensa por semana em `KEY+":lembConf:"+segunda-feira`). Primeiros passos: `oModoRend`.
- **"Ver no app" exato (1.24.1, D66)**: `ALVOS` liga cada pergunta (pelo texto) a `{v, aba, foco}` ou `{v, acao}`; vira `p.alvo`. O botão leva `data-i`; `chIr` chama `irPara(alvo)`, que navega e, 60 ms depois, roda a ação ou `destacar(seletor)`: abre os `<details>` em volta (e lembra), rola até o lugar e aplica `.destaque` (borda dourada que pisca 2 vezes; parada com `.calmo`). Ids novos para destino: `#ind-<id>` em cada indicador, `#cardAgenda`, `#contasDoAno`, `#nt-<id>` em cada notícia.
- **Versão**: 3 lugares sobem juntos (`package.json`, `VERSAO_APP`, `sw.js`).
- **Redesign, fase B (1.25.0, D67)**: `aviso()`/`proxAviso()`/`fimAviso()` com a fila `AVISOS` (um visível; o novo entra na hora, menos quando o atual tem "Desfazer" e tem menos de 3 s; `toast` e `toastDesfazer` passam por ela). Balão do Perguntar: uma vez por aparelho (`KEY+":balao1"`), nunca com aviso ou `#pesao` na tela. Diálogos: `abrirModal`/`fecharModal`, `abrirFolha`/`fecharFolha` chamam `lembrarGatilho()`, `fundoInerte()` (atributo `inert` em tudo fora da janela, menos `#toast`), `focarTitulo()` e `devolverFoco()`; o `keydown` geral contém o Tab (`focaveis()`), e o Enter num campo clica no Salvar da folha ou no único `.btn` principal da janela. `ajuda()` é um ⓘ com `aria-controls`. Panorama: `baseMinima()` (30 dias de anotações ou `S.config.renda`), `contagemPanorama(L)` (ok, atencao, critico, info, aguardando), `seloInd(st)` mostra "Aguardando dados" no lugar de "Saudável" sem base (o `st` calculado não muda). Metas: `jarraMeta` enche com o gasto (≥80% âmbar; acima da meta, cheio, vermelho, `.transb`). Instalar: `plataforma()` (ios/android/computador) e `textoInstalar()`; Ajustes > Ajuda tem o passo a passo. Token `--campo` (#8C8473 / #7C7566) nas bordas de controles. Massa e golden: `tests/golden/` (`fixture.js` com o relógio parado em 9/11/2026, `capturar.js`, `gerar.js`).
- **Redesign, fase C (1.26.0, D67)**: bloco "componentes base" no fim do `<style>` (botão tinta, secundário com contorno, selecionado em tinta, campos com `--color-border-field` de 1,5 px, foco com anel de 2 px e afastamento de 2 px, latão claro sobre tinta, aviso em faixa de tinta, diálogo com `--color-scrim`, cartões com `--raio-g`). Selos: `ST.critico` = "✕". `cardIndicador` usa a classe do estado mostrado (sem base mínima, `st-sem`). Barra de baixo com colunas `minmax(0,…)` e rótulo cortado com "…" (não estica em 320 px). `tools/conferir-larguras.js` abre o app no Chrome em 320 px (14 telas × 3 letras × 2 temas) e falha se algo passa da largura; também confere se as duas letras carregaram.
