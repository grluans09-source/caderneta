# Análise contábil do Caderneta

Estado analisado: **versão 1.13.1-beta.1** (7 nov 2026); as funções escolhidas entraram na 1.14.0 (seção 6). Passo 2 do plano combinado com o dono.

Pergunta do dono: o que no app é **contabilidade de verdade** e o que é **função criada por ele**? E que funções contábeis poderiam agregar?

Resumo em uma frase: **o app é contabilidade de verdade por dentro** (partidas dobradas, balanço e resultado), **com palavras do dia a dia por fora**. Em volta desse motor, há ferramentas de **finanças pessoais** e várias ideias **próprias do dono** que deixam o uso fácil.

---

## 1. Contabilidade de verdade (já está no app, escondida)

| No app (palavras comuns) | Nome na contabilidade | O que isso garante |
|---|---|---|
| Toda anotação mexe em dois lugares (de onde saiu, para onde foi) | **Partidas dobradas** (débito e crédito) | A conta sempre fecha. Os testes conferem isso em cada anotação |
| "O que eu tenho" | **Ativo** | Dinheiro, contas, bens e o que outras pessoas te devem |
| "O que eu devo" | **Passivo** | Cartão, empréstimos, carnês e dívidas com pessoas |
| "É meu de verdade" e a **balança** | **Patrimônio líquido** e a equação **Ativo = Passivo + PL** | A balança é o balanço patrimonial desenhado |
| "Entrou", "Saiu", "Sobrou" | **Receitas, despesas e resultado** (uma DRE simplificada) | Mostra se o mês deu lucro ou prejuízo |
| Contas versus categorias | **Contas patrimoniais** versus **contas de resultado** | Separa "onde o dinheiro está" de "por que ele mudou" |
| Gasto no cartão conta no dia da compra | **Regime de competência** | O mês mostra o gasto real, não só o que foi pago |
| Compra parcelada | Despesa reconhecida na compra, **passivo** com vencimentos | Cada parcela tem data, e a soma sempre fecha |
| Transferir entre contas e pagar dívida | **Fato permutativo** (não muda o patrimônio) | Pagar o cartão não é "gastar de novo" |
| Bem que valoriza ou desvaloriza (taxa ao ano) | **Reavaliação** e **depreciação** | Carro e celular perdem valor no patrimônio, sem passar por "Saiu" |
| Juros e multas | **Despesa financeira** | Mostra quanto se perde com atraso |
| Pessoas que me devem / que eu devo | **Contas a receber** / **contas a pagar** | Com data de cobrança e de vencimento |
| Valor de antes de usar o app | **Saldo de abertura** | O balanço começa certo no primeiro dia |
| Modo "contador" nos Ajustes | Vocabulário técnico | Ativo, Passivo, Patrimônio líquido, Receitas, Despesas, Resultado |
| Indicadores: folga para 30 dias, peso das dívidas, de que é feito o que você tem | **Análise de balanço** (liquidez, endividamento, composição do ativo) | Os 9 relatórios são análise de balanço traduzida |

## 2. Finanças pessoais (não é contabilidade, mas é gestão de dinheiro)

| Função | Na teoria | Comentário |
|---|---|---|
| Metas do mês por categoria | **Orçamento** (contabilidade gerencial) | Planejar antes, comparar depois |
| Contas fixas (mensais e anuais) | **Despesas recorrentes** | Entram na agenda e no "falta pagar" |
| Agenda e acerto de contas | **Fluxo de caixa projetado** e **contas a pagar** | O acerto é o jeito do app de pagar uma a uma |
| Reserva de emergência e taxa de poupança | Indicadores de finanças pessoais | Padrões de educação financeira |
| Simulador de quitação | **Matemática financeira** | Juros, prazos e parcelas |

## 3. Funções criadas pelo dono (experiência de uso)

| Função | Por que é boa |
|---|---|
| **Caixinhas** (dinheiro "carimbado" sem sair da conta) | Parecido com uma **reserva** do patrimônio, mas sem lançamento contábil. Organiza sem complicar |
| **Conta Dinheiro** com contagem de cédulas e sugestão de arredondar | Uma conferência física do caixa, coisa que nenhum app comum faz |
| Anotar em dois toques, bolinhas e favoritas | Velocidade: menos toques, mais anotações certas |
| Balança no Início | Ensina a equação do balanço sem dizer "balanço" |
| Relatórios "de consultor" | Transforma indicadores em conselhos |
| Desfazer, cópia dos dados e aviso de "atrasada" | Segurança para quem tem medo de errar |
| Frases do dia, visual vivo, mascote (a fazer) | Vontade de abrir o app todo dia |

## 4. Pontos frágeis que a auditoria (passo 8) deve olhar

- **"Já pago" de juros e multas depende do nome da categoria.** Se a pessoa renomear "Juros e multas", o acerto de contas e o indicador de juros deixam de reconhecer esses pagamentos. Melhor marcar a categoria por um código fixo, não pelo nome.
- **"Sobrou" (resultado) não é "quanto o saldo subiu".** Com cartão, a pessoa pode ter "sobrou R$ 500" e ver a conta do banco cair, porque a fatura do mês passado foi paga. Isso está certo na contabilidade, mas confunde. A sugestão 2 abaixo resolve.
- **As caixinhas ficam fora da contabilidade.** Funciona, mas quando elas passarem a **render** (Investimentos), o rendimento **precisa** virar receita de verdade, senão o patrimônio fica errado.

---

## 5. Funções contábeis que poderiam agregar

Ordem por **valor para quem usa** e **esforço**. Nenhuma precisa de servidor.

| # | Função | O que a pessoa ganha | Esforço |
|---|---|---|---|
| 1 | **Rendimento como receita financeira** (vai junto com Investimentos) | O rendimento aparece separado do salário: "você ganhou R$ 32 sem trabalhar" | Médio, já faz parte do passo 6 |
| 2 | **De onde veio e para onde foi o dinheiro** (fluxo de caixa do mês) | Explica por que "sobrou R$ 500" mas o banco caiu R$ 200 (fatura, compra de bem, empréstimo) | Médio |
| 3 | **Conferir o saldo com o banco** (conciliação) | A pessoa digita o saldo que vê no banco; o app mostra a diferença e oferece corrigir com uma anotação de ajuste. É o que a contagem de cédulas já faz para o Dinheiro | Baixo |
| 4 | **Guardar para as contas do ano** (provisão) | IPVA, IPTU, matrícula e presentes: o app divide por 12 e mostra quanto separar por mês | Baixo, usa as contas fixas anuais |
| 5 | **Relatório para o Imposto de Renda** | Lista de **bens e direitos** e **dívidas** em 31/12, mais **gastos dedutíveis** (saúde e educação), no formato da declaração | Médio |
| 6 | **Fechar o mês** | Um resumo do mês guardado e a comparação com o mês anterior ("gastou 12% menos com mercado") | Baixo |
| 7 | **Custo fixo de vida** (ponto de equilíbrio) | "Para pagar só o básico você precisa de R$ 2.340 por mês" | Baixo |
| 8 | **Etiquetas** (centro de custo) | Ver quanto custou uma viagem, uma reforma ou um filho, misturando categorias | Médio |

**Recomendação:** 3, 4, 6 e 7 agora, porque são baratas e muito úteis. A 1 entra com Investimentos e a 2 logo depois. A 5 fica para o começo do ano, perto da declaração. A 8 fica por último.

## 6. Decisão do dono (7 nov 2026)

Aprovada a recomendação: **3, 4, 6 e 7 feitas na versão 1.14.0** (conferir com o banco, contas do ano, mês a mês e custo fixo de vida; decisão D53). A **1** entra com Investimentos (passo 6 do plano), a **2** logo depois, a **5** perto da declaração do Imposto de Renda e a **8** por último. Os pontos frágeis da seção 4 ficam para a auditoria (passo 8).

> Nota de implementação: a categoria "Diferença ao conferir" já nasce marcada por código (`sis:"conf"`), como a seção 4 recomenda. A categoria "Juros e multas" ainda depende do nome.
