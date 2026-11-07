# Registro de decisões

Cada decisão importante, **o motivo** e o que ela exige. Antes de mudar algo daqui, converse com o dono: foram escolhas dele ou foram feitas com a concordância dele.

Formato: **Decisão** · Por quê · Consequência. (A = decidido pelo dono · C = proposto pelo Claude e aceito)

## Produto

**D01 · Projeto novo do zero, só aproveitando lições do protótipo (A).**
Por quê: o protótipo tinha falhas de fundo (sem editar anotação, sem saldo inicial, compra à vista no cartão fora da fatura, balancete que "sempre fecha"). Consequência: nada de código antigo foi reaproveitado; as lições viraram requisitos.

**D02 · Para pessoa física, usável do idoso ao jovem (A).**
Por quê: o objetivo é levar a contabilidade para a vida das pessoas. Consequência: palavras comuns, letras grandes, poucas decisões por tela, avisos claros.

**D03 · Contabilidade escondida, "Modo contador" opcional (A).**
Por quê: a pessoa quer entender o dinheiro, não aprender contabilidade; quem quiser vê os termos técnicos. Consequência: dois vocabulários (`VOC`); a partida dobrada nunca é quebrada por "atalho".

**D04 · Vocabulário comum na tela (A).**
Por quê: "gaveta" e outros termos deixavam as pessoas perdidas. Consequência: lista de palavras proibidas na tela comum, conferida por teste (`08-vocabulario-e-apagar-conta`).

**D05 · Sem servidor e sem banco de dados; dados no aparelho (A).**
Por quê: simplicidade, custo zero e privacidade (os dados nunca saem do celular). Consequência: sem sincronização, sem notificações com o app fechado, backup manual, dados "por endereço". Reavaliar **só depois de uso real**.

**D06 · Distribuição por link, instalável na tela inicial (PWA) (C, aceito).**
Por quê: mandar o arquivo por WhatsApp não funciona bem (principalmente no iPhone) e não instala. Consequência: precisa de hospedagem estática (hoje GitHub Pages; plano de ir para Netlify).

**D07 · Dados de cada pessoa ficam só no celular dela (A).**
Consequência: o repositório nunca contém dados de usuários; o aviso de "guardar uma cópia" é parte do produto.

## Visual

**D08 · Identidade "livro-razão vivo" (A).**
Por quê: o dono pediu algo "vivo, com movimento, que faça a pessoa sentir-se num universo contábil, mesmo sem perceber", sem perder a simplicidade. Consequência: conta em T, balança de latão, carimbo, papel, sublinhado duplo, animações com propósito. O "exótico" fica no visual, **nunca** na navegação.

**D09 · Movimento "Vivo" por padrão, com "Parado" e respeito ao `prefers-reduced-motion` (A/C).**
Por quê: dar vida sem prejudicar quem tem tontura ou aparelho fraco. Consequência: classe `calmo`; animar só `transform`/`opacity`.

**D10 · Tela Anotar em duas colunas (de onde saiu | para onde foi) (A).**
Por quê: passa a ideia de partida dobrada sem jargão. Consequência: vira lista de uma coluna com a letra "Enorme".

**D11 · Botão Salvar no fim do formulário, na ordem de uso, sem "grudar" na tela (A).**
Por quê: o botão fixo atrapalhava a visualização. Consequência: nada de `position: sticky` no Salvar.

## Contabilidade

**D12 · Valores em centavos inteiros (C).** Por quê: nunca errar contas por arredondamento. Consequência: proibido ponto flutuante para dinheiro.

**D13 · Só regime de competência (C).** Por quê: o botão "Competência/Caixa" confundia. Consequência: a despesa nasce na data da compra; `parcelas` é só o cronograma de pagamento.

**D14 · Pagar fatura é transferência, nunca gasto novo (C).** Por quê: o gasto já foi anotado na compra. Consequência: pagamentos quitam as parcelas mais antigas (FIFO).

**D15 · O app conta DINHEIRO e BENS cadastrados, não objetos consumidos (A, após o exemplo da comida).** Por quê: "se a dívida for de comida eu não tenho comida". Consequência: consumo é gasto; carro/TV/casa é "Comprei um bem" (não reduz o "é meu"); o valor do bem muda por estimativa.

**D16 · Bens perdem/ganham valor por taxa anual, com ajuste mensal composto (C, aceito).** Por quê: contabilmente é depreciação/valorização. Consequência: ajuste **não** entra em "Saiu" (não é dinheiro); aparece em "Seus bens mudaram de valor".

**D17 · Juros: a pessoa informa quanto de cada pagamento foi juros (C).** Por quê: cada banco calcula de um jeito; o app não deve inventar. Consequência: só os juros viram gasto; o resto abate a dívida.

**D18 · Dívida inicial separada por vencimento (A).** Por quê: "devo 205, sendo 190 este mês e 15 no próximo". Consequência: campo `abertas` na conta.

**D19 · Contas fixas não lançam sozinhas: a pessoa confirma "Paguei" (A).** Por quê: evita registrar algo que não aconteceu. Consequência: contam como compromisso, não como despesa, até confirmar.

**D20 · Caixinhas são organização pessoal, FORA da contabilidade, e olham só o dinheiro real nas contas (A).** Por quê: "caixinha é coisa pessoal para organização e não deve considerar dívidas". Consequência: sem partidas, fora do balancete, não mudam o PL; o guardado **sai** de "Dinheiro que eu tenho" e **volta** ao tirar; é possível escolher **de qual conta** sai.

**D21 · Metas do mês são só anotação, não bloqueiam (A).** Por quê: "não é condição obrigatória". Consequência: o pote enche/esvazia; a sobra vira **sugestão** de guardar.

## Dados e segurança

**D22 · Tudo que vem de fora passa por `higienizar()` (C).** Consequência: item inválido é descartado e o original é guardado em `caderneta:v2:corrompido`.

**D23 · Apagar conta, bem ou pessoa com anotações é permitido, com aviso do que sai junto (A).** Por quê: ficavam "presos". Consequência: cascata irreversível (sem "desfazer" ainda; está no roteiro).

**D24 · Listas longas mostram 15 por vez, com busca e ordem por data, valor ou nome (A).** Consequência: bloco único reutilizável (`blocoAnotacoes`).

## Engenharia e hospedagem

**D25 · Um arquivo só para o app, sem framework nem dependências (A/C).** Por quê: simples de publicar e guardar. Consequência: dividir em módulos só quando passar de ~3.500 linhas (com script que gera o arquivo único).

**D26 · Testes em jsdom dentro do repositório; publicar só se passarem (C).** Consequência: `npm test` e GitHub Actions.

**D27 · Versão semântica nos 3 lugares (`package.json`, `VERSAO_APP`, `sw.js`) (C).** Por quê: o nome do cache do `sw.js` é o que faz o celular atualizar.

**D28 · GitHub pessoal `grluans09-source`; a conta da empresa não é usada (A).**

**D29 · *(parcialmente substituída pela D33: o plano passou de Netlify para Cloudflare Pages)* Hospedagem hoje: GitHub Pages (repositório público). Plano: Netlify + repositório privado (A, "por enquanto só organizar").** Por quê: Pages gratuito exige repositório público. Consequência: a troca muda o endereço e **os dados não acompanham**; exige aviso e cópia (ver `PUBLICACAO.md`).

**D30 · Frases da capa só de autores reais, atribuição conferida (A).** Consequência: texto é tradução livre; ao incluir novas, conferir a fonte.

## Venda e hospedagem (6 nov 2026)

**D31 · Modelo de venda: pagamento único (A).** Por quê: combina com um app sem servidor e sem login. Consequência: o app não sabe "quem pagou"; o link pode ser repassado. A defesa é suporte, atualizações e marca. Chave de licença com servidor mínimo só se o uso real pedir. Assinatura exigiria servidor.

**D32 · Fase de teste 100% gratuita, no endereço atual do GitHub Pages (A).** Por quê: o dono quer que as pessoas já usem, sem custo. Consequência: o GitHub Pages não deve ser usado para vender; migrar **antes** da primeira venda. Os testadores farão uma troca de endereço guardando e recuperando a cópia.

**D33 · Hospedagem definitiva recomendada: Cloudflare Pages (C, aguarda confirmação do dono).** Por quê: tráfego ilimitado no plano gratuito, uso comercial permitido segundo as fontes, aceita repositório privado e tem caminho para um servidor mínimo. O plano gratuito do Netlify funciona por créditos e pausa o site se acabarem. Consequência: conta no Cloudflare (feita pelo dono), pasta de publicação `app`, arquivo `app/_headers`. Confirmar os termos nos sites oficiais antes de contratar.

**D34 · Domínio próprio antes da primeira venda (C, recomendação pendente).** Por quê: os dados dos usuários pertencem ao endereço; o domínio impede que uma troca de hospedagem faça alguém perder dados. Custo: cerca de R$ 40 a R$ 60 por ano.

**D35 · Beta para testadores: desfazer, lembrete de cópia a cada 7 dias, selo beta e feedback por compartilhar (A).** Por quê: proteger dados antes de pessoas reais usarem. Feedback sem servidor: o botão abre o compartilhar do celular com texto pronto. Consequência: "Apagar tudo e recomeçar" ainda não tem desfazer.

**D36 · Caixinhas funcionam como a caixinha de um banco (A).** O guardado continua sendo dinheiro da pessoa, na mesma conta; só deixa de estar "para usar agora". Substitui o texto do Marco 14 ("guardado sai do que eu tenho"). O motor não mudou (o total já incluía o guardado); mudaram os nomes e as explicações. "Livre" virou "para usar".

**D37 · Reorganização por lugar único (A).** Decisões Q1 a Q7 da auditoria aceitas: Início enxuto com uma linha "Falta pagar"; Planejar é a casa do que vence; Dinheiro em 4 abas; Metas em tela própria; Relatórios sem repetir; Ajustes em 3 grupos. Mapa em `docs/MAPA-DO-APP.md`.

**D38 · *(SUBSTITUÍDA pela D39: os jeitos foram apagados)* Três jeitos de usar para o app inteiro: Balança, Razão e Cofre e fluxo (A).** O visual antigo deixa de ser uma opção separada (a Balança o continua). Cada jeito muda o visual e a distribuição das telas; dados e regras são os mesmos. Entrega por etapas (J1 a J7 em `docs/JEITOS-DE-USAR.md`); J1 (base e Início), J2 (Planejar) e J3 (Dinheiro) e J4 (Anotar) e J5 (Mais, Anotações, Relatórios, Ajustes) e J6 (escolha nos Primeiros passos) e J7 (conferência final) feitas.

**D39 · Os jeitos Razão e Cofre e fluxo foram apagados; fica só a Balança (A).** O dono pediu para tirar as duas interfaces extras e manter a padrão. Substitui a D38. Consequência: sem escolha de jeito em Ajustes nem nos Primeiros passos (voltaram a 3 passos); a reorganização por lugar único (D37) continua valendo. Quem tinha escolhido outro jeito volta sozinho para a Balança.

**D40 · *(cores de base SUBSTITUÍDAS pela D44; a regra "uma cor, um significado" continua)* Paleta "azul-noite, marfim e ouro" e regra de uma cor, um significado (A).** Por quê: o verde servia ao mesmo tempo para botão, "selecionado", dinheiro e transferência, e confundia. Agora: azul safira = entrou/para usar; bordô = saiu/dívida; ametista = guardado; cobre = bens; ouro = é meu de verdade e também selecionado (sempre com fundo claro e borda); azul-noite = capa e botões principais. Consequência: o verde não deve voltar ao app.

**D41 · Planejar com mapa de cores estrutural (A).** As zonas da aba (ferramentas, falta pagar, agenda) usam as cores de significado fixo da D40: bordô = sai/dívida, ardósia = compromisso fixo, safira = entra, ametista = guardado, cobre = compra de bem, ouro = só selecionado. A urgência aparece na data, não em cor nova. Consequência: ao criar algo novo no Planejar, escolher a cor pelo significado, não pelo gosto.

**D42 · *(SUBSTITUÍDA pela D43: as 2 bolinhas fixas viraram um menu de 4 bolinhas)* Anotação rápida por duas bolinhas na barra de baixo (A).** Os botões "Gastei" e "Recebi" do Início pareciam texto e só existiam numa tela. Agora são bolinhas sobre o botão + Anotar, em todas as telas: bordô = gastei, azul = recebi (segue a D40; o verde não volta). O dono falou em "vermelha e verde"; usamos azul no lugar do verde por causa da regra de cores.

**D43 · *(a parte "3 bolinhas no cabeçalho da folha" foi SUBSTITUÍDA pela D48)* Anotar em dois toques: o + gera 4 bolinhas, a folha fica curta e a conta Dinheiro é a carteira (A).** Pedido do dono (7 nov 2026). (1) O botão + gera, com animação, 4 bolinhas (uma por tipo); o 2º toque escolhe. (2) A folha perde os 4 botões do topo e ganha 3 bolinhas para trocar de tipo. (3) Listas curtas: **conta Dinheiro + 3 favoritas** em "de onde saiu" (a pessoa escolhe as 3; sem escolha, as mais usadas) e **5 categorias** em "para onde foi", com busca. (4) A conta **Dinheiro** já nasce, não se apaga e conta cédulas (R$ 2 a R$ 200, sem moedas). (5) No dinheiro vivo o app **sugere** arredondar para reais inteiros (R$ 3,25 pago com R$ 4 vira R$ 4; R$ 3,50 pago com R$ 3 em cédulas vira R$ 3); é sugestão, a pessoa pode manter os centavos. Interpretação minha: "3 contas" = 3 favoritas **além** da Dinheiro. Consequência: o verde continua fora do app; as bolinhas seguem o mapa de cores (bordô sai, azul entra, ardósia transfere, cobre bem).

**D44 · Paleta preto, dourado e branco, com clicável explícito (A).** Pedido do dono (7 nov 2026): luxo com ar contábil e botões/funções claramente clicáveis. Regra: **dourado = clicável** (botões cheios em degradê dourado com texto preto, o +, contornos dourados, links dourados sublinhados, seta › nas linhas que abrem algo); **preto = selecionado** (substitui o ouro como cor de seleção da D40); **branco** = fundo e cartões; capa e barra pretas. Cores de significado mantidas: bordô (saiu/dívida), azul (entrou), ardósia (transferência), ametista (guardado), cobre (bens). O verde segue fora.

**D45 · Aba Gráficos e Relatórios por indicador (A).** *(Hoje são 10: a D53 acrescentou "Custo fixo de vida".)* Nove indicadores de finanças pessoais com contas de contabilidade simples (patrimônio, folga de 30 dias, reserva em meses, taxa de poupança, peso das dívidas, renda já reservada, destino dos gastos, composição do patrimônio, custo dos juros). Gráficos mostram; Relatórios explicam como um consultor (O que é · Como você está · Para comparar · O que quer dizer · Por onde começar). As faixas (30%/50%, 3/6 meses, 10%/20%) são **referências comuns de educação financeira**, não regras, e o texto avisa que não substitui um profissional. A barra de baixo ganhou Gráficos e Relatórios (7 espaços, contando o +; *a D51 tirou o + da barra, que agora tem 6 abas*). Interpretação minha: Relatórios continua também como atalho em Mais.

**D46 · *(o jeito de abrir, esticando o cartão com uma lista branca, foi SUBSTITUÍDO pela D52)* Planejar com acerto de contas (A).** O cartão do mês abre e lista **todas** as dívidas e contas fixas com **Pagar**/**Paguei**, para a pessoa ir abatendo uma a uma; a agenda continua como visão rápida. Planejar tem 3 partes com título: Ferramentas, Acerto de contas e Agenda.

**D47 · Busca abre a lista completa e 5 categorias favoritas (A).** Pedido do dono (7 nov 2026): quem sabe que a categoria existe mas não lembra o nome precisa **ver tudo**. Tocar no campo "Buscar conta/categoria" abre a lista completa (alfabética), digitar filtra todas e há "mostrar só as favoritas". Categorias ganham favoritas como as contas (até 5, separadas por gasto e ganho).

**D48 · *(a posição "círculo ao redor do botão, no centro" foi SUBSTITUÍDA pela D51)* Bolinhas em círculo exato e seletor de tipo fixo na folha (A).** As 4 bolinhas do + ficam em pontos de um círculo com centro no botão (simétricas). Na folha, o seletor é um botão redondo **fixo embaixo no centro**, que gera as mesmas 4 bolinhas com o tipo atual **apagado** (a pessoa se localiza) e troca de tipo sem perder o digitado. Substitui as 3 bolinhas do cabeçalho (D43).

**D49 · *(a abertura "moedas caindo" foi SUBSTITUÍDA pela D54: agora o Brasão ganha vida)* Linguagem visual "viva" (A).** O dono achou as linhas finas com "cara de IA e ar robótico". Agora: formas **grossas, redondas e cheias**, ícones preenchidos, botões em pílula, e movimento com propósito (abertura do app, troca de aba, gráficos que crescem, bolinhas do +). Regras: só `transform` e `opacity`; tudo desliga em "Movimento: Parado"; nada de animação que atrase uma ação.

**D50 · Poupança, caixinhas e investimentos: DECIDIDO o desenho, AINDA NÃO IMPLEMENTADO (A).** O dono apontou que poupança e caixinhas, na prática, ficam presas a uma conta de banco e rendem. Decisões de 7 nov 2026: (1) **Caixinha pertence a uma conta** (ex.: Nubank) e **rende**. (2) A pessoa informa a **taxa anual** que vê no app do banco; o rendimento é **calculado por dia útil** (a taxa é anual, a conta é diária) e **lançado sozinho**; a pessoa pode **ajustar o valor** do rendimento quando conferir o banco e ver diferença. (3) **Nova aba Investimentos** (poupança, CDB, Tesouro, fundos como aplicações ligadas a uma conta, com taxa e rendimento), refletida nos Gráficos e Relatórios. (4) Nos **Primeiros passos**, a pergunta "Poupança ou reserva" é **trocada** por "Você tem dinheiro guardado ou investido?", que cria a aplicação com a conta e a taxa. **Pontos a resolver ao implementar:** *(o espaço na barra foi resolvido pela D51: o + saiu da barra e sobra 1 espaço para a aba Investimentos)*; como tratar o rendimento na contabilidade (receita financeira, não confundir com o que a pessoa ganhou trabalhando); feriados para dias úteis; e a migração das caixinhas e da conta Poupança que já existem.

**D51 · *(o desenho "+" com a etiqueta "Anotar" foi SUBSTITUÍDO pela D55: agora é a pena; o lugar no canto continua)* Botão + no canto e novidades para quem já usa (A).** Pedido do dono (7 nov 2026). (1) O botão **+** sai do meio da barra e fica **solto no canto direito de baixo, logo acima da barra**; as 4 bolinhas abrem em **quarto de círculo** (0°, 30°, 60°, 90°) para a esquerda e para cima, e o botão de tipo da folha vai para o mesmo canto. Motivo: liberar um espaço na barra para a aba **Investimentos** (D50). (2) **Relatórios sai da tela Mais**, porque já tem aba. (3) **Regra nova de migração: toda função nova precisa chegar também a quem já tem dados.** O app é cego a versões, então a correção fica na validação de dados (`higienizar`): a conta **Dinheiro** (fixa e primária) é criada quando faltar, em dados do aparelho e em backups restaurados, com aviso. Todo recurso futuro que dependa de dados novos deve ganhar o mesmo tratamento e um teste com dados antigos.

**D52 · Acerto de contas em janela, atrasada igual em todo lugar e dica de instalar (A).** Pedido do dono (7 nov 2026): a lista branca dentro do cartão preto não combinava, e o acerto deve abrir como uma aba por cima da tela. Agora é uma **janela que sobe de baixo, preta e dourada**, com prazo em palavras e volta sozinha depois de cada pagamento. **Atrasada** passa a significar "venceu antes de hoje" em todo o app (antes o acerto só chamava de atrasada o que era de meses anteriores, e a agenda já usava a data de hoje). A **seta de subir** relatada pelo dono **não é do app**: é do navegador do celular. Como o app não controla isso, a solução é **instalar** o app; o Início ensina uma vez por aparelho.

**D53 · Quatro funções contábeis escolhidas na análise contábil (A).** O dono aprovou (7 nov 2026), entre 8 sugestões de `docs/ANALISE-CONTABIL.md`, as 4 de menor esforço e maior uso:
- **Conferir com o banco** (conciliação): a diferença vira uma **anotação de verdade** com a data de hoje, numa categoria do sistema marcada por código (`sis:"conf"`), em vez de mudar o saldo inicial. Assim o passado não muda e a partida dobrada continua valendo.
- **Contas do ano** (provisão): quanto separar por mês até cada conta anual vencer, com atalho para uma caixinha já preenchida.
- **Mês a mês** (comparação entre meses): no topo dos Gráficos e no Início nos 10 primeiros dias do mês.
- **Custo fixo de vida**: o 10º indicador.

Ficaram para depois: rendimento como receita (com Investimentos, D50), fluxo de caixa do mês, relatório para o Imposto de Renda (perto da declaração) e etiquetas.

**D54 · Identidade: Balancete, o Brasão e a letra de contabilidade (A).** Decidido pelo dono em 7 nov 2026, depois de protótipos (cópia em `docs/design/balancete-identidade.html`).
- **Nome:** Balancete. Caderneta se confundia com a caderneta de poupança e é palavra comum, difícil de registrar. Balancete vem da contabilidade e todo mundo entende ("balanço"). Ainda falta conferir no INPI antes de vender.
- **Tom:** sério e luxuoso, mas próximo de quem usa.
- **Logo:** o **Brasão**, uma moeda de ouro em faixas (serrilha, aro, nome em cima, "suas contas em ordem" embaixo, balança em relevo), **sem olhos e sem estrelas**. Ele **só ganha vida na abertura do app**.
- **Personagem do dia a dia:** o **Mordomo**, a balança encorpada com medalhão de esmalte, olhos amendoados, sobrancelhas e gravata-borboleta. Cumprimenta com uma reverência.
- **Botão do chat:** a **pílula "Perguntar"** com o rostinho do Mordomo.
- **Mascotes secundários:** Pesinho (guardou dinheiro), Moedinha (entrou dinheiro), Selo de lacre bordô "PAGO" (pagou conta, no lugar do carimbo) e Pesão de ferro (conta atrasada).
- **Letra:** Times New Roman nos títulos e valores (Noto Serif no Android) e **algarismos tabulares** em todos os números.
- **Não muda:** endereço, chave dos dados e formato da cópia (ninguém perde dados).

Na 1.15.0 entraram o nome, o Brasão (ícones e cabeçalho), a abertura e a letra. Na **1.16.0** entraram o **Mordomo no Início** e os **secundários**. Ao implementar, ficou definido que o Mordomo **não entorta**: a balança do Início mostra a equação contábil (o que tenho = o que devo + o que é meu), que sempre fecha; a situação aparece na **cara** dele (confiante, atento, preocupado). A pílula do chat entra com o chat (passos 4 e 5).

**D55 · Botão de anotar é a pena; um botão em cada canto (A).** Passo 4 do plano, decidido pelo dono em 7 nov 2026 entre 4 desenhos (pena, caneta-tinteiro, livro-razão com +, ±) e 3 distribuições (protótipo em `docs/design/passo4-anotar-e-chat.html`). O botão de anotar é uma **pena de escrever** num medalhão de ouro, **sem a palavra "Anotar"** do lado; aberto, vira "×". A pílula **"Perguntar"** do chat fica no **canto esquerdo de baixo**, simétrica à pena, e entra junto com o chat (passo 5). Substitui a etiqueta "Anotar" ao lado do + (D51).
