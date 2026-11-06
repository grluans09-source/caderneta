# Caderneta (v2, do zero)

App de finanças pessoais (pessoa física), mobile-first, instalável (PWA), **sem servidor e sem banco de dados**. Cada pessoa guarda os próprios dados no celular (`localStorage`). Contabilidade de partida dobrada por baixo; na tela, só linguagem comum.

Idioma de tudo: **português do Brasil**. Público: do idoso ao jovem e ao adulto na correria. Em qualquer dúvida de design, escolher o mais simples de entender.

## Arquivos
- `index.html`: app inteiro (HTML + CSS + JS puro, uma IIFE). Sem framework, sem dependência externa, sem fontes da internet.
- `sw.js`: cache para abrir sem internet. **Subir `VERSAO` a cada release** (e listar arquivos novos em `ARQUIVOS`).
- `manifest.webmanifest`, `icon.svg`, `icon-*.png`: instalação na tela inicial.

## Regras de ouro
- Nunca `alert()`, `confirm()`, `prompt()`. Usar `confirmar()` e os modais próprios.
- Valores em **centavos (inteiros)**. Nunca float para dinheiro.
- Lançamentos apontam para gavetas e categorias por **id**, nunca por nome.
- Todo dado vindo do `localStorage` ou de backup passa por `higienizar()`. Dado ilegível nunca é sobrescrito sem antes guardar cópia (`caderneta:v2:corrompido`).
- Acesso ao storage só via `lsGet`/`lsSet` (pode lançar exceção em modo privado).
- Texto de usuário sempre com `esc()`. Ids só `[A-Za-z0-9_-]`.
- Linguagem da tela: "gaveta", "gastei/recebi/mudei de lugar", "É meu de verdade". Termos técnicos só no "Modo contador" (`VOC`).
- Alvos de toque grandes, cor nunca é a única pista (sempre + / − e texto), suporte a letra grande (`data-tam`) e tema escuro.

## Identidade visual: "o livro-razão vivo"
Conceito: um escritório de contabilidade antigo, vivo. A pessoa sente a contabilidade pela estrutura da tela, sem jargão. O "exótico" vive no visual; navegação e textos continuam em português comum.
- Peças que passam o ar contábil: conta em T na tela Anotar (de onde saiu | para onde foi, com fio dourado), balança (Tenho = Devo + É meu) que balança e assenta ao lançar, papel com margem vermelha e linhas pontilhadas entre nome e valor, sublinhado duplo em totais, carimbo "LANÇADO", capa verde de livro-caixa com filete de latão.
- Cores: papel creme, verde de capa (`--capa`), latão (`--latao`), azul tinta = entrou, vermelho tinta = saiu. Modo escuro = "lamparina".
- Movimento (config `movimento`: "vivo"|"parado"): números que rolam (`data-roll`), balança (`WOB`), moeda no fio, carimbo, página virando nos relatórios, linha nova entrando. Tudo respeita "Parado" e `prefers-reduced-motion` (classe `calmo` no `<html>`; `calmo()` no JS). Animar só `transform`/`opacity`.
- Letra "Enorme" (`data-tam="gg"`): a conta em T vira lista de uma coluna e o fio some.
- Testes em jsdom rodam com a classe `calmo` ligada (sem esperas de animação). Animação só se confere no navegador, com o painel visível (painel escondido congela as animações).

## Procurar, filtrar e ordenar anotações
- Listas longas nunca aparecem inteiras: no máximo 15 linhas por vez, com "Mostrar mais (N restantes)". Tela `anotacoes` (atalho no Início e em Mais) e a lista de Relatórios usam o mesmo bloco (`blocoAnotacoes` + `pintarAnot`, estado `AN`). Ordenar por Data, Valor ou Nome (tocar de novo inverte ↑↓; data e valor começam do maior/mais recente, nome de A a Z). Busca por nome, categoria, conta, valor ou data, sem diferenciar acento ou maiúscula. Filtros: tipo (Tudo/Gastos/Ganhos/Transferências/Bens) e "Mais filtros" (período, conta, categoria; em Relatórios não há período porque o mês já vem das setas). Padrão da tela Anotações = "Este mês". `pintarAnot` só repinta `#anotCtl`/`#anotLista` para a busca não perder o foco. Se criar outra lista que possa crescer, reutilizar esse bloco.

## O que pagar no mês
- `pagarNoMes(ym)` soma o que vence naquele mês: parcelas/faturas de dívidas (`aPagar()`, já abatidas pelos pagamentos), contas fixas não pagas nem puladas e dívidas com pessoas. No mês de hoje entram também as atrasadas e as sem data. "Já pago" = transferências para dívidas, contas fixas pagas por conta de dinheiro (não por cartão, para não contar duas vezes) e juros/multas. `cartaoPagar(ym,opções)` desenha o cartão (Início, Planejar só com o total, Relatórios no mês escolhido). Rótulos: "Falta pagar em / Vai vencer em / Ficou em aberto em".

## Vocabulário na tela (regra)
Falar como a pessoa fala. Na tela: "conta" (carteira, banco, poupança, cartão), "Transferi entre contas", "previsão", "Perdeu valor / Ganhou valor", "anotação", "ANOTADO" (carimbo), "o que ainda deve". NUNCA na tela comum: gaveta, partida dobrada, lançamento, saldo devedor, comprometido, projeção, débito/crédito (esses só no Modo contador). Nomes internos (`data-a="gaveta"`, `modalGaveta`, `tipo:"transferencia"`) continuam como estão. O teste `t9` varre todas as telas atrás dessas palavras: rodar sempre que mexer em textos.
- Apagar conta, bem ou pessoa com anotações é permitido, com aviso do que sai junto (anotações, contas fixas); equivale a "nunca existiu".

## Modelo
- `S = { contas, categorias, lancamentos, config }`, chave `caderneta:v2`.
- Conta (gaveta): `{ id, nome, tipo: "ativo"|"passivo", inicial, fecha?, vence?, limite?, abertas? }`.
- `abertas: [{data|null, valor}]` (só em dívida): o que a pessoa já devia ao começar, separado por vencimento (ex.: 190 em 05/11 + 15 em 05/12). `inicial` é sempre a soma de `abertas` quando existe. Sem `abertas`, `inicial` vira um item sem data.
- Categoria: `{ id, nome, tipo: "despesa"|"receita" }`.
- Lançamento: `{ id, tipo: "saida"|"entrada"|"transferencia", valor, desc, contaId, destinoId, catId, data, parcelas? }`.
- `parcelas: [{data, valor}]` é só o cronograma de pagamento; a despesa inteira nasce na data da compra (competência). Compra em gaveta de dívida sempre gera `parcelas` (mesmo à vista = 1).
- Backup: `{ app:"caderneta", versao:2, dados:S }`.

## Motor contábil
- saída: D categoria / C gaveta · entrada: D gaveta / C categoria · transferência: D destino / C origem.
- Ativo cresce a débito, passivo a crédito. PL = ativo − passivo. Só competência (sem regime de caixa).
- Pagar fatura = **transferência** banco → cartão, nunca nova despesa.
- Contas a pagar (`itensDevidos`/`aPagar`): pagamentos quitam as parcelas mais antigas primeiro (FIFO).
- Ciclo do cartão (`proximoFechamento`, `primeiroVencimento`): compra até o dia do fechamento (inclusive) entra na fatura que fecha neste mês. Se `vence > fecha`, vence no mesmo mês do fechamento; senão, no seguinte. Dia inexistente cai no último dia do mês. `addMes` nunca "rola" para o mês seguinte.
- Casos que não podem regredir: fecha 25/vence 5 (20/set→05/out, 27/set→05/nov); fecha 1/vence 5 (12/set→05/out, 01/set→05/set); fecha 5/vence 15 (04/set→15/09, 06/set→15/10); virada de ano; vencimento 31 em fevereiro.

## Funções de planejamento (v3)
- Menu: Início · Dinheiro · [+ Anotar] · Planejar · Mais. Planejar leva a Caixinhas, Contas fixas e Simulador; Mais leva a Relatórios e Ajustes (`ABA` marca a aba certa).
- **Pessoas** (gaveta com `pessoa:true`, `cobrar?`): emprestei = conta `ativo` (a receber), peguei emprestado = conta `passivo`. É tudo transferência (nada de gasto). Perdoar dívida = saída para a categoria "Dívidas não pagas" (aí sim vira despesa). Dívida com pessoa `passivo` entra em `aPagar()`.
- **Contas fixas** (`S.fixas`): compromisso futuro, NÃO é despesa até a pessoa tocar em "Paguei" (cria saída com `fixaId` + `ref` "AAAA-MM"). `puladas` guarda meses pulados. Sem notificação (não há servidor): o app avisa ao abrir, na agenda e na tela inicial.
- **Caixinhas** = organização PESSOAL, fora da contabilidade (não geram partidas, não aparecem no balancete, não mexem no PL). (a) meta do mês = `categoria.meta`; (b) caixinha de guardar (`S.caixas`), movida por `S.reservas {de,para}` onde `"livre"` é o dinheiro livre. Gasto pago com caixinha = `lancamento.caixaId`. Regra: só contam o **dinheiro que existe nas contas** (`dinheiroEmConta()` = contas de dinheiro, sem dívidas, bens nem o que devem a você). Invariante: `dinheiroEmConta = livreAgora + totalReservado`. Livre pode ficar negativo se o dinheiro sair das contas por fora; a tela avisa. Na balança/legenda (modo comum) o guardado SAI de "Dinheiro que eu tenho" e aparece como "Guardado nas caixinhas" (moedas roxas, `t.guardado`); o "é meu" não muda. No Modo contador as caixinhas são ignoradas. Os saldos de cada conta (Dinheiro) continuam reais, iguais ao banco. Botão "Usar o dinheiro guardado" (Início) = `modalTirarRapido`.
- **Guardado por conta**: cada movimento em `S.reservas` pode ter `conta` (de qual conta sai o dinheiro ao guardar). `bucketsCaixa(id)` calcula em qual conta está o dinheiro de cada caixinha (movimentos e gastos `caixaId` em ordem de data; tirar e gasto liberam primeiro o da conta escolhida/que pagou, depois o resto). `guardadoConta(c)`, `livreConta(c)` = saldo real − guardado dela; guardar só vale até o livre da conta escolhida. Movimento antigo sem `conta` cai na primeira conta de dinheiro. Apagar a conta apaga os movimentos de caixinha dela.
- **Início**: "Minhas caixinhas" = cofres animados (`cofreSvg`: moedas empilhadas por % do alvo, moeda caindo em loop e brilho) e "Metas do mês" = potes. O cartão "O que pagar" tem setas de mês (`PAG_OFF`, de −2 a +11; reinicia ao voltar ao Início) que só atualizam `#cardPagar`.
- **Simulador**: não grava nada. `comprometidoMeses(12)` = dívidas em aberto + contas fixas por mês; compara com a renda (`rendaMedia()` ou `config.renda`). Semáforo é referência, não conselho.
- Gráfico "para onde o que é meu está indo": do primeiro mês de uso (até 5 atrás) até 6 meses à frente; futuro = projeção pela sobra média dos últimos meses, pontilhado.
- Frases da capa: lista `FRASES` (autores reais, tradução livre); troca por dia e ao tocar. Conferir a fonte ao incluir novas.
- Valores digitados sempre mostram "R$" (`ligarDinheiro`). O botão Salvar da tela Anotar fica no fim do formulário, em ordem de uso (não é fixo/sticky).

## Bens (carro, casa, TV, celular)
- Regra contábil: o app conta DINHEIRO e BENS cadastrados. Consumo (comida, conta de luz) é gasto e reduz o "é meu". Bem que guarda valor é "Comprei um bem": `lancamento.tipo="bem"` com `destinoId` = conta `bem:true`. Partidas: D bem / C gaveta (ou cartão, com parcelas). Não é despesa e o PL não muda na compra.
- Conta de bem: `{bem:true, tipo:"ativo", taxa (% ao ano; negativo = perde valor), desde, ajustadoAte}`. Bens ficam fora das listas de gavetas do Anotar e de `contasNormais()`.
- Valor muda por `lancamento.tipo="ajuste"` (`sinal:"alta"|"baixa"`, `contaId`=bem): alta = D bem / C "Valorização de bens" (categoria virtual `__valoriza`); baixa = D "Desvalorização de bens" (`__desvaloriza`) / C bem. Ajuste NÃO entra em Entrou/Saiu (é `resumoMes().aj`); entra no PL e no balancete.
- `atualizarBens()` roda ao abrir e ao restaurar backup: um ajuste por mês completo, composto (taxa/12 sobre o valor do fim do mês), idempotente via `ajustadoAte`.
- Venda: ajuste até o preço (ganho/perda) + transferência bem → gaveta.
- `livreAgora()` = dinheiro nas contas − caixinhas (ver Caixinhas); dívidas e bens não entram.
- Balança: esquerda = dinheiro (moedas verdes) + bens (azuis); direita = dívidas (vermelhas) + sobra (douradas).

## Bem que já se tem (quitado ou ainda pagando)
- "Já tenho um bem" cria a conta do bem com `inicial` = valor de hoje. Se "Ainda estou pagando" estiver ligado, cria também a dívida `"Financiamento: <bem>"` (`passivo`, `inicial` = saldo devedor, `abertas` = parcelas mês a mês a partir da data informada, via `dividir`). PL inicial = valor − saldo devedor. O saldo devedor NÃO inclui juros futuros: os juros entram parcela a parcela pelo campo de juros ao pagar.
- Compra com entrada + financiamento: anotar dois "Comprei um bem" para o mesmo bem (um pagando com a gaveta, outro na dívida).

## Pagar dívida com juros
- Ao "Mudar de lugar" para uma gaveta `passivo`, o campo opcional "quanto foi de juros ou multa?" (`F.juros`) divide o pagamento em DOIS lançamentos: a transferência só do principal (abate a dívida) e uma saída do mesmo valor de juros, paga pela gaveta de origem, na categoria "Juros e multas" (`jurosCat()`, criada sob demanda). Assim o gasto aparece em Saiu e o PL cai só pelos juros. Juros devem ser menores que o valor pago.

## Como testar depois de qualquer mudança
1. Extrair o `<script>` e rodar `node --check`.
2. Testar com jsdom numa CÓPIA do arquivo com um hook temporário (`window.__T`), nunca no original: onboarding, gasto, compra parcelada, pagar fatura, editar/apagar, backup ida e volta, todas as telas.
3. Conferir no navegador em 375×812 (tela de Anotar, Início, Gavetas, Relatórios) e em letra "Enorme".
4. Durante o desenvolvimento, o service worker serve a versão antiga: desregistrar o SW e limpar o cache antes de conferir.

## Pendências / ideias
- Gastos fixos que se repetem (aluguel, salário) e envelopes/limite por categoria.
- Lembrete de vencimento por notificação (exige permissão do navegador; avaliar).
- Gráfico de rosca por categoria.
- Teste com pessoas reais: um idoso, um jovem, alguém na correria.
- Hospedagem estática gratuita (GitHub Pages ou Netlify) para distribuir o link.
