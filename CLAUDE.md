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
