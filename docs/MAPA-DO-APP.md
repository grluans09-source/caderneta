# Mapa do app

O app **de hoje** (versão 1.27.0, com o redesign "Tinta & Latão" até a fase D, D67; antes, a simplificação da 1.23.0: ver `AUDITORIA-INTERFACE.md`): onde mora cada assunto, o que tem em cada tela e o mapa de cores. Nasceu no passo 3 do plano da beta (decisões Q1 a Q7 da [auditoria de funções](AUDITORIA-FUNCOES.md), aceitas pelo dono em 6 nov 2026) e foi completado com Investir, Notícias e o chat.

**Regras do mapa**
1. **Cada assunto mora em um único lugar.** Nos outros lugares só existe um **atalho** (uma linha que leva até a casa dele).
2. **Cada tela responde uma pergunta** e diz isso no topo, em uma frase.
3. **Palavra comum, sem inventar.** Conta é "conta"; cartão é "cartão"; empréstimo é "empréstimo".
4. **Cada botão diz o que faz** (verbo + coisa: "Guardar na caixinha", "Pagar a fatura").
5. **No máximo 5 blocos por tela.** O resto fica numa **seção que abre e fecha** (lembra o estado no aparelho), em **"Mais detalhes"** (campos opcionais dos formulários) ou num **"?"** (explicações e termos técnicos). Nada some: tudo fica a no máximo 1 toque de onde estava (1.23.0).

## 1. A barra de baixo (sempre igual: Início · Dinheiro · [Anotar] · Planejar · Saúde) e o cabeçalho (Perguntar e Ajustes em toda tela)

| Botão | Pergunta que responde |
|---|---|
| **Início** | Como estou hoje e o que precisa de mim? |
| **Dinheiro** (abas Contas · Investimentos · Dívidas · Bens · Pessoas) | Onde está meu dinheiro, quanto rende e o que eu devo? |
| **Anotar** (no centro da barra: botão de tinta com "+" dourado, um pouco acima dela; aberto, o "+" vira "×") | O que aconteceu agora? |
| **Menu de medalhas**: o Anotar abre 4 medalhas **numa fileira acima dele**, com o nome embaixo (Gastei − bordô, Recebi + azul, Transferi ⇄ ardósia, Comprei um bem ⌂ cobre). Na folha de anotar, o botão "Tipo" abre as mesmas medalhas em arco. | Qual foi o tipo? |
| **Planejar** | O que vem pela frente? |
| **Saúde** | Como estão minhas finanças? (panorama, 4 indicadores principais, os outros 6 em "Ver mais", mês a mês e os relatórios) |
| **No alto de toda tela:** o **rostinho do Mordomo** (Perguntar, abre o chat) e a **engrenagem** (Ajustes) | Tirar uma dúvida; deixar o app do meu jeito |

Os nomes da barra aparecem **sempre**, também com letra Enorme. **Nada fica flutuando por cima do conteúdo** (só a barra e avisos de poucos segundos). *(Até a 1.26.0 a barra tinha 6 abas, Início · Dinheiro · Investir · Planejar · Saúde · Mais, com a pena e o Perguntar flutuando nos cantos.)*

**Linguagem visual "viva"**: formas **grossas, redondas e cheias** (ícones preenchidos, botões em pílula, cartões arredondados) e **movimento com propósito**: abertura do app com o **Brasão** (a moeda-logo) que cai girando, abre os olhos e pisca (D54), aba que quica e ganha bolha dourada, blocos que sobem em sequência, gráficos que crescem, bolinhas do + em círculo. Tudo isso some com "Movimento: Parado".

## 2. Onde mora cada assunto

| Assunto | Casa (única) | Aparece como atalho em |
|---|---|---|
| Valor de verdade | Início (cartão do topo, com Tenho × Devo) | – |
| Balança ilustrada (o **Mordomo**) | Início > "Como ler?" | Ajustes > Ajuda |
| **Notícias de fontes oficiais** (dólar, juros, inflação, combustíveis, Focus, IBGE) | **Notícias** (tela própria) | Início ("Hoje no Brasil", 3 notícias, com "Ver todas"), chat |
| **Travas de coerência** (não deixa / pergunta "era isso?") | Ao salvar uma anotação, um cartão ou ao apagar | Chat: "Por que o app não deixou eu salvar?" |
| **Chat do Balancete** (63 perguntas prontas) | **Rostinho do Mordomo no alto de toda tela** (Perguntar) | Cada resposta com "Ver no app" leva à casa do assunto |
| Mascotes dos momentos (Moedinha ao receber, Selo "PAGO" ao pagar, Pesinho ao guardar, Pesão quando há conta atrasada) | Aparecem por alguns segundos, só nesses momentos | Pesão: dentro de "Precisa de você" no Início, 1 vez por dia |
| Custo fixo de vida | Saúde > Ver mais indicadores | Relatório do indicador |
| Resumo do mês (entrou, saiu, sobrou) | Início | – |
| **Quanto falta pagar no mês** | **Planejar** | Início ("Precisa de você") |
| **O que vence (agenda)** | **Planejar** | Início ("Precisa de você": até 3 avisos) |
| Contas fixas (cadastro) | Planejar > Contas fixas | Agenda |
| **Contas do ano** (quanto separar por mês para IPVA, IPTU...) | Planejar > Contas fixas (embaixo) | Caixinhas (criar uma já preenchida) |
| **Conferir com o banco** | Dinheiro > tocar na conta | Lista de contas ("Conferido em…") |
| **Mês a mês** (comparar com o mês anterior) | **Saúde** (seção "Mês a mês") | Início ("Outubro fechou", nos 10 primeiros dias, com "Ver mês a mês") |
| Metas do mês (limite por categoria) | Planejar > Metas | Início ("Seus objetivos") |
| Caixinhas (guardar; podem render com taxa) | Planejar > Caixinhas (as que rendem aparecem também em Dinheiro > Investimentos) | Início ("Seus objetivos"), Dinheiro (quanto está guardado em cada conta) |
| Simulador "e se eu comprar" | Planejar > Simulador | – |
| **Aplicações** (poupança, CDB, Tesouro, fundos) e rendimentos | **Dinheiro > Investimentos** | Chat |
| Contas (**Dinheiro**, banco) | Dinheiro > Contas. A conta **Dinheiro** é a carteira: não se apaga e conta cédulas | – |
| Cartões e empréstimos | Dinheiro > Dívidas | Planejar (quando vence) |
| Bens (carro, casa...) | Dinheiro > Bens | – |
| Pessoas (emprestei, devo) | Dinheiro > Pessoas | Agenda (cobranças) |
| **Lista de anotações** (buscar, ordenar) | **Dinheiro > Todas as anotações** | Início (3 últimas + "Ver todas") |
| Indicadores (números e gráficos) | **Saúde** | – |
| Relatórios (texto de consultor, um por indicador) | **Saúde** > "Ler o relatório" (em cada indicador) | Saúde > "Todos os relatórios em lista"; chat |
| Cópia dos dados, recuperar, apagar tudo | Ajustes (engrenagem) > Seus dados | Início (aviso de cópia em "Precisa de você") |
| Categorias | Ajustes (engrenagem) > Categorias | Folha de anotar ("+ Nova categoria"), Metas |
| Feedback, "Como ler a balança", instalar | Ajustes (engrenagem) > Ajuda | Início ("Como ler?"; dica de instalar no fim, depois da 1ª anotação) |

## 3. As telas, uma por uma

Em cada tela: **título**, **a frase que explica para que serve** (aparece no topo, em letra normal) e **o que tem**.

### Início: "Como estou hoje" (reorganizado por urgência na 1.27.0, R-02)
> *"Quanto é seu de verdade hoje, e o que pede atenção."*
1. Cabeçalho: a data ("Folha de 9 de novembro"), o Brasão com "Balancete", e à direita o Perguntar e os Ajustes
2. Cartão **"É meu de verdade"**: o valor grande, a variação desde o mês passado (▲ verde / ▼ vermelho), a barra **Tenho × Devo** e a composição (para usar agora, guardado e investido, bens, o que devo), com **"Como ler?"** (abre a balança do Mordomo e a explicação)
3. **"Precisa de você"** (some quando não há nada): no máximo 3 avisos, nesta ordem: contas atrasadas (um aviso só, com o total), o próximo vencimento, limite do cartão estourado, **"Hora de conferir seus investimentos"** (uma vez por semana), outros vencimentos, a cópia dos dados; depois a linha **"Falta pagar este mês"** (→ Planejar) e, se há conta atrasada, o Pesão
4. **O mês**: "dá para gastar cerca de R$ X por dia até o fim do mês" (ou o aviso de que o que falta pagar passa do dinheiro para usar) + Entrou · Saiu · Sobrou; do dia 1 ao 10, "<mês> fechou"
5. 3 últimas anotações + "Ver todas as anotações"
6. **Hoje no Brasil** (abre) e **Seus objetivos** (abre)
7. Depois da 1ª anotação, enquanto o app não estiver instalado: a dica de instalar
8. Rodapé: a frase do dia (toque troca)

### Dinheiro: "Onde está seu dinheiro"
> *"Suas contas, investimentos, o que você deve, seus bens e as pessoas."*
Cinco abas curtas: **Contas · Investimentos · Dívidas · Bens · Pessoas**. Em Contas, embaixo, **"Todas as anotações: procurar, filtrar e ordenar"**.
A explicação do que é uma "conta" fica no **"?"** do topo.
- **Contas:** cada conta mostra o saldo e, se houver caixinha, "guardado · para usar". Ao tocar numa conta: **Conferir com o banco** no topo, nome e tipo; se a conta já tem anotações, o saldo de hoje aparece **só para ler** (a diferença com o banco entra pelo Conferir, com a data de hoje). A conta **Dinheiro** ("Dinheiro vivo (carteira)") abre a contagem de cédulas
- **Dívidas:** cartões e empréstimos, com limite, quanto devo e botão "Pagar a fatura"; "+ Nova dívida" já abre como dívida. No cartão que já tem anotações, a lista do que se devia antes do app fica em "Mais detalhes"
- **Bens:** o que tem valor e como o valor mudou
- **Pessoas:** quem me deve e a quem devo. Na janela da pessoa, as ações (Recebi, Paguei, Emprestei mais, Perdoar) vêm primeiro; mudar nome, data ou apagar ficam em "Mais detalhes"

### Dinheiro > Investimentos: "Seu dinheiro rendendo" (até a 1.26.0, a aba Investir)
> *"Poupança, CDB, Tesouro e fundos, rendendo sozinhos."*
1. **Investido**, quanto **rendeu no mês** e **no ano**
2. **Minhas aplicações**: cada uma mostra **como rende** ("115% do CDI", "12% ao ano", "IPCA + 6% ao ano", "Poupança (regra oficial)" ou "Varia") e **um botão só**, "Aplicar, resgatar ou conferir", que abre a janela da aplicação: valor, como rende, **"Se resgatar hoje, recebe cerca de R$ X"** (sem o Imposto de Renda e o IOF), **Aplicar**, **Resgatar**, **Atualizar o valor (conferir com o banco)**, **Editar nome e como rende** e **Apagar aplicação**. "+ Nova aplicação" pede nome, quanto tem, **Como rende?** (5 escolhas, com "?"), o número certo para cada uma, se paga Imposto de Renda e, em "Mais detalhes", desde quando está aplicado
3. **Caixinhas que rendem**
O rendimento é calculado a cada dia útil (sem fim de semana e feriado nacional) com o CDI, a Selic e a inflação oficiais de cada dia, e anotado uma vez por mês; a poupança rende no dia do aniversário. O investido **não** é "dinheiro para usar agora". Taxa fora do comum pergunta "era isso?"; mudar como rende refaz os rendimentos calculados (D65).

### Anotar (o botão do centro da barra): "O que aconteceu"
> *"Escolha o que aconteceu e preencha: de onde saiu, para onde foi."*
O tipo vem do **menu de medalhas** do botão **Anotar**, no centro da barra (2 toques). A folha mostra o tipo no título e, **embaixo no canto direito, um botão redondo fixo** (a medalha do tipo atual; aberto, vira uma medalha preta com ×); tocar nele gera as 4 bolinhas de novo, com a do tipo atual **apagada** ("você está aqui") e as outras 3 trocando o tipo sem perder o que foi digitado. Duas colunas curtas: **"De onde saiu"** = conta Dinheiro + as **3 favoritas** (ou as 3 mais usadas; em Gastei e Comprei um bem, aplicações só entram se forem favoritas e, na lista completa, vêm por último com "(resgatar)"); **"Para onde foi"** = as **5 categorias favoritas** (ou as mais usadas). Cada coluna tem uma **busca**: **tocar no campo abre a lista com tudo** (em ordem alfabética, rolando dentro da coluna), digitar filtra todas, e "↑ Mostrar só as favoritas" volta à lista curta. Há "★ Escolher minhas 3 favoritas" (contas) e "★ Escolher minhas 5 favoritas" (categorias). No dinheiro vivo, valores com centavos ganham a sugestão de **arredondar para reais inteiros**. A **anotação** (texto) e o **pagar com o dinheiro de uma caixinha** ficam em **"Mais detalhes"** (abre sozinho se já tiver algo).

### Planejar: "O que vem pela frente"
> *"O que você precisa pagar e como se organizar."*
1. **Ferramentas** (4 botões com ícone e seta: Metas do mês · Caixinhas · Contas fixas · Simulador), no topo para nunca ficarem escondidas atrás de uma lista longa
2. **Acerto de contas do mês** (cartão preto com ouro: total que falta, 3 contas de prévia e o botão **Abrir o acerto de contas**, que sobe uma **janela preta e dourada por cima da tela** com **todas** as dívidas e contas fixas do mês, cada uma com o prazo em palavras ("vence em…", "atrasada há…") e **Pagar**/**Paguei**, o já pago embaixo e as setas de mês; depois de pagar, a janela volta) ← casa oficial
3. **Agenda dos próximos dias** (visão rápida: mostra 4; "Ver todas" abre o resto). A legenda das cores e o significado das datas ficam no **"?"** do título

**Regra geral de cores ("Tinta & Latão", D67, desde a 1.26.0):** **tinta = ação** (botão principal liso em tinta; secundário com contorno de tinta; o que está selecionado fica em tinta; no tema escuro a ação é latão claro); **latão = marca** (Brasão, cabeçalho, "É meu de verdade", conquistas, aba ativa); linhas que abrem algo têm seta › cinza. Estados: ✓ verde-musgo (saudável), ! âmbar (atenção), ✕ vermelho (alerta), — neutro (aguardando dados). *(Até a 1.25.0 a regra era "dourado = clicável, preto = selecionado", D44.)*

**Mapa de cores do Planejar** (uma cor, um significado; vale para as outras telas também):

| Cor | Onde aparece no Planejar | Significa |
|---|---|---|
| Bordô | Faixa do cartão "Falta pagar", dívidas na agenda, ferramenta Metas, data pintada | Dinheiro que **sai**; dívida |
| Ardósia | Contas fixas (faixa e linhas) | Compromisso que se repete |
| Azul safira | Cobranças "A receber" na agenda | Dinheiro que **entra** |
| Ametista | Ferramenta Caixinhas | Dinheiro **guardado** |
| Cobre | Ferramenta Simulador | Compra de **bem** |
| Tinta | Botões, itens selecionados, cartão do acerto de contas | **Ação** e **selecionado** |
| Latão | Pena de anotar, aba ativa, valor "É meu de verdade" | **Marca** e valor |

Urgência na data de cada conta: **pintada** = vence hoje ou já passou; **clara** = vence em até 3 dias; sem destaque = mais longe.

### Planejar > Contas fixas: "Todo mês, no mesmo dia"
O **cadastro** (as contas cadastradas, o total por mês e "+ Nova conta fixa"; no formulário, "Começa em" e "Quantas vezes" ficam em "Mais detalhes") e, no fim, **Contas do ano** (IPVA, IPTU...: quanto separar por mês até vencer, com atalho para uma caixinha). O que vence aparece na Agenda.

### Planejar > Metas do mês: "Quanto posso gastar em cada coisa"
Limite por categoria (mercado, lazer...) e quanto já foi usado. A janela de cada meta diz que ela **não guarda dinheiro** (quem guarda é a caixinha).

### Planejar > Caixinhas: "Guardar sem sair da conta"
Primeiro as **caixinhas** (cofres animados, "Guardar" e "Tirar"); em cima, o total guardado e para usar, com o saldo de cada conta em **"Ver por conta"**; embaixo, a sugestão de guardar a sobra das metas e **"Tirar de uma caixinha"**. A explicação fica no "?". Cada caixinha que rende mostra como rende e quanto receberia se resgatasse hoje, e tem **"Atualizar o valor"** (o que o banco mostra; a diferença pode ser rendimento, imposto ou dinheiro guardado ou tirado). No formulário, alvo, prazo e **como rende** (não rende, % do CDI ou taxa fixa ao ano) ficam em "Mais detalhes".

### Planejar > Simulador: "E se eu comprar"
Valor, com o que vai pagar (as aplicações aparecem por último, com "(resgatar)") e em quantas vezes; "Minha renda por mês" fica em "Mais detalhes".

### Saúde: "Como vão as suas finanças" (antes as abas Gráficos e Relatórios; juntas desde a 1.23.0, D64)
1. O **panorama**: contadores **Saudáveis · Atenção · Alerta** e **Aguardando dados** (desde a 1.25.0, D67/D1: só conta como saudável com 30 dias de anotações ou com a renda informada em Ajustes; sem essa base, o cartão mostra "— Aguardando dados"), e qual é o mais urgente
2. **4 indicadores à vista**: O que é seu de verdade · Folga para os próximos 30 dias · Reserva de emergência · Taxa de poupança (selo, valor, gráfico, leitura em uma frase e **Ler o relatório**)
3. **Ver mais indicadores** (abre): Peso das dívidas · Quanto da renda já tem dono · Custo fixo de vida · Para onde vai o dinheiro · De que é feito o que você tem · Custo dos juros e multas
4. **Mês a mês** (abre): este mês contra o anterior, com setas para voltar até 12 meses
5. **Todos os relatórios em lista** (do mais urgente ao mais tranquilo). Cada relatório tem 5 partes (O que é · Como você está · Para comparar · O que isso quer dizer · Por onde começar) e um botão para compartilhar; volta para onde a pessoa estava
No Modo contador, o balancete aparece no fim. "Patrimônio" e o jeito de ler os indicadores ficam no "?" do topo. Selos: ✓ Saudável (verde-musgo), ! Atenção (âmbar), ✕ Alerta (vermelho), — Aguardando dados (neutro); a faixa no topo de cada cartão segue o selo.

### Dinheiro > Todas as anotações: "Tudo o que você anotou" (até a 1.26.0 ficava em Mais > Anotações; a aba Mais saiu na 1.27.0)
Busca à vista; ordem por data, valor ou nome e os filtros ficam em **"Ordenar e filtrar"** (com um resumo do que está escolhido); "Limpar filtros" aparece à vista quando há filtro. 15 por vez. É a única lista completa.

### Notícias: "Hoje no Brasil" (Início > Hoje no Brasil > Ver todas as notícias)
Dólar, Selic, CDI, inflação (e o que ficou mais caro ou mais barato), preço dos combustíveis, previsões do Boletim Focus e notícias oficiais do IBGE. Cada item mostra o selo **CERTEZA** (dado publicado) ou **POSSIBILIDADE** (previsão), o título, o **"para você"** (quando dá) e o **link do site oficial**; o fato e "O que isso significa" ficam em **"Entenda a notícia"**. Selic, CDI, IPCA e Focus têm "?". A seta de voltar leva para onde a pessoa estava (Início ou Mais). Atualiza ao meio-dia; as notícias do IBGE o próprio celular busca no site do IBGE (no máximo 1 vez por hora, sem enviar dado nenhum, D62). Sem internet, mostra a última cópia com a data.

### O chat (o rostinho do Mordomo, no alto de toda tela)
Abre uma janela preta e dourada com **63 perguntas prontas** em 5 grupos (Meu dinheiro · Contas e dívidas · Planejar · Como usar o app · Aprender); o grupo da aba atual abre primeiro. Tem busca por palavras (mostra até 3 perguntas parecidas, nunca inventa) e, em cada resposta, **Ver no app**, que leva ao **lugar exato** (abre a seção, a janela ou a folha certa e destaca o lugar com uma borda dourada). Sem internet e sem inteligência artificial. Lista em `CHAT-PERGUNTAS.md`.

### Ajustes (a engrenagem, no alto de toda tela): quatro seções que abrem
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
| Procurar um gasto antigo | Dinheiro > Todas as anotações (busca) |
| Trocar de celular | Ajustes (engrenagem) > Seus dados > Guardar uma cópia → no novo, Recuperar |
| Apaguei sem querer | Botão **Desfazer** (8 segundos) |
| O banco mostra outro valor | Dinheiro > a conta > **Conferir com o banco** |
| Quanto rendeu meu CDB | **Investir** |
| Minha caixinha rende 115% do CDI | Planejar > Caixinhas > Editar > Mais detalhes > **% do CDI** (ou Investir > + Nova aplicação) |
| O valor da caixinha não bate com o banco | Caixinhas > **Atualizar o valor** (ou o lembrete semanal do Início) |
| Minhas finanças vão bem? | **Saúde** |
| Tenho uma dúvida | **Perguntar** (o rostinho no alto da tela) |
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

## Redesign em andamento (D67, desde a 1.25.0)
O que já mudou na tela (fases A e B): a **ajuda dos termos é um ⓘ** no fim da linha do título (antes "?"); a **abertura** aparece só no primeiro uso e ao atualizar; **um aviso por vez** no rodapé, e o balão do Perguntar fala uma vez só; **meta estourada** = pote cheio e vermelho com "R$ X acima" (o pote enche conforme o gasto); **bordas de campo** mais escuras; a **dica de instalar** muda conforme o aparelho (em Ajustes > Ajuda fica o passo a passo). Na fase C (1.26.0): **cores e letras novas** (veja "Regra geral de cores" acima; letras Fraunces e Atkinson). O resto deste mapa continua valendo até a fase D (barra de baixo e lugares novos); cada mudança será anotada aqui.
