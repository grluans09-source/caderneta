# Guia para quem vai testar o Balancete (antes Caderneta)

Use este guia para **mandar o app a quem vai testar** e para **observar o que acontece**. Tem três partes: a mensagem pronta, o passo a passo para a pessoa, e a ficha para você anotar o que viu.

> **Fase atual:** teste gratuito. O app é o mesmo que será vendido depois (venda única). O objetivo do teste é descobrir **onde as pessoas travam**, não elogios.

## 1. Mensagem pronta (copie e envie)

> Oi! Estou criando um aplicativo de organização financeira bem simples, e queria **a sua ajuda para testar**. É de graça e leva uns 10 minutos para começar.
>
> 👉 Abra este link no celular: **https://grluans09-source.github.io/caderneta/**
>
> Seus dados ficam **só no seu celular**: ninguém vê, nem eu. Por isso, depois de usar um pouco, vá em **Ajustes → Guardar uma cópia**.
>
> Use como se fosse de verdade por uma ou duas semanas (anote gastos, cartão, o que você deve). Quando travar em algo ou não entender, **me conte o que você esperava que acontecesse**. Pode ser por áudio. Não existe pergunta boba: se você travou, o erro é do aplicativo, não seu.

## 2. Passo a passo para a pessoa

### Abrir e instalar (deixa com cara de aplicativo e funciona sem internet)

O ícone é uma **moeda de ouro com uma balança** (o Brasão) e o nome é **Balancete**. Quem já tinha instalado com o nome antigo vê o nome e o ícone novos depois de abrir o app uma ou duas vezes (em alguns celulares, só reinstalando o atalho).

Aberto no navegador, o app mostra uma vez, no Início, como instalar. Peça para a pessoa instalar: sem isso, o navegador põe a barra de endereço e botões dele (como uma seta de subir) por cima do app.
- **Android (Chrome):** abra o link → toque nos **três pontinhos** → **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.
- **iPhone (Safari):** abra o link **no Safari** (não em outro navegador) → toque no botão de **compartilhar** (quadrado com seta) → **"Adicionar à Tela de Início"**.

> **Importante no iPhone:** se o app não for instalado na tela inicial, o Safari pode apagar os dados depois de um tempo sem uso. Instalar e **guardar uma cópia** protege a pessoa.

### Primeiros passos
1. Responder "Onde está seu dinheiro hoje?" (carteira, banco, poupança). Pode deixar vazio o que não tem.
2. Dizer se usa cartão de crédito (dia que fecha e dia que vence).
3. Tocar no botão **+ Anotar** (redondo, dourado, no canto direito de baixo) para o primeiro gasto.

### Guardar e recuperar uma cópia dos dados
- **Guardar:** Mais → Ajustes → **Guardar uma cópia**. Mandar o arquivo para o próprio e-mail ou WhatsApp.
- **Recuperar** (se trocar de celular ou apagar sem querer): Mais → Ajustes → **Recuperar de uma cópia** e escolher o arquivo.

## 3. As 6 tarefas para observar (sem ajudar!)

Peça que a pessoa faça cada tarefa **sozinha, falando em voz alta o que pensa**. Anote onde hesita. Só ajude depois de ela desistir ou pedir.

| # | Tarefa | Onde costuma travar (hipótese) |
|---|---|---|
| 1 | Anotar um gasto do dia (ex.: mercado, R$ 45), **tocando no + e depois na bolinha vermelha "Gastei"** | Perceber que o + gera bolinhas e que elas são botões; achar a conta e a categoria nas listas curtas (ou na busca) |
| 2 | Anotar uma compra parcelada no cartão | Escolher a conta do cartão e as parcelas |
| 3 | Ver **quanto falta pagar neste mês** e **pagar uma conta pelo "Abrir o acerto de contas"** no Planejar | Achar o **Planejar** e usar as setas de mês do cartão "Falta pagar" |
| 4 | **Guardar** um dinheiro numa caixinha e depois **usar** | Entender caixinha × meta, escolher a conta |
| 5 | Cadastrar um bem (ex.: o carro) | Saber que bem não é gasto; informar o que ainda falta pagar |
| 6 | Achar uma anotação antiga (pelo nome ou valor) | Achar "Anotações" no menu Mais |

Depois, pergunte: **"Com suas palavras, o que é essa balança da tela inicial?"** (mostra se a explicação funcionou).

Depois, peça que ela **pague algo em dinheiro vivo com centavos** (ex.: R$ 3,25) e veja se entende a sugestão de **arredondar para reais inteiros**; e que **conte as cédulas** em Dinheiro > conta Dinheiro.

Depois, peça que ela **abra a aba Gráficos**, escolha um indicador, **leia o relatório** e diga, com as palavras dela, **o que entendeu** e **se a explicação faz sentido** para a vida dela.

Peça também que a pessoa **anote um gasto e, no meio, troque para "Recebi" pelo botão redondo de baixo** (e veja se se localiza sabendo que o tipo atual fica apagado), e que **procure uma categoria tocando em "Buscar categoria"** sem digitar nada.

Peça também que a pessoa **confira o saldo de uma conta com o app do banco** (Dinheiro > tocar na conta > Conferir com o banco) e conte se entendeu o que fazer quando não bate.

## 4. Ficha de observação (uma por pessoa)

| Campo | Anotação |
|---|---|
| Pessoa (nome ou apelido), idade, perfil (idoso / jovem / correria) | |
| Aparelho (modelo) e sistema (Android / iPhone) | |
| Instalou na tela inicial? Teve dificuldade? | |
| Conseguiu guardar e recuperar uma cópia? | |
| Tarefa 1 a 6: tempo, onde travou, o que disse | |
| O que a pessoa **não entendeu** (palavras, telas) | |
| O que **faltou** na opinião dela | |
| O que ela mais gostou | |
| **Pagaria por isso?** Quanto acharia justo? (pergunte só no fim) | |
| Travamentos, lentidão ou telas estranhas (anote o horário) | |

## 5. O que fazer com o que você descobrir
1. Junte as fichas e escreva um resumo em `docs/TESTE-DE-CAMPO.md` (padrão: o que aconteceu, quantas pessoas travaram, proposta de correção).
2. Priorize em `docs/ROTEIRO.md`: **primeiro o que mais de uma pessoa travou**, depois o resto.
3. Corrija, publique uma versão nova (`1.0.1`) e peça para as mesmas pessoas repetirem as tarefas que travaram.

## 6. Avisos para dizer à pessoa
- É uma **versão de teste** e pode mudar. Se o endereço mudar, avisamos e é só **guardar uma cópia** e **recuperar** no endereço novo.
- O app **não é consultoria financeira**: ajuda a organizar e a enxergar, não diz o que a pessoa deve fazer com o dinheiro.
- Nenhum dado financeiro sai do celular dela.
