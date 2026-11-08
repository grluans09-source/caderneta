# Chat do Balancete: as perguntas prontas

Passo 5 do plano: **aprovado pelo dono em 7 nov 2026 e no app desde a versão 1.18.0** (D56). **Revisado na 1.24.1** (pedido do dono, 8 nov 2026): respostas atualizadas para o app de hoje (aba Saúde, seções de Ajustes, como cada investimento rende, atualizar o valor, novas travas), **10 perguntas novas** (agora são 63) e o **"Ver no app" leva ao lugar exato** (tabela no fim). Mudou uma pergunta ou resposta? Atualize aqui e em `PERGS` no `app/index.html`. O chat é o Mordomo respondendo. Tudo funciona **sem internet e sem inteligência artificial**: são perguntas prontas, e o app calcula as respostas com os dados que a própria pessoa anotou.

## Como vai funcionar

- **Pílula "Perguntar"** no canto esquerdo de baixo (D55), com o rostinho do Mordomo. A cada troca de aba, ela diz uma frase curta da aba e reage.
- Ao tocar, sobe a **janela do chat** (preta e dourada, como o acerto de contas), com:
  - **5 grupos** de perguntas em botões: *Meu dinheiro*, *Contas e dívidas*, *Planejar*, *Como usar o app*, *Aprender*;
  - um campo **"Escreva sua dúvida"**: o app procura a pergunta mais parecida pelas palavras ("quanto gastei", "fatura", "cópia", "celular novo"...) e mostra as 3 mais próximas. Não inventa resposta;
  - as perguntas da **aba onde a pessoa está** aparecem primeiro (no Planejar, as de planejar).
- Cada resposta é **curta**, no tom do Mordomo (educado e caloroso, sempre "você") e, quando faz sentido, tem um botão **"Ver no app"** que leva à tela certa.
- **Três tipos de resposta:**
  - **[dados]**: calculada com as anotações da pessoa, na hora;
  - **[app]**: ensina a usar o app;
  - **[aprender]**: educação financeira simples.
- **O que o chat não faz:** não recomenda investimento específico (não é consultor licenciado), não manda dados para lugar nenhum e não finge entender o que não está na lista.

## As perguntas (53 originais; as 10 novas estão logo depois)

### Meu dinheiro (11)

| # | Pergunta | Tipo | Como responde |
|---|---|---|---|
| 1 | Quanto dinheiro eu tenho agora? | dados | Soma das contas, separando "para usar agora" e "guardado nas caixinhas" |
| 2 | Quanto é meu de verdade? | dados | O "é meu de verdade" e o que significa: tudo o que tem menos tudo o que deve |
| 3 | Quanto posso gastar por dia até o fim do mês? | dados | (Para usar agora − o que falta pagar no mês) ÷ dias que faltam. Ex.: "Cerca de R$ 42 por dia até 30/11" |
| 4 | Quanto eu gastei este mês? | dados | Total do mês e a categoria que mais pesou |
| 5 | Com o que eu mais gasto? | dados | As 3 categorias que mais pesaram no mês, com a porcentagem de cada uma |
| 6 | Gastei mais ou menos que no mês passado? | dados | A comparação do Mês a mês ("R$ 100 a menos, −8%") e o que mais mudou |
| 7 | Quanto entrou de dinheiro este mês? | dados | Total que entrou e de onde veio |
| 8 | Quanto sobrou no mês passado? | dados | Entrou − saiu do mês passado, com a frase de comparação |
| 9 | Quanto tenho guardado nas caixinhas? | dados | Total e quanto tem em cada caixinha |
| 10 | Quanto tenho em cada conta? | dados | Lista das contas com o saldo de cada uma e a data da última conferência com o banco |
| 52 | Quanto meus investimentos renderam? | dados | Total investido, quanto rendeu no mês e no ano, e cada aplicação com a taxa. Acrescentada na 1.20.0 |

### Contas e dívidas (9)

| # | Pergunta | Tipo | Como responde |
|---|---|---|---|
| 11 | Quanto eu devo ao todo? | dados | Total e quanto deve em cada lugar (cartões, empréstimos, pessoas) |
| 12 | O que vence esta semana? | dados | Contas dos próximos 7 dias, com data e valor |
| 13 | Tenho alguma conta atrasada? | dados | Quais, há quantos dias, e o botão para o acerto de contas |
| 14 | Quanto falta pagar este mês? | dados | O "falta pagar" do mês e o que já foi pago |
| 15 | Qual dívida eu pago primeiro? | dados + aprender | Ordem sugerida: atrasadas primeiro, depois a de juros mais caros (ou a menor, para ganhar ânimo), com a lista da pessoa |
| 16 | Quando vence a fatura do cartão? | dados | Dia de fechamento e vencimento de cada cartão e o valor da próxima fatura |
| 17 | Quanto do limite do cartão eu já usei? | dados | Usado, limite e disponível de cada cartão |
| 18 | Quanto paguei de juros e multas? | dados | Últimos 6 meses e quanto isso representa do que recebeu |
| 19 | Quem me deve dinheiro? | dados | Pessoas que devem, quanto e quando combinaram pagar |

### Planejar (8)

| # | Pergunta | Tipo | Como responde |
|---|---|---|---|
| 20 | Quanto custa minha vida básica por mês? | dados | O custo fixo de vida e de que ele é feito |
| 21 | Quanto preciso guardar para o IPVA, IPTU e outras contas do ano? | dados | As contas do ano e quanto separar por mês |
| 22 | Minha reserva de emergência é suficiente? | dados + aprender | Quantos meses o guardado cobre e a meta de 3 a 6 meses |
| 23 | Estou dentro das metas do mês? | dados | Cada meta com quanto já foi e quanto ainda cabe |
| 24 | Quanto da minha renda já tem destino? | dados | O indicador "Quanto da renda já tem dono", explicado |
| 25 | Se eu comprar algo parcelado, cabe no meu bolso? | app | Explica e abre o Simulador "e se eu comprar" |
| 26 | Quanto falta para completar minha caixinha? | dados | Para cada caixinha com alvo: quanto falta e quanto guardar por mês até a data |
| 27 | Minhas finanças estão saudáveis? | dados | Resumo dos 10 indicadores: quantos estão saudáveis, em atenção e em alerta, e o mais urgente |

### Como usar o app (14)

| # | Pergunta | Tipo | Como responde |
|---|---|---|---|
| 28 | Como eu anoto um gasto? | app | Pena → Gastei → valor → de onde saiu → para onde foi → Salvar |
| 29 | Como anoto uma compra parcelada? | app | Na folha de gasto, escolher o cartão e o número de parcelas |
| 30 | Como pago uma conta ou a fatura? | app | Planejar → Acerto de contas → Pagar (ou Paguei, na conta fixa) |
| 31 | Como passo dinheiro de uma conta para outra? | app | Pena → Transferi entre contas |
| 32 | Anotei errado. Como corrijo ou apago? | app | Tocar na anotação para alterar ou apagar; o "Desfazer" aparece logo depois |
| 33 | Como guardo dinheiro numa caixinha? | app | Planejar → Caixinhas → Guardar; o dinheiro continua na conta e continua seu |
| 34 | Como cadastro uma conta fixa (aluguel, internet)? | app | Planejar → Contas fixas → Nova conta fixa (todo mês ou todo ano) |
| 35 | Como confiro o saldo com o banco? | app | Dinheiro → tocar na conta → Conferir com o banco |
| 36 | Como cadastro meu carro ou minha casa? | app | Dinheiro → Bens, ou Pena → Comprei um bem |
| 37 | Como anoto dinheiro que emprestei ou que devo a alguém? | app | Dinheiro → Pessoas |
| 38 | Como faço uma cópia dos meus dados? | app | Mais → Ajustes → Guardar uma cópia (e por que fazer toda semana) |
| 39 | Troquei de celular. Como levo meus dados? | app | Guardar uma cópia no celular antigo e recuperar no novo |
| 40 | Como deixo a letra maior ou a tela escura? | app | Mais → Ajustes → Letra e Cores |
| 51 | Por que o app não deixou eu salvar? | app | Explica as travas de coerência (D57): o que ele impede e o que só pergunta. Acrescentada na 1.19.0 |

### Aprender (11)

| # | Pergunta | Tipo | Como responde |
|---|---|---|---|
| 41 | O que é reserva de emergência e quanto devo ter? | aprender | Dinheiro para imprevistos, de 3 a 6 meses do custo básico, num lugar fácil de tirar |
| 42 | Por que "sobrou" no mês é diferente do que tenho no banco? | aprender | Gasto no cartão conta no dia da compra; a fatura paga é de outro mês |
| 43 | O que é "é meu de verdade"? | aprender | O patrimônio: o que sobraria se pagasse todas as dívidas hoje |
| 44 | O gasto no cartão conta na compra ou no pagamento? | aprender | Na compra, e por que isso mostra o mês real |
| 45 | Comprar um carro é gasto? | aprender | Não: é trocar dinheiro (ou dívida) por um bem, que depois perde valor com o tempo |
| 46 | Como eu saio das dívidas? | aprender | Passos práticos: parar de aumentar, listar, negociar, atacar uma por vez |
| 47 | Vale a pena pagar só o mínimo da fatura? | aprender | Não: o resto vira juros rotativos, dos mais caros que existem |
| 48 | O que são juros compostos? | aprender | Juros sobre juros, com um exemplo simples, a favor (guardar) e contra (dívida) |
| 49 | Como começo a guardar ganhando pouco? | aprender | Guardar primeiro e um pouco (até 5%), automático, e usar caixinhas com objetivo |
| 50 | Meus dados ficam seguros? Alguém vê? | aprender | Ficam só neste celular; ninguém (nem o Balancete) vê; por isso a cópia é importante |
| 53 | O que mudou na economia que me afeta? | dados + aprender | As notícias oficiais mais importantes do dia, com o "para você" (D59). Acrescentada na 1.21.0 |

## As 10 perguntas novas (1.24.1)

| Grupo | Pergunta | Tipo | Como responde |
|---|---|---|---|
| Meu dinheiro | Quanto eu recebo se resgatar meus investimentos hoje? | dados | Soma o líquido de cada aplicação e caixinha que rende, já sem o Imposto de Renda (tabela que diminui com o tempo) e o IOF; diz que é estimativa |
| Meu dinheiro | Quanto meu dinheiro rende por mês? | dados | Com as taxas de hoje (CDI do dia, poupança, taxa fixa), quanto cada uma rende por mês, antes do imposto |
| Como usar o app | Como digo quanto minha aplicação ou caixinha rende? | app | Onde fica "Como rende?" e as 5 escolhas (ex.: 115% do CDI) |
| Como usar o app | O valor de um investimento não bate com o banco. E agora? | app | "Atualizar o valor" e o lembrete semanal |
| Como usar o app | Onde estão os gráficos e os relatórios? | app | Aba Saúde: panorama, 4 indicadores, "Ver mais", Mês a mês e a lista |
| Como usar o app | Não acho uma informação que estava na tela. Onde foi? | app | Nada foi removido: seções com ›, "Mais detalhes" e "?" |
| Aprender | O que é CDI e o que quer dizer “% do CDI”? | dados + aprender | O CDI de hoje e quanto dá 115% do CDI ao ano |
| Aprender | Como funciona o Imposto de Renda dos investimentos? | aprender | Tabela 22,5% a 15%, IOF nos primeiros 30 dias, isentos (poupança, LCI, LCA) |
| Aprender | Qual a diferença entre poupança, CDB, LCI e Tesouro? | aprender | Uma linha para cada, sem recomendar nenhum |
| Aprender | A inflação está comendo meu dinheiro? | dados + aprender | IPCA de 12 meses contra cada aplicação e o dinheiro parado |

**Respostas revisadas na 1.24.1**: caixinhas (diz como cada uma rende), investimentos (aponta a estimativa de resgate), cada conta (inclui o total aplicado), conferir com o banco (Conferir no topo; "Atualizar o valor" nas aplicações e caixinhas), cópia e troca de celular (Ajustes > Seus dados), letra e cores (Ajustes > Aparência), "por que o app não deixou salvar" (inclui o dinheiro guardado em caixinha e a taxa fora do comum).

## Decisões para o dono

1. Aprovar, tirar ou trocar perguntas da lista.
2. O campo **"Escreva sua dúvida"** (procura a pergunta mais parecida) entra?
3. As respostas **[dados]** têm o botão **"Ver no app"**?

## Para onde leva o "Ver no app" (1.24.1)

O botão não leva só à aba: abre a seção, a janela ou a folha certa e **destaca o lugar exato** com uma borda dourada que pisca (sem piscar com "Movimento: Parado"). O teste `34-chat-ver-no-app` confere cada uma.

| # | Pergunta | Aonde leva |
|---|---|---|
| 1 | Quanto dinheiro eu tenho agora? | Dinheiro > Contas: destaca a lista |
| 2 | Quanto é meu de verdade? | Início: destaca o Mordomo e o "é meu de verdade" |
| 3 | Quanto posso gastar por dia até o fim do mês? | Planejar: destaca o acerto de contas do mês |
| 4 | Quanto eu gastei este mês? | Saúde: destaca o indicador "Para onde vai o dinheiro" |
| 5 | Com o que eu mais gasto? | Saúde: destaca o indicador "Para onde vai o dinheiro" |
| 6 | Gastei mais ou menos que no mês passado? | Saúde: destaca o Mês a mês (abre a seção) |
| 7 | Quanto entrou de dinheiro este mês? | Início: destaca Entrou · Saiu · Sobrou |
| 8 | Quanto sobrou no mês passado? | Saúde: destaca o Mês a mês (abre a seção) |
| 9 | Quanto tenho guardado nas caixinhas? | Planejar > Caixinhas: destaca o cartão |
| 10 | Quanto meus investimentos renderam? | Investir: destaca Investido e quanto rendeu |
| 11 | Quanto tenho em cada conta? | Dinheiro > Contas: destaca a lista |
| 12 | Quanto eu devo ao todo? | Dinheiro > Dívidas: destaca o cartão |
| 13 | O que vence esta semana? | Planejar: destaca a agenda |
| 14 | Tenho alguma conta atrasada? | Planejar > janela do acerto de contas |
| 15 | Quanto falta pagar este mês? | Planejar > janela do acerto de contas |
| 16 | Qual dívida eu pago primeiro? | Planejar > janela do acerto de contas |
| 17 | Quando vence a fatura do cartão? | Dinheiro > Dívidas: destaca o cartão |
| 18 | Quanto do limite do cartão eu já usei? | Dinheiro > Dívidas: destaca o cartão |
| 19 | Quanto paguei de juros e multas? | Saúde: destaca o indicador de juros (abre "Ver mais indicadores") |
| 20 | Quem me deve dinheiro? | Dinheiro > Pessoas: destaca a lista |
| 21 | Quanto custa minha vida básica por mês? | Saúde: destaca o Custo fixo de vida (abre "Ver mais indicadores") |
| 22 | Quanto preciso guardar para o IPVA, IPTU e outras contas do ano? | Planejar > Contas fixas: destaca Contas do ano |
| 23 | Minha reserva de emergência é suficiente? | Saúde: destaca a Reserva de emergência |
| 24 | Estou dentro das metas do mês? | Planejar > Metas: destaca a lista |
| 25 | Quanto da minha renda já tem destino? | Saúde: destaca "Quanto da renda já tem dono" (abre "Ver mais indicadores") |
| 26 | Se eu comprar algo parcelado, cabe no meu bolso? | Planejar > Simulador: destaca o campo do valor |
| 27 | Quanto falta para completar minha caixinha? | Planejar > Caixinhas: destaca o cartão |
| 28 | Minhas finanças estão saudáveis? | Saúde: destaca o panorama |
| 29 | Como eu anoto um gasto? | abre as 4 medalhas da pena |
| 30 | Como anoto uma compra parcelada? | abre a folha Gastei |
| 31 | Como pago uma conta ou a fatura? | Planejar > janela do acerto de contas |
| 32 | Como passo dinheiro de uma conta para outra? | abre a folha Transferi entre contas |
| 33 | Anotei errado. Como corrijo ou apago? | Mais > Anotações: destaca a lista de anotações |
| 34 | Como guardo dinheiro numa caixinha? | Planejar > Caixinhas: destaca o botão Guardar |
| 35 | Como cadastro uma conta fixa (aluguel, internet)? | Planejar > Contas fixas: destaca "+ Nova conta fixa" |
| 36 | Como confiro o saldo com o banco? | Dinheiro: abre a janela da primeira conta de banco, com Conferir no topo |
| 37 | Como cadastro meu carro ou minha casa? | Dinheiro > Bens: destaca "+ Já tenho um bem" |
| 38 | Como anoto dinheiro que emprestei ou que devo a alguém? | Dinheiro > Pessoas: destaca "+ Emprestei" |
| 39 | Como faço uma cópia dos meus dados? | Mais > Ajustes: destaca Guardar uma cópia (abre "Seus dados") |
| 40 | Troquei de celular. Como levo meus dados? | Mais > Ajustes: destaca Recuperar de uma cópia |
| 41 | Por que o app não deixou eu salvar? | – (só a resposta) |
| 42 | Como deixo a letra maior ou a tela escura? | Mais > Ajustes: destaca Tamanho da letra (abre "Aparência") |
| 43 | O que mudou na economia que me afeta? | Notícias: destaca a primeira notícia |
| 44 | O que é reserva de emergência e quanto devo ter? | – (só a resposta) |
| 45 | Por que "sobrou" no mês é diferente do que tenho no banco? | – (só a resposta) |
| 46 | O que é "é meu de verdade"? | Início: destaca o Mordomo e o "é meu de verdade" |
| 47 | O gasto no cartão conta na compra ou no pagamento? | – (só a resposta) |
| 48 | Comprar um carro é gasto? | – (só a resposta) |
| 49 | Como eu saio das dívidas? | Planejar > janela do acerto de contas |
| 50 | Vale a pena pagar só o mínimo da fatura? | – (só a resposta) |
| 51 | O que são juros compostos? | – (só a resposta) |
| 52 | Como começo a guardar ganhando pouco? | Planejar > Caixinhas: destaca "+ Nova caixinha" |
| 53 | Meus dados ficam seguros? Alguém vê? | Mais > Ajustes: destaca a seção Seus dados |
| 54 | Quanto eu recebo se resgatar meus investimentos hoje? | Investir: abre a janela da primeira aplicação, com o "Se resgatar hoje" |
| 55 | Quanto meu dinheiro rende por mês? | Investir: destaca Investido e quanto rendeu |
| 56 | Como digo quanto minha aplicação ou caixinha rende? | Investir: abre "Editar" da primeira aplicação, em "Como rende?" |
| 57 | O valor de um investimento não bate com o banco. E agora? | Investir: abre a lista "Conferir com o banco" |
| 58 | Onde estão os gráficos e os relatórios? | Saúde: destaca o panorama |
| 59 | Não acho uma informação que estava na tela. Onde foi? | Início: destaca a primeira seção que abre |
| 60 | O que é CDI e o que quer dizer “% do CDI”? | Notícias: destaca a notícia do CDI |
| 61 | Como funciona o Imposto de Renda dos investimentos? | Investir: abre a janela da primeira aplicação, com a estimativa do imposto |
| 62 | Qual a diferença entre poupança, CDB, LCI e Tesouro? | Investir: destaca a explicação do topo ("?") |
| 63 | A inflação está comendo meu dinheiro? | Notícias: destaca a notícia da inflação |
