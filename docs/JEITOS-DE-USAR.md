# Jeitos de usar (o app inteiro em 3 organizações)

Decisão do dono (6 nov 2026): o app oferece **3 jeitos de usar** e a pessoa escolhe o melhor para ela, em **Ajustes > Aparência > Jeito de usar**. Os jeitos valem para **o app todo**: visual **e** como as telas e funções são distribuídas. O visual antigo ("livro-razão vivo" com 5 abas) deixa de ser uma opção separada: a Balança é a evolução dele.

**Regra de ouro:** os dados, o motor contábil e as regras são **os mesmos** nos três. Trocar de jeito não muda nenhum número, só a organização. Vale o [mapa do app](MAPA-DO-APP.md): cada assunto continua morando em um lugar só.

## Como cada jeito distribui o app

| | **A. Balança** (padrão) | **B. Razão** | **C. Cofre e fluxo** |
|---|---|---|---|
| Ideia | O essencial: uma balança e poucos botões | Um livro-caixa aberto | Contas como cofres ligados por canos |
| Barra de baixo | Início · Dinheiro · **+** · Planejar · Mais | Livro · Contas · **+** · A pagar · Mais | Cofres · **+** · Planejar · Mais |
| **Início** | Balança, botões **Gastei/Recebi**, resumo do mês, falta pagar, avisos, 3 últimas anotações | O **livro do mês**: página "Entrou" e página "Saiu", setas de mês, "Sobrou no mês", falta pagar, avisos | **Cofres**: um vaso por conta e por cartão (verde = para usar, roxo = guardado, vermelho = dívida), atalhos para Contas, Bens, Pessoas e Caixinhas, falta pagar, 3 últimas anotações |
| **Dinheiro / Contas** | Abas Contas, Dívidas, Bens, Pessoas; contas em linhas | Mesmas abas; a aba Contas é um **livro** com as páginas "Tenho" e "Devo" | Mesmas abas; a aba Contas são **cofres** (vasos). O botão Dinheiro sai da barra e a tela é aberta pelos atalhos do Início |
| **Planejar / A pagar** | Cartão do mês, agenda e ferramentas | O mês é um **livro** com as páginas "A pagar" e "Já pago"; título "A pagar" | O mês são **canos** que se esvaziam, um por conta a pagar |
| **Anotar** | Folha de duas colunas "Anotar" | "Escrever no livro": as duas colunas são páginas do livro, com linhas de caderno | "Mover o dinheiro": cada conta é um cofre com seu nível; "De qual cofre sai" e "Para qual cofre vai" |
| **Mais** | Anotações, Relatórios, Ajustes em cartões | Vira o **Índice** do livro (linha pontilhada e resumo de cada item) | Peças em forma de **cofre** |
| **Anotações** | Lista como hoje | Linhas em itálico, como livro-caixa | Faixa dourada na lateral de cada linha |
| **Relatórios** | Barras | Barras tracejadas | **Canos** (vermelho: saiu; verde: veio) |
| **Ajustes** | Grupos Aparência, Dados e Ajuda | Os grupos viram **Capítulo 1, 2 e 3** | Um pequeno cano antes de cada grupo |
| Cara da capa | Verde | Marrom (papel e tinta) | Azul-petróleo (água) |

## O que já está feito (versão 1.7.1-beta.1)
- Escolha do jeito em Ajustes, guardada com os dados e protegida contra valor inválido.
- Barra de baixo com nomes diferentes por jeito, e sem o botão Dinheiro no jeito Cofre.
- **Todas as telas (Início, Planejar, Dinheiro, Anotar, Mais, Anotações, Relatórios e Ajustes) nos 3 jeitos** (etapas J1 a J5)
- **Primeiros passos com a escolha do jeito** (etapa J6): o 2º dos 4 passos, com miniaturas..
- Cor da capa própria de cada jeito.

## Conferência final (etapa J7, feita)
Nos 3 jeitos, com letra Enorme, tema escuro e Movimento parado e vivo, em 375 px de largura, 16 telas, nenhuma passa da largura da tela. Corrigidos: páginas do livro (Razão) com letra Enorme, número grande do Início quebrando, e cofres com nome longo.

**Não conferido:** celular de verdade (Android e iPhone), tema escuro com aparelho em modo automático, e leitores de tela.

## Como testar
`npm test` roda `tests/18-jeitos-de-usar.test.js`: troca entre os 3 jeitos, confere a barra, o Início de cada um e que a escolha fica salva.
