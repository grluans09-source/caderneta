# Mapa do app

O app **de hoje** (versão 1.23.0, depois da simplificação da interface: ver `AUDITORIA-INTERFACE.md`): onde mora cada assunto, o que tem em cada tela e o mapa de cores. Nasceu no passo 3 do plano da beta (decisões Q1 a Q7 da [auditoria de funções](AUDITORIA-FUNCOES.md), aceitas pelo dono em 6 nov 2026) e foi completado com Investir, Notícias e o chat.

**Regras do mapa**
1. **Cada assunto mora em um único lugar.** Nos outros lugares só existe um **atalho** (uma linha que leva até a casa dele).
2. **Cada tela responde uma pergunta** e diz isso no topo, em uma frase.
3. **Palavra comum, sem inventar.** Conta é "conta"; cartão é "cartão"; empréstimo é "empréstimo".
4. **Cada botão diz o que faz** (verbo + coisa: "Guardar na caixinha", "Pagar a fatura").
5. **No máximo 5 blocos por tela.** O resto fica numa **seção que abre e fecha** (lembra o estado no aparelho), em **"Mais detalhes"** (campos opcionais dos formulários) ou num **"?"** (explicações e termos técnicos). Nada some: tudo fica a no máximo 1 toque de onde estava (1.23.0).

## 1. A barra de baixo (sempre igual: Início · Dinheiro · Investir · Planejar · Saúde · Mais) e o botão da **pena** (anotar) solto no canto direito, logo acima dela; a pílula "Perguntar" do chat fica no canto esquerdo

| Botão | Pergunta que responde |
|---|---|
| **Início** | Como estou hoje? |
| **Dinheiro** | Onde está meu dinheiro e o que eu devo? |
| **Investir** | Quanto meu dinheiro está rendendo? |
| **Anotar** (a **pena dourada** num medalhão, no canto direito de baixo, fora da barra; aberto vira "×") | O que aconteceu agora? |
| **Menu de bolinhas**: o toque na pena gera 4 bolinhas em quarto de círculo, para a esquerda e para cima. Cada bolinha é uma **medalha de ouro**, como a pena e o Brasão, com o **centro esmaltado na cor do tipo** e o símbolo em ouro (Gastei − bordô, Recebi + azul, Transferi ⇄ ardósia, Comprei um bem ⌂ cobre), e o nome numa etiqueta preta com borda dourada (D61). Enquanto o menu está aberto, a pílula Perguntar some para não tapar o nome "Gastei" | Anotar em dois toques: o 2º toque abre a folha já no tipo escolhido. Vale em todas as telas |
| **Planejar** | O que vem pela frente? |
| **Saúde** (antes Gráficos e Relatórios, juntos desde a 1.23.0) | Como estão minhas finanças? (panorama, 4 indicadores principais, os outros 6 em "Ver mais", mês a mês e os relatórios) |
| **Mais** | Ver o histórico e ajustar o app |

**Linguagem visual "viva"**: formas **grossas, redondas e cheias** (ícones preenchidos, botões em pílula, cartões arredondados) e **movimento com propósito**: abertura do app com o **Brasão** (a moeda-logo) que cai girando, abre os olhos e pisca (D54), aba que quica e ganha bolha dourada, blocos que sobem em sequência, gráficos que crescem, bolinhas do + em círculo. Tudo isso some com "Movimento: Parado".

## 2. Onde mora cada assunto

| Assunto | Casa (única) | Aparece como atalho em |
|---|---|---|
| Valor de verdade (balança: o **Mordomo**) | Início | – |
| **Notícias de fontes oficiais** (dólar, juros, inflação, combustíveis, Focus, IBGE) | **Notícias** (tela própria) | Início ("Hoje no Brasil", 3 notícias), Mais (atalho), chat |
| **Travas de coerência** (não deixa / pergunta "era isso?") | Ao salvar uma anotação, um cartão ou ao apagar | Chat: "Por que o app não deixou eu salvar?" |
| **Chat do Balancete** (53 perguntas prontas) | Pílula **"Perguntar"**, canto esquerdo de baixo, em todas as abas | Cada resposta com "Ver no app" leva à casa do assunto |
| Mascotes dos momentos (Moedinha ao receber, Selo "PAGO" ao pagar, Pesinho ao guardar, Pesão quando há conta atrasada) | Aparecem por cima da tela, só nesses momentos | Pesão: só no Início, 1 vez por dia |
| Custo fixo de vida | Saúde > Ver mais indicadores | Relatório do indicador |
| Resumo do mês (entrou, saiu, sobrou) | Início | – |
| **Quanto falta pagar no mês** | **Planejar** | Início (uma linha) |
| **O que vence (agenda)** | **Planejar** | Início (só avisos urgentes) |
| Contas fixas (cadastro) | Planejar > Contas fixas | Agenda |
| **Contas do ano** (quanto separar por mês para IPVA, IPTU...) | Planejar > Contas fixas (embaixo) | Caixinhas (criar uma já preenchida) |
| **Conferir com o banco** | Dinheiro > tocar na conta | Lista de contas ("Conferido em…") |
| **Mês a mês** (comparar com o mês anterior) | **Saúde** (seção "Mês a mês") | Início ("Outubro fechou", nos 10 primeiros dias, com "Ver mês a mês") |
| Metas do mês (limite por categoria) | Planejar > Metas | Início ("Seus objetivos") |
| Caixinhas (guardar; podem render com taxa) | Planejar > Caixinhas (as que rendem aparecem também em Investir) | Início ("Seus objetivos"), Dinheiro (quanto está guardado em cada conta) |
| Simulador "e se eu comprar" | Planejar > Simulador | – |
| **Aplicações** (poupança, CDB, Tesouro, fundos) e rendimentos | **Investir** | Dinheiro > Contas (um aviso com o total investido) |
| Contas (**Dinheiro**, banco) | Dinheiro > Contas. A conta **Dinheiro** é a carteira: não se apaga e conta cédulas | – |
| Cartões e empréstimos | Dinheiro > Dívidas | Planejar (quando vence) |
| Bens (carro, casa...) | Dinheiro > Bens | – |
| Pessoas (emprestei, devo) | Dinheiro > Pessoas | Agenda (cobranças) |
| **Lista de anotações** (buscar, ordenar) | **Mais > Anotações** | Início (3 últimas + "Ver todas") |
| Indicadores (números e gráficos) | **Saúde** | – |
| Relatórios (texto de consultor, um por indicador) | **Saúde** > "Ler o relatório" (em cada indicador) | Saúde > "Todos os relatórios em lista"; chat |
| Cópia dos dados, recuperar, apagar tudo | Mais > Ajustes > Seus dados | Início (aviso de cópia) |
| Categorias | Mais > Ajustes > Categorias | Folha de anotar ("+ Nova categoria"), Metas |
| Feedback, "Como ler a balança" | Mais > Ajustes > Ajuda | Início ("Como ler a balança?") |

## 3. As telas, uma por uma

Em cada tela: **título**, **a frase que explica para que serve** (aparece no topo, em letra normal) e **o que tem**.

### Início: "Como estou hoje"
> *"Quanto é seu de verdade hoje, e o que pede atenção."*
1. Frase do dia (pequena, só na capa) e, enquanto o app não estiver instalado, a dica **Instalar**
2. O **Mordomo** (a balança) + 3 linhas: **Tenho · Devo · É meu de verdade** (com "Como ler a balança?"); a cara dele mostra a situação
3. Resumo do mês, sempre com R$: Entrou · Saiu · Sobrou; do dia 1 ao 10, a linha **"<mês> fechou: sobrou R$ X"**, que abre o resumo e "Ver mês a mês"
4. Uma linha: **"Falta pagar este mês: R$ X · N contas a pagar"** → Planejar
5. Avisos urgentes, **no máximo 3**: as contas atrasadas viram **um aviso só** com o total ("5 contas a pagar atrasadas: R$ X", abre o acerto de contas); depois limite quase no fim, lembrete de cópia e o que vence em até 7 dias
6. **Hoje no Brasil**: uma linha com as 2 primeiras notícias, que abre as 3 mais importantes com "para você" e o atalho para Notícias
7. **Seus objetivos** (se existirem): seção que abre com as caixinhas e as metas do mês
8. 3 últimas anotações + "Ver todas as anotações"

### Dinheiro: "Onde está seu dinheiro"
> *"Suas contas, o que você deve, seus bens e as pessoas."*
Quatro abas curtas: **Contas · Dívidas · Bens · Pessoas**
A explicação do que é uma "conta" fica no **"?"** do topo.
- **Contas:** cada conta mostra o saldo e, se houver caixinha, "guardado · para usar". Ao tocar numa conta: **Conferir com o banco** no topo, nome e tipo; se a conta já tem anotações, o saldo de hoje aparece **só para ler** (a diferença com o banco entra pelo Conferir, com a data de hoje). A conta **Dinheiro** ("Dinheiro vivo (carteira)") abre a contagem de cédulas
- **Dívidas:** cartões e empréstimos, com limite, quanto devo e botão "Pagar a fatura"; "+ Nova dívida" já abre como dívida. No cartão que já tem anotações, a lista do que se devia antes do app fica em "Mais detalhes"
- **Bens:** o que tem valor e como o valor mudou
- **Pessoas:** quem me deve e a quem devo. Na janela da pessoa, as ações (Recebi, Paguei, Emprestei mais, Perdoar) vêm primeiro; mudar nome, data ou apagar ficam em "Mais detalhes"

### Investir: "Seu dinheiro rendendo"
> *"Poupança, CDB, Tesouro, fundos. Informe a taxa ao ano que aparece no app do banco."*
1. **Investido**, quanto **rendeu no mês** e **no ano**
2. **Minhas aplicações**: cada uma com a taxa ao ano e **um botão só**, "Aplicar, resgatar ou conferir", que abre a janela da aplicação com **Aplicar**, **Resgatar**, **Conferir com o banco**, **Editar nome e taxa** e **Apagar aplicação**; "+ Nova aplicação". A explicação da taxa fica no "?" do topo
3. **Caixinhas que rendem** (as que têm taxa)
O rendimento é calculado a cada dia útil (sem fim de semana e feriado nacional) e anotado uma vez por mês. O investido **não** é "dinheiro para usar agora".

### Anotar (a pena): "O que aconteceu"
> *"Escolha o que aconteceu e preencha: de onde saiu, para onde foi."*
O tipo vem do **menu de bolinhas** do botão da pena (2 toques). A folha mostra o tipo no título e, **embaixo no canto direito, um botão redondo fixo** (a medalha do tipo atual; aberto, vira uma medalha preta com ×); tocar nele gera as 4 bolinhas de novo, com a do tipo atual **apagada** ("você está aqui") e as outras 3 trocando o tipo sem perder o que foi digitado. Duas colunas curtas: **"De onde saiu"** = conta Dinheiro + as **3 favoritas** (ou as 3 mais usadas); **"Para onde foi"** = as **5 categorias favoritas** (ou as mais usadas). Cada coluna tem uma **busca**: **tocar no campo abre a lista com tudo** (em ordem alfabética, rolando dentro da coluna), digitar filtra todas, e "↑ Mostrar só as favoritas" volta à lista curta. Há "★ Escolher minhas 3 favoritas" (contas) e "★ Escolher minhas 5 favoritas" (categorias). No dinheiro vivo, valores com centavos ganham a sugestão de **arredondar para reais inteiros**. A **anotação** (texto) e o **pagar com o dinheiro de uma caixinha** ficam em **"Mais detalhes"** (abre sozinho se já tiver algo).

### Planejar: "O que vem pela frente"
> *"O que você precisa pagar e como se organizar."*
1. **Ferramentas** (4 botões com ícone e seta: Metas do mês · Caixinhas · Contas fixas · Simulador), no topo para nunca ficarem escondidas atrás de uma lista longa
2. **Acerto de contas do mês** (cartão preto com ouro: total que falta, 3 contas de prévia e o botão **Abrir o acerto de contas**, que sobe uma **janela preta e dourada por cima da tela** com **todas** as dívidas e contas fixas do mês, cada uma com o prazo em palavras ("vence em…", "atrasada há…") e **Pagar**/**Paguei**, o já pago embaixo e as setas de mês; depois de pagar, a janela volta) ← casa oficial
3. **Agenda dos próximos dias** (visão rápida: mostra 4; "Ver todas" abre o resto). A legenda das cores e o significado das datas ficam no **"?"** do título

**Regra geral de cores (paleta preto, dourado e branco):** **dourado = clicável** (botões cheios, o +; botões secundários têm contorno dourado; links em ouro sublinhado; linhas que abrem algo têm seta ›); **preto = selecionado** (fundo preto com texto dourado; no tema escuro, creme); **branco** = fundo e cartões. Só o **preto** marca seleção.

**Mapa de cores do Planejar** (uma cor, um significado; vale para as outras telas também):

| Cor | Onde aparece no Planejar | Significa |
|---|---|---|
| Bordô | Faixa do cartão "Falta pagar", dívidas na agenda, ferramenta Metas, data pintada | Dinheiro que **sai**; dívida |
| Ardósia | Contas fixas (faixa e linhas) | Compromisso que se repete |
| Azul safira | Cobranças "A receber" na agenda | Dinheiro que **entra** |
| Ametista | Ferramenta Caixinhas | Dinheiro **guardado** |
| Cobre | Ferramenta Simulador | Compra de **bem** |
| Ouro | Botões Pagar/Paguei, o + e contornos | **Clicável** |
| Preto | Cartão do acerto de contas, itens selecionados | Destaque e **selecionado** |

Urgência na data de cada conta: **pintada** = vence hoje ou já passou; **clara** = vence em até 3 dias; sem destaque = mais longe.

### Planejar > Contas fixas: "Todo mês, no mesmo dia"
O **cadastro** (as contas cadastradas, o total por mês e "+ Nova conta fixa"; no formulário, "Começa em" e "Quantas vezes" ficam em "Mais detalhes") e, no fim, **Contas do ano** (IPVA, IPTU...: quanto separar por mês até vencer, com atalho para uma caixinha). O que vence aparece na Agenda.

### Planejar > Metas do mês: "Quanto posso gastar em cada coisa"
Limite por categoria (mercado, lazer...) e quanto já foi usado. A janela de cada meta diz que ela **não guarda dinheiro** (quem guarda é a caixinha).

### Planejar > Caixinhas: "Guardar sem sair da conta"
Primeiro as **caixinhas** (cofres animados, "Guardar" e "Tirar"); em cima, o total guardado e para usar, com o saldo de cada conta em **"Ver por conta"**; embaixo, a sugestão de guardar a sobra das metas e **"Tirar de uma caixinha"**. A explicação fica no "?". No formulário, alvo, prazo e rendimento ficam em "Mais detalhes".

### Planejar > Simulador: "E se eu comprar"
Valor, com o que vai pagar (as aplicações aparecem por último, com "(resgatar)") e em quantas vezes; "Minha renda por mês" fica em "Mais detalhes".

### Saúde: "Como vão as suas finanças" (antes as abas Gráficos e Relatórios; juntas desde a 1.23.0, D64)
1. O **panorama** (quantos indicadores estão saudáveis, em atenção, em alerta ou só informativos, e qual é o mais urgente)
2. **4 indicadores à vista**: O que é seu de verdade · Folga para os próximos 30 dias · Reserva de emergência · Taxa de poupança (selo, valor, gráfico, leitura em uma frase e **Ler o relatório**)
3. **Ver mais indicadores** (abre): Peso das dívidas · Quanto da renda já tem dono · Custo fixo de vida · Para onde vai o dinheiro · De que é feito o que você tem · Custo dos juros e multas
4. **Mês a mês** (abre): este mês contra o anterior, com setas para voltar até 12 meses
5. **Todos os relatórios em lista** (do mais urgente ao mais tranquilo). Cada relatório tem 5 partes (O que é · Como você está · Para comparar · O que isso quer dizer · Por onde começar) e um botão para compartilhar; volta para onde a pessoa estava
No Modo contador, o balancete aparece no fim. "Patrimônio" e o jeito de ler os indicadores ficam no "?" do topo. Selos: ✓ Saudável (preto), ! Atenção (ouro), ▲ Alerta (bordô).

### Mais: "Tudo o resto"
Entradas: **Anotações · Notícias · Ajustes**

### Mais > Anotações: "Tudo o que você anotou"
Busca à vista; ordem por data, valor ou nome e os filtros ficam em **"Ordenar e filtrar"** (com um resumo do que está escolhido); "Limpar filtros" aparece à vista quando há filtro. 15 por vez. É a única lista completa.

### Notícias: "Hoje no Brasil" (Mais > Notícias, ou o cartão do Início)
Dólar, Selic, CDI, inflação (e o que ficou mais caro ou mais barato), preço dos combustíveis, previsões do Boletim Focus e notícias oficiais do IBGE. Cada item mostra o selo **CERTEZA** (dado publicado) ou **POSSIBILIDADE** (previsão), o título, o **"para você"** (quando dá) e o **link do site oficial**; o fato e "O que isso significa" ficam em **"Entenda a notícia"**. Selic, CDI, IPCA e Focus têm "?". A seta de voltar leva para onde a pessoa estava (Início ou Mais). Atualiza ao meio-dia; as notícias do IBGE o próprio celular busca no site do IBGE (no máximo 1 vez por hora, sem enviar dado nenhum, D62). Sem internet, mostra a última cópia com a data.

### O chat (a pílula "Perguntar", canto esquerdo de baixo)
Abre uma janela preta e dourada com **53 perguntas prontas** em 5 grupos (Meu dinheiro · Contas e dívidas · Planejar · Como usar o app · Aprender); o grupo da aba atual abre primeiro. Tem busca por palavras (mostra até 3 perguntas parecidas, nunca inventa) e, em cada resposta, **Ver no app**. Sem internet e sem inteligência artificial. Lista em `CHAT-PERGUNTAS.md`.

### Mais > Ajustes: quatro seções que abrem
- **Aparência:** letra, cores, movimento (com "?"), Modo contador (com "?" explicando ativo, passivo, DRE e balancete)
- **Categorias:** a lista e "+ Nova categoria"
- **Seus dados** (abre aberta): guardar uma cópia, recuperar, apagar tudo; o resumo mostra a data da última cópia
- **Ajuda:** como ler a balança, contar um problema ou ideia

## 4. Fluxos de uso (o caminho da pessoa)

| Situação | Caminho |
|---|---|
| Primeiro acesso | Primeiros passos (3 telas) → Início |
| Gastei no mercado | **pena** → Gastei → Salvar |
| Quero saber o que ainda vou pagar | Início ("Falta pagar") → Planejar |
| Paguei a fatura do cartão | Dinheiro > Dívidas > Pagar a fatura |
| Quero guardar dinheiro | Planejar > Caixinhas > Guardar |
| Procurar um gasto antigo | Mais > Anotações (busca) |
| Trocar de celular | Mais > Ajustes > Seus dados > Guardar uma cópia → no novo, Recuperar |
| Apaguei sem querer | Botão **Desfazer** (8 segundos) |
| O banco mostra outro valor | Dinheiro > a conta > **Conferir com o banco** |
| Quanto rendeu meu CDB | **Investir** |
| Minhas finanças vão bem? | **Saúde** |
| Tenho uma dúvida | **Perguntar** (canto esquerdo) |
| O que mudou na economia | Início > **Hoje no Brasil** |

## 5. O que mudou no código na reorganização (histórico: feito na 1.2.0)

> Esta tabela registra a reorganização das telas de 6 nov 2026, já feita. O código de hoje está em `ARQUITETURA.md`.

| Bloco | Mudança |
|---|---|
| `telaInicio` | Enxugar (itens 1 a 7 acima); tirar "Usar o dinheiro guardado" e "bens mudaram de valor" |
| `cartaoPagar` | Casa só no Planejar; Início usa uma linha |
| `telaRel` | Tirar resumo, "O que pagar", "Contas a pagar" e lista de anotações |
| `telaContas` | Quatro abas (Contas, Dívidas, Bens, Pessoas) |
| `telaFixas` | Tirar "Para pagar agora" |
| Metas | Nova tela `telaMetas` dentro do Planejar; sai de `telaCaixinhas` |
| `telaAjustes` | Separar em Aparência, Dados e Ajuda |
| `telaMais`/`telaPlanejar` | Textos e atalhos novos |
| Testes | Ajustar os que procuram textos nos lugares antigos |

## 6. O que ficou fora (de propósito)
- Nenhuma função foi removida na reorganização.
- Os 3 modelos de interface testados depois (Balança, Razão e Cofre) viraram um só: a Balança (D39), que hoje é o Mordomo (D54).
- Notificações: continuam fora (o app não tem servidor).
