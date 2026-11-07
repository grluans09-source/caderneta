# Histórico de versões

> O app se chamava **Caderneta** até a versão 1.14.0. A partir da 1.15.0 o nome é **Balancete** (o endereço e os dados não mudaram).

Formato: versão semântica (`MAIOR.MENOR.CORREÇÃO`). Cada versão diz **o que mudou para a pessoa que usa**.
Antes da 1.0.0 as versões eram numeradas só pelo nome do cache do app (v1 a v16); estão aqui como marcos de desenvolvimento.

## [1.21.0-beta.1]: 7 de novembro de 2026 · notícias de fontes oficiais
- **"Hoje no Brasil" no Início** e uma **tela de Notícias** (também em Mais), com o que mudou na economia e o que isso pode significar para você.
- **Só fontes oficiais**, cada uma com o **link do site oficial**:
  - **Banco Central**: dólar, Selic, CDI e as previsões do Boletim Focus;
  - **IBGE**: inflação do mês e de 12 meses, o que ficou mais caro e mais barato (grupos do IPCA) e as últimas notícias oficiais;
  - **ANP**: preço médio no Brasil de gasolina, etanol, diesel e gás de cozinha.
- **Certeza ou possibilidade**: o selo **CERTEZA** marca dado oficial já publicado; **POSSIBILIDADE**, previsão (Focus), que pode mudar.
- **"Para você"**, calculado só no celular, com os seus dados. Exemplos:
  - "Você gasta cerca de R$ 400 por mês com Combustível: com essa variação, são uns R$ 11 a mais";
  - "Seus R$ 2.950 para usar agora perdem cerca de R$ 24 de poder de compra num mês como esse";
  - "Seu CDB (12% ao ano) rende cerca de 88% do CDI";
  - a lembrança de quitar as dívidas mais caras quando os juros estão altos.
- **Atualiza todo dia ao meio-dia** (horário de Brasília). Um robô gratuito do próprio GitHub busca os dados (`tools/noticias.js`) e publica junto com o app. Não há servidor, e o celular só conversa com o endereço do próprio app. Sem internet, aparece a última cópia guardada, com a data.
- **Segurança**: o arquivo de notícias é conferido antes de aparecer. Números fora do normal, texto malicioso e links que não sejam de sites oficiais (gov.br, bcb.gov.br, ibge.gov.br) são descartados.
- As notícias explicam o que os números costumam significar, sem recomendar investimento.
- Chat: nova pergunta **"O que mudou na economia que me afeta?"** (agora são 53).
- Testes: 767 verificações em 29 arquivos (novo: notícias).

## [1.20.0-beta.1]: 7 de novembro de 2026 · Investimentos
- **Aba nova: Investir**, logo depois de Dinheiro (a barra agora tem 7 abas). Mostra quanto está investido, quanto rendeu no mês e no ano, cada aplicação (poupança, CDB, Tesouro, fundos) e as caixinhas que rendem.
- **Rendimento automático.** Cada aplicação tem a **taxa ao ano** que aparece no app do banco. O app calcula o rendimento **a cada dia útil**: sem sábado, domingo e **feriados nacionais**, inclusive Carnaval, Sexta-feira Santa e Corpus Christi, calculados sem internet a partir da Páscoa. Usa juros sobre juros, na convenção de 252 dias úteis no ano.
- **Uma anotação por mês** por aplicação ("Rendimento de novembro"), que cresce a cada dia útil. Entra na categoria **Rendimentos**, receita financeira separada do que você ganha trabalhando.
- **Conferir com o banco** numa aplicação: se o banco mostrar mais, a diferença vira **rendimento**; se mostrar menos, vira **imposto ou taxa** (IR, IOF). Assim o app sempre bate com o banco.
- **Aplicar** e **Resgatar**: abrem a folha de transferência entre o banco e a aplicação. Não dá para resgatar mais do que há na aplicação (trava).
- **A conta Poupança virou aplicação sozinha** (decisão do dono), com um aviso. É só informar a taxa para ela começar a render no app.
- **Caixinhas podem render**: ao editar a caixinha, informe a taxa ao ano. O rendimento entra na conta onde o dinheiro dela está e fica guardado na caixinha.
- **Primeiros passos**: a pergunta "Poupança ou reserva" virou **"Você tem dinheiro guardado ou investido?"**, com a taxa ao ano (opcional).
- O dinheiro investido **não entra no "dinheiro para usar agora"**: o app não sugere pagar contas com ele. Ele continua no "é meu de verdade" e conta como **guardado e investido** na balança e na reserva de emergência.
- Chat: nova pergunta **"Quanto meus investimentos renderam?"** (agora são 52).
- Testes: 747 verificações em 28 arquivos (novo: investimentos).

## [1.19.0-beta.1]: 7 de novembro de 2026 · travas de coerência
O app agora confere cada anotação antes de salvar (pedido do dono). Quando algo **não pode acontecer na vida real**, ele **não deixa salvar** e explica. Quando é **possível, mas estranho**, ele **pergunta "era isso?"** e deixa confirmar. A explicação vem numa janela com o Mordomo, com "Corrigir" e, quando cabe, "Sim, está certo".
- **Não deixa salvar:**
  - um gasto ou compra no **cartão acima do limite disponível**, quando o cartão tem limite cadastrado (compra parcelada conta pelo valor total, como no banco);
  - a **carteira (Dinheiro) ficar negativa**, ao gastar, transferir, alterar ou **apagar** uma anotação.
- **Pergunta antes de salvar:**
  - o **banco ficar negativo** ("você usou o cheque especial?");
  - **pagar mais do que deve** (o que passar vira crédito);
  - **receber de uma pessoa mais do que ela devia**;
  - **data a mais de 2 meses no futuro ou de mais de 5 anos atrás**;
  - **valor 20 vezes acima do costume** e acima de R$ 1.000 ("confira os zeros");
  - salvar um cartão com **limite menor do que já se deve** nele.
- Os botões **"Pagar"** (acerto de contas) e **"Paguei"** (pessoas) agora sugerem pagar pela **conta com mais dinheiro livre**, e não mais pela primeira da lista (que costumava ser a carteira). A pessoa pode trocar.
- Chat: nova pergunta **"Por que o app não deixou eu salvar?"** (agora são 51).
- Testes: 723 verificações em 27 arquivos (novo: travas de coerência).

## [1.18.0-beta.1]: 7 de novembro de 2026 · o chat do Balancete
- **Pílula "Perguntar"** no canto esquerdo de baixo, com o rostinho do Mordomo (simétrica à pena, à direita).
  - A cada troca de aba ela **fala uma frase curta** e **reage**: acena no Início, olha para baixo no Dinheiro ("cada centavo no seu lugar"), olha para cima no Planejar, lê nos Gráficos e Relatórios.
  - Com letra Enorme, aparece só o rostinho.
- **Chat do Balancete**: ao tocar na pílula, sobe uma janela preta e dourada com o Mordomo. São **50 perguntas prontas** em 5 grupos (*Meu dinheiro*, *Contas e dívidas*, *Planejar*, *Como usar o app*, *Aprender*), aprovadas pelo dono (`docs/CHAT-PERGUNTAS.md`).
  - Muitas respostas são **calculadas na hora com os dados da pessoa**. Exemplos: "Quanto posso gastar por dia até o fim do mês?" (para usar agora, menos o que falta pagar, dividido pelos dias que faltam), "Tenho conta atrasada?", "Quanto do limite do cartão eu já usei?", "Quem me deve dinheiro?", "Minhas finanças estão saudáveis?".
  - Campo **"Escreva sua dúvida"**: procura a pergunta mais parecida pelas palavras e mostra até 3. Não inventa resposta.
  - O grupo da **aba onde a pessoa está** já vem aberto.
  - Respostas com o botão **"Ver no app"** levam à tela certa (acerto de contas, Pessoas, Contas fixas...).
  - **Funciona sem internet e sem inteligência artificial**; nada sai do celular. O chat não recomenda investimento específico.
- Testes: 709 verificações em 26 arquivos (novo: chat do Balancete).

## [1.17.0-beta.1]: 7 de novembro de 2026 · o botão de anotar é uma pena
- **O botão de anotar virou uma pena de escrever** num medalhão de ouro com serrilha, como o Brasão. Saiu a palavrinha "Anotar" do lado: a pena já diz o que o botão faz, como a pena de tinteiro dos livros contábeis antigos. O nome continua para quem usa leitor de tela. O anel dourado que pulsa de vez em quando continua.
- Aberto, a pena dá lugar a um **×** para fechar, e as 4 bolinhas saem do mesmo jeito.
- Os textos que diziam "toque no +" agora dizem "toque na pena dourada".
- Decidido no passo 4: a pílula **"Perguntar"** do chat vai ficar no **canto esquerdo de baixo** (um botão em cada canto). Ela entra junto com o chat, no passo 5, para ninguém tocar num botão que ainda não faz nada.
- Testes: 688 verificações em 25 arquivos.

## [1.16.0-beta.1]: 7 de novembro de 2026 · o Mordomo no Início e os mascotes dos momentos especiais
- **O Mordomo é a balança do Início.** A balança virou o personagem: metal com volume, pratos fundos pendurados por correntes, pedestal art déco, gravata-borboleta e o rosto no medalhão de esmalte. As moedas coloridas continuam nos pratos, com o mesmo significado de antes.
  - **Ele fica sempre em equilíbrio**, porque é a regra da contabilidade: o que você tem é igual ao que você deve mais o que é seu de verdade. Quem mostra a situação é **a cara dele**: **confiante** quando sobra bem, **atento** quando está apertado ou há conta atrasada, **preocupado** quando você deve mais do que tem.
  - **Os olhos acompanham o seu dedo** e ele pisca de vez em quando. **Tocar nele** faz uma reverência e ele diz como você está, sempre num tom de ajuda.
  - Quando você anota algo, ele balança e se reequilibra, como antes.
- **Mascotes dos momentos especiais**, que só aparecem quando há motivo:
  - **Moedinha**: cai girando quando entra dinheiro (Recebi), no lugar do carimbo "ANOTADO".
  - **Selo de lacre bordô "PAGO"**: sela quando você paga uma dívida ou uma conta fixa.
  - **Pesinho**: desce quando você guarda dinheiro numa caixinha.
  - **Pesão de ferro**: aparece no Início, **uma vez por dia**, quando há conta atrasada, com "Resolver agora" (abre o acerto de contas) e "Agora não".
- Com "Movimento: Parado", nenhum mascote se mexe nem aparece.
- Testes: 687 verificações em 25 arquivos (novo: Mordomo e momentos).

## [1.15.0-beta.1]: 7 de novembro de 2026 · o app agora se chama Balancete
- **Nome novo: Balancete** (antes Caderneta, que se confundia com a caderneta de poupança). Muda o nome na tela, no ícone instalado, na aba do navegador e nos textos. **Não mudam** o endereço do app nem o lugar onde os dados ficam guardados, então ninguém perde nada; cópias de dados antigas continuam servindo.
- **Logo novo: o Brasão.** Uma moeda de ouro com serrilha, aro em relevo, o nome em cima, "suas contas em ordem" embaixo e a balança em alto-relevo no meio. É o novo ícone do app (iPhone, Android e navegador) e aparece pequeno ao lado do nome no Início.
- **Abertura nova: o Brasão ganha vida.** A moeda cai girando e assenta, um reflexo passa pelo ouro, o centro da balança cresce, **abre os olhos e pisca**, a balança se acomoda e ele volta a ser logo, com o nome aparecendo. Leva cerca de 4 segundos; **tocar na tela pula**. Com "Movimento: Parado", aparece só o logo e o nome por um instante.
- **Letra de contabilidade.** Títulos e valores passam da Georgia para **Times New Roman** (no Android, a parecida Noto Serif), a letra dos balanços publicados. **Todos os números agora têm algarismos alinhados** (mesma altura e largura), como manda a contabilidade: vírgulas e centavos ficam um embaixo do outro. Antes os números "subiam e desciam" e o Android nem tinha a Georgia.
- Os ícones PNG agora são desenhados a partir do mesmo desenho do Brasão (`tools/brasao.js`), pelo Chrome sem janela (`npm run icones`).
- Testes: 669 verificações em 24 arquivos (novo: identidade do Balancete).

## [1.14.0-beta.1]: 7 de novembro de 2026 · quatro funções contábeis: conferir com o banco, contas do ano, mês a mês e custo fixo de vida
Escolhidas pelo dono a partir da análise contábil (`docs/ANALISE-CONTABIL.md`).
- **Conferir com o banco.** Na conta de banco (Dinheiro > tocar na conta > **Conferir com o banco**), a pessoa digita o saldo que vê no app do banco.
  - Se bater, o app guarda a data ("Conferido com o banco em 07/11").
  - Se faltar dinheiro no banco, oferece **anotar o gasto que faltou** (abre a folha já com a conta e o valor) ou **só corrigir o saldo**, que cria uma anotação de verdade na categoria "Diferença ao conferir", com a data de hoje. O que já estava anotado não muda e a conta continua fechando.
  - Se sobrar dinheiro no banco, faz o mesmo com um ganho.
- **Contas do ano** (Planejar > Contas fixas). Para cada conta que repete todo ano (IPVA, IPTU, matrícula), o app mostra quando vence e **quanto separar por mês** até lá, arredondado para cima em reais, com o total por mês.
  - Um toque cria uma **caixinha já preenchida** com nome, alvo e data.
  - Com a caixinha criada, a linha mostra quanto já foi guardado, e a conta por mês passa a considerar só o que falta.
- **Mês a mês.** No topo dos Gráficos, um cartão compara um mês com o anterior: entrou, saiu, sobrou, uma frase ("você gastou R$ 100 a menos (−8%) e sobrou R$ 100 a mais") e as 3 categorias que mais mudaram. Setas para ver até 12 meses para trás.
  - Nos 10 primeiros dias do mês, o **Início** mostra "**Outubro fechou**" com o mesmo resumo. O cartão some ao tocar em "Entendi".
- **Custo fixo de vida** (novo indicador, agora são **10**): quanto custa o básico por mês = contas fixas do mês + contas do ano divididas por 12 + parcelas e dívidas (média dos próximos 3 meses), comparado com a renda. Até 50%: saudável; até 70%: atenção; acima: alerta. Tem relatório de consultor próprio, que explica a diferença para "Quanto da renda já tem dono".
- A conta de banco na lista diz "Toque para editar ou conferir com o banco" ou a data da última conferência.
- Testes: 657 verificações em 23 arquivos (novo: as quatro funções contábeis).

## [1.13.1-beta.1]: 7 de novembro de 2026 · acerto de contas em janela, atrasada certa e dica de instalar
- **Acerto de contas em janela por cima da tela.** "Abrir o acerto de contas" agora sobe uma janela **preta e dourada**, igual ao cartão (antes a lista abria **branca** dentro do cartão preto e esticava a tela). Tem botão **Fechar** grande e as setas de mês. Cada conta diz o prazo em palavras: **"vence em 13 dias"** ou **"atrasada há 4 dias"**, com as atrasadas primeiro. Ao tocar em **Pagar**, a janela dá lugar à folha de anotar já preenchida; ao salvar ou fechar a folha, **a janela volta** com o total atualizado, para pagar a próxima.
- **Correção: conta vencida neste mês agora conta como atrasada.** Uma conta que venceu no dia 3, vista no dia 7, aparecia sem aviso no acerto de contas, enquanto a agenda dizia "atrasada há 4 dias". Agora os dois dizem a mesma coisa.
- **Dica para instalar o app.** Aberto no navegador, o celular coloca a barra de endereço e botões dele (como uma **seta de subir**, que **não é do Caderneta** e por isso o app não consegue mover) por cima da tela. O Início mostra **uma vez por aparelho** como instalar (Android ou iPhone) e, quando o navegador permite, um botão **Instalar agora**. Some ao tocar em "Entendi" e não aparece em quem já instalou.
- **Correção: o botão + fica exatamente no canto.** A palavra "Anotar" estava do lado direito do círculo; agora fica à esquerda, e as bolinhas saem do próprio botão.
- Testes: 633 verificações em 22 arquivos (novo: acerto, atrasada e dica de instalar).

## [1.13.0-beta.1]: 7 de novembro de 2026 · botão + no canto, conta Dinheiro para todo mundo
- **Botão + no canto direito de baixo**, logo acima da barra, com a palavrinha "Anotar" ao lado. Ele saiu do meio da barra, que agora tem **6 abas iguais** e deixa um espaço livre para a aba de Investimentos que vem a seguir.
- **Bolinhas em quarto de círculo.** Ao tocar no +, as 4 bolinhas abrem **para a esquerda e para cima**, a partir do canto, igualmente espaçadas (0°, 30°, 60° e 90°) e com o nome ao lado de cada uma. O botão redondo de tipo dentro da folha também foi para o canto direito, no mesmo lugar, e abre as bolinhas do mesmo jeito. Cabe com letra Enorme.
- **Relatórios saiu da tela Mais**, porque já tem aba própria na barra de baixo (continua também no botão "Ler o relatório" dos Gráficos).
- **Novidades chegam para quem já usava o app.** Quem tinha dados antes da conta Dinheiro existir agora **ganha a conta Dinheiro** (a carteira, fixa, que não se apaga) ao abrir o app, sem mexer em nada do que já tinha, com um aviso na tela. Vale também ao restaurar uma cópia antiga. Se já existir outra conta chamada Dinheiro, a carteira entra como "Dinheiro vivo"; uma conta que já se chama Carteira é reconhecida e não duplica.
- A página tem mais folga embaixo para o botão + não tapar o fim das listas.
- Testes: 620 verificações em 21 arquivos (novo: conta Dinheiro para quem já usa).

## [1.12.0-beta.1]: 7 de novembro de 2026 · visual vivo, bolinhas em círculo, busca com lista completa e categorias favoritas
- **Busca com lista completa.** Tocar em "Buscar conta" ou "Buscar categoria" **abre a lista com tudo** (em ordem alfabética, rolando dentro da coluna), para quem lembra que a categoria existe mas não lembra o nome. Digitar filtra todas (sem limite) e mostra quantas achou. "↑ Mostrar só as favoritas" volta à lista curta.
- **5 categorias favoritas.** Como as 3 contas favoritas: "★ Escolher minhas 5 favoritas" (separadas para gastos e para ganhos). Sem escolha, valem as mais usadas.
- *(Posição substituída na 1.13.0: as bolinhas agora abrem em quarto de círculo a partir do canto direito.)* **Bolinhas do + em círculo exato e simétricas**: as 4 ficam em pontos de um mesmo círculo (22,5°, 67,5°, 112,5° e 157,5°) com o centro no botão +, espelhadas à esquerda e à direita; entram girando e quicando, uma depois da outra.
- **Seletor de tipo dentro da folha de anotar.** Saíram as 3 bolinhas escondidas no topo. Agora há um **botão redondo fixo embaixo, no centro**, com a cor e o símbolo do tipo atual. Tocar nele gera as 4 bolinhas com a mesma animação; a do **tipo atual fica apagada** ("você está aqui") e as outras 3 trocam o tipo **sem perder o que já foi digitado**.
- **Visual vivo.** Formas mais grossas, redondas e cheias no lugar das linhas finas: ícones da barra de baixo e das ferramentas viraram desenhos **cheios e arredondados**; botões e opções em formato de pílula com sombra, cartões mais arredondados, títulos com uma barrinha dourada grossa, curva do patrimônio com traço mais grosso e pontilhado em bolinhas; some a linha fina da margem.
- **Movimento (só com Movimento: Vivo):** **abertura do app** com moedas douradas caindo e o nome aparecendo; **troca de aba** com o ícone quicando, bolha dourada sob a aba aberta e a tela entrando com os blocos subindo em sequência; **gráficos** que crescem (barras, réguas e composição); botão + que "respira" com um anel dourado; selo de alerta que pulsa; botões que afundam ao tocar.
- Com letra Enorme a barra de baixo foi ajustada para não passar da largura.
- Testes: 606 verificações em 20 arquivos.

## [1.11.0-beta.1]: 7 de novembro de 2026 · Gráficos, Relatórios de consultor, paleta preto/dourado/branco e acerto de contas
- **Nova aba Gráficos** com **9 indicadores** de finanças pessoais, cada um com selo (Saudável, Atenção, Alerta), valor, gráfico e leitura em uma frase: O que é seu de verdade (patrimônio), Folga para os próximos 30 dias, Reserva de emergência (meses), Taxa de poupança, Peso das dívidas, Quanto da renda já tem dono, Para onde vai o dinheiro, De que é feito o que você tem e Custo dos juros e multas.
- **Relatórios agora são de consultor.** Um relatório por indicador, com 5 partes: O que é · Como você está (com os números da pessoa) · Para comparar (faixas de referência) · O que isso quer dizer · Por onde começar. A tela abre com um **panorama** e lista primeiro o que está em alerta. Dá para compartilhar o relatório como texto. Texto automático e educativo; não substitui um profissional.
- **Barra de baixo** com 7 espaços: Início, Dinheiro, Planejar, **+**, **Gráficos**, **Relatórios**, Mais. Com letra grande, só a aba aberta mostra o nome (os outros ficam só com o ícone e nome para leitor de tela).
- **Paleta preto, dourado e branco.** O que é **clicável** é dourado (botões, o +) ou tem **contorno dourado** e seta ›; o que está **selecionado** fica **preto** com texto dourado (no tema escuro, creme). Capa e barra pretas, fundo branco quente, cartões brancos. Cores com significado continuam: bordô = saiu/dívida, azul = entrou, ardósia = transferência, ametista = guardado, cobre = bens. Ícone e cor da barra do celular atualizados.
- **Planejar harmonizado.** Três partes com título: **Ferramentas** (4 botões com ícone e seta), **Acerto de contas do mês** (cartão preto com ouro) e **Agenda**. No cartão, **"Abrir o acerto de contas"** mostra **todas as dívidas e contas fixas do mês**, cada uma com **Pagar** (ou **Paguei**); o que já foi pago aparece embaixo. A agenda segue como visão rápida.
- Testes: 590 verificações em 20 arquivos.

## [1.10.0-beta.1]: 7 de novembro de 2026 · anotar em dois toques, listas curtas e conta Dinheiro com cédulas
- **Anotar em dois toques.** O botão **+** agora **gera 4 bolinhas com animação** (saem do botão em leque): **Gastei** (bordô), **Recebi** (azul), **Transferi entre contas** (ardósia) e **Comprei um bem** (cobre). O 1º toque gera as bolinhas, o 2º escolhe o tipo e abre a folha já nesse tipo. Tocar fora, no × ou em Esc fecha. (Substitui as 2 bolinhas fixas da 1.9.0.)
- **Folha de anotar mais curta.** Saíram os 4 botões de tipo do topo. No lugar, **3 bolinhas** (os outros 3 tipos) no canto do cabeçalho, para trocar de tipo; o título mostra o tipo atual.
- **Listas curtas com busca.** "De onde saiu" mostra a **Dinheiro + 3 contas** e "Para onde foi" mostra **5 categorias** (as mais usadas), cada uma com um campo de **busca** que olha todas. As 3 contas são as **favoritas** que a pessoa escolhe ("★ Escolher minhas 3 favoritas"); sem escolha, valem as mais usadas.
- **Conta Dinheiro (a carteira).** Todo app novo já nasce com a conta **Dinheiro**; ela **não pode ser apagada**, só alterada. Dá para **contar as cédulas** de R$ 2, 5, 10, 20, 50, 100 e 200 (o saldo passa a valer o que foi contado, com confirmação). Contas antigas chamadas "Carteira" ou "Dinheiro" viram a carteira sozinhas.
- **Sugestão de reais inteiros.** Ao anotar um valor com centavos na conta Dinheiro (ex.: R$ 3,25), o app **sugere arredondar**: "Para R$ 4,00", "Para R$ 3,00" ou "Manter R$ 3,25", para o saldo do dinheiro vivo não carregar moedas perdidas.
- Novo teste de 44 verificações; testes antigos ajustados (548 verificações em 19 arquivos).

## [1.9.0-beta.1]: 7 de novembro de 2026 · anotação rápida: bolinhas Gastei e Recebi
> *Histórico: as 2 bolinhas fixas foram substituídas na 1.10.0 pelo menu de 4 bolinhas que o botão + gera (D43).*
- **Problema:** os botões "Gastei" e "Recebi" do Início pareciam texto, não botão, e só existiam nessa tela.
- **Solução:** viraram **duas bolinhas na barra de baixo, sobre o botão + Anotar**: uma **bordô (Gastei)** e uma **azul (Recebi)**, com o nome escrito dentro. Aparecem em **todas as telas**, então dá para anotar logo ao abrir o app, sem procurar. Tocar numa bolinha abre a folha de anotar **já escolhida** em Gastei ou Recebi.
- O botão **+ Anotar** do meio continua igual. Os botões saíram do Início (um só lugar).
- As cores seguem a regra da D40: saiu = bordô, entrou = azul. Com letra Enorme as bolinhas ficam um pouco menores.
- Novo teste (517 verificações em 19 arquivos).
- **Documentação revisada**: README, roteiro, arquitetura, decisões e guia dos testadores atualizados; `PLANO-BETA.md` e `AUDITORIA-FUNCOES.md` marcados como históricos; regra "Git sempre em dia" no CLAUDE.md.

## [1.8.2-beta.1]: 7 de novembro de 2026 · mapa de cores da aba Planejar
A aba Planejar ganhou uma organização por cor, seguindo a regra "uma cor, um significado":
- **As 4 ferramentas** têm uma faixa na cor do assunto: Metas do mês = bordô (limite do que sai), Caixinhas = ametista (guardado), Contas fixas = ardósia (compromisso fixo), Simulador = cobre (compra de bem).
- **"Falta pagar"**: o cartão tem uma faixa bordô (tudo o que sai), e cada linha leva a cor do tipo (dívida em bordô, conta fixa em ardósia).
- **Agenda**: cada conta tem a faixa do tipo (dívida = bordô, conta fixa = ardósia, a receber = azul safira) e uma **legenda** acima. A **data** mostra a urgência: pintada = vence hoje ou já passou; clara = vence em até 3 dias; sem destaque = mais longe.
- Novas cores de significado fixo: ametista e cobre agora existem como variáveis do app (claro e escuro).
- Novos testes (503 verificações em 18 arquivos).

## [1.8.1-beta.1]: 7 de novembro de 2026 · Planejar com as ferramentas sempre à vista
- **Problema:** com muitas contas a pagar, as ferramentas (Metas, Caixinhas, Contas fixas, Simulador) ficavam lá embaixo, depois da agenda.
- **Solução:** as 4 ferramentas agora ficam **no topo** da tela Planejar, em 4 botões compactos. O cartão do mês lista até 5 contas (e diz "e mais N"), e a **agenda mostra só 4** com o botão **"Ver todas (N)"** / "Mostrar menos". Ao voltar à tela, a agenda volta recolhida.
- Novo teste (497 verificações em 18 arquivos).

## [1.8.0-beta.1]: 7 de novembro de 2026 · só a interface Balança, paleta nova e revisão
- **Apagados os jeitos Razão e Cofre e fluxo** (pedido do dono, D39). Fica só a interface Balança. Sem escolha de jeito em Ajustes; os Primeiros passos voltam a 3 passos. Quem tinha escolhido outro jeito volta sozinho para a Balança, sem perder dados.
- **Paleta nova, de luxo contábil**: azul-noite, marfim e ouro. O **verde saiu do app** (confundia com "selecionado"). Agora cada cor tem um só significado: **azul safira** = entrou e dinheiro para usar; **bordô** = saiu e dívida; **ametista** = guardado nas caixinhas; **cobre** = bens; **ouro** = é meu de verdade; e **ouro com fundo claro** = item selecionado.
- Ícone do app, cor da barra do celular e tela de abertura atualizados para a paleta nova.
- **Inconsistências corrigidas**: a legenda da balança agora explica todas as moedas (faltava "Meus bens", e "O que eu tenho" somava o que as moedas azuis não mostravam); no cartão, "Livre" virou "Disponível" (o app já usava "para usar" para o dinheiro); as abas do Dinheiro cabem numa linha e nomes longos de conta não são mais cortados; o número grande do Início encolhe em vez de quebrar.
- Documentação atualizada (README, arquitetura, avaliação).

## [1.7.1-beta.1]: 6 de novembro de 2026 · conferência final dos 3 jeitos
> *Histórico: esta versão tinha os jeitos Razão e Cofre e fluxo, **removidos na 1.8.0 (D39)**.*
Conferência com letra **Enorme**, tema **escuro** e **Movimento** parado e vivo, em tela de celular (375 px), nos 3 jeitos, em 16 telas (Início, 4 abas do Dinheiro, Planejar, Metas, Caixinhas, Contas fixas, Simulador, Mais, Anotações, Relatórios, Ajustes e a folha de Anotar):
- **Corrigido:** no jeito Razão, com letra Enorme, as duas páginas do livro passavam da largura da tela. Agora, com letra Enorme, as páginas ficam uma embaixo da outra.
- **Corrigido:** o número grande do Início quebrava no meio ("R$ 102.930,0" e "0" em outra linha). Agora ele encolhe para caber.
- **Corrigido:** nomes de conta muito longos cortavam o texto dentro dos cofres. Agora o cofre cresce.
- Depois das correções: nenhuma tela passa da largura (0 problemas nas 96 combinações de jeito, tema e tela conferidas com letra Enorme) e não houve erro no console.

## [1.7.0-beta.1]: 6 de novembro de 2026 · escolha do jeito na primeira abertura
> *Histórico: esta versão tinha os jeitos Razão e Cofre e fluxo, **removidos na 1.8.0 (D39)**.*
- Os **Primeiros passos** agora têm 4 passos. O 2º é **"Escolha seu jeito de usar"**, com uma miniatura de cada jeito (Balança, Razão, Cofre e fluxo). A barra de baixo já muda na hora e a escolha fica salva. Dá para trocar depois em Ajustes.
- Novo teste (561 verificações em 22 arquivos).

## [1.6.0-beta.1]: 6 de novembro de 2026 · Mais, Anotações, Relatórios e Ajustes nos 3 jeitos
> *Histórico: esta versão tinha os jeitos Razão e Cofre e fluxo, **removidos na 1.8.0 (D39)**.*
- **Mais:** Balança (cartões), Razão (vira o **Índice** do livro, com a linha pontilhada e o resumo de cada item) e Cofre e fluxo (peças em forma de cofre).
- **Anotações:** na Razão as linhas ficam em itálico, como num livro-caixa; no Cofre ganham uma faixa dourada na lateral.
- **Relatórios:** na Razão as barras ficam tracejadas; no Cofre viram canos (vermelho para o que saiu, verde para o que veio).
- **Ajustes:** na Razão os grupos viram "Capítulo 1, 2, 3"; no Cofre ganham um pequeno cano antes do título.
- Novo teste (549 verificações em 21 arquivos).

## [1.5.0-beta.1]: 6 de novembro de 2026 · Anotar nos 3 jeitos
> *Histórico: esta versão tinha os jeitos Razão e Cofre e fluxo, **removidos na 1.8.0 (D39)**.*
- **Razão:** a folha de anotar vira páginas de livro ("Escrever no livro"; "Corrigir no livro" ao editar), com linhas de caderno e margem dourada.
- **Cofre e fluxo:** a folha vira "Mover o dinheiro". Cada conta aparece como um cofre com o nível do que tem (dívidas em vermelho) e as colunas perguntam "De qual cofre sai" e "Para qual cofre vai". O fio que liga as duas colunas fica mais grosso, como um cano.
- **Balança:** igual a antes.
- Novo teste (537 verificações em 20 arquivos).

## [1.4.0-beta.1]: 6 de novembro de 2026 · jeitos em Planejar e Dinheiro
> *Histórico: esta versão tinha os jeitos Razão e Cofre e fluxo, **removidos na 1.8.0 (D39)**.*
- **Planejar / A pagar** nos 3 jeitos: Balança (cartão do mês), Razão (o mês como um livro com as páginas "A pagar" e "Já pago") e Cofre e fluxo (cada conta a pagar como um cano que se esvazia). Setas de mês, agenda e botões de pagar iguais nos três.
- **Dinheiro / Contas** nos 3 jeitos: Balança (linhas), Razão (livro das contas com as páginas "Tenho" e "Devo") e Cofre e fluxo (um cofre por conta, o guardado em roxo). As abas Dívidas, Bens e Pessoas continuam iguais.
- Novo teste (524 verificações em 19 arquivos).

## [1.3.0-beta.1]: 6 de novembro de 2026 · três jeitos de usar
> *Histórico: esta versão tinha os jeitos Razão e Cofre e fluxo, **removidos na 1.8.0 (D39)**.*
- Novo em **Ajustes > Aparência > Jeito de usar**: **Balança** (padrão), **Razão** e **Cofre e fluxo**. Cada jeito organiza o app de um modo (veja [JEITOS-DE-USAR.md](docs/JEITOS-DE-USAR.md)); os dados são os mesmos.
- **Início nos 3 jeitos**: Balança (com botões Gastei e Recebi), Razão (livro do mês com páginas Entrou e Saiu) e Cofre e fluxo (um cofre por conta, cartões em vermelho).
- A barra de baixo muda por jeito (Livro, Contas, A pagar; ou Cofres sem o botão Dinheiro). A capa tem cor própria em cada jeito.
- Ainda falta dar a cara de cada jeito às outras telas (ver docs/JEITOS-DE-USAR.md, etapas J2 a J7).
- Novo teste dos jeitos (508 verificações em 18 arquivos).

## [1.2.0-beta.1]: 6 de novembro de 2026 · app reorganizado (cada coisa em um lugar)
Segue o [mapa do app](docs/MAPA-DO-APP.md). Nenhuma função foi removida; o que mudou foi **onde cada coisa mora**:
- **Início enxuto**: balança com 3 linhas (o que eu tenho, o que eu devo, é meu de verdade), resumo do mês, **uma linha** "Falta pagar em ..." que leva ao Planejar, avisos, e só as 3 últimas anotações.
- **Planejar é a casa do "falta pagar"**: cartão do mês com setas e a agenda. Contas fixas virou só cadastro. **Metas do mês** ganhou tela própria.
- **Dinheiro em 4 abas**: Contas, Dívidas, Bens e Pessoas.
- **Relatórios sem repetição**: só "para onde foi", "de onde veio" e evolução.
- **Ajustes em 3 grupos**: Aparência, Dados e Ajuda (com "Como ler a balança").
- Cada tela abre com uma frase que diz para que serve. O botão "Usar o dinheiro guardado" passou para a tela Caixinhas.
- Novo teste do mapa (17); testes antigos ajustados aos novos lugares (490 verificações em 17 arquivos).

## [1.1.0-beta.1]: 6 de novembro de 2026 · primeira versão para testadores
- **Desfazer ao apagar**: ao apagar anotação, conta, bem, pessoa, conta fixa, caixinha ou categoria aparece o botão **Desfazer** por 8 segundos, e tudo volta como estava.
- **Lembrete de cópia mais cedo**: aparece no Início com 3 anotações e depois de 7 dias sem cópia (antes: 5 anotações e 30 dias).
- **Selo "beta"** na capa e novo cartão **"Ajude a melhorar"** em Ajustes: um toque abre o compartilhar do celular com um texto pronto (versão e aparelho) para a pessoa contar um problema ou ideia.
- **Caixinhas como no banco**: o dinheiro guardado continua na conta e continua sendo seu (o total não muda); só sai de "Dinheiro para usar agora". Em todas as telas a palavra "livre" virou "para usar" e os textos explicam isso.
- Novo teste de desfazer (476 verificações no total).

## [1.0.0]: 6 de novembro de 2026 · primeira versão completa e estável
Consolida tudo o que foi construído (marcos abaixo) e organiza o projeto:
- **Projeto organizado**: app em `app/`, testes em `tests/` (agora dentro do repositório), ferramentas em `tools/`, documentação em `docs/`, regras em `CLAUDE.md`.
- **Publicação automática com testes**: o GitHub só publica se todos os testes passarem.
- **Versão visível** em Ajustes ("Caderneta · versão 1.0.0") e dentro do arquivo de cópia dos dados.
- **Novo teste de segurança**: textos maliciosos em nomes e backups não conseguem injetar nada em nenhuma tela.
- Medição de desempenho (até 10.000 anotações) e de espaço de armazenamento registradas na avaliação.
- Sem mudança de comportamento para quem já usa o app. Os dados continuam compatíveis.

## Marcos de desenvolvimento (antes da 1.0.0)

**Marco 16 · Anotações com busca e filtros.** Tela de Anotações com busca, ordem por data, valor ou nome, filtros por tipo, período, conta e categoria, e "mostrar mais" de 15 em 15. A mesma lista aparece em Relatórios.

**Marco 15 · Cofres, setas de mês e conta do guardado.** Caixinhas aparecem no Início como cofres animados (moeda caindo, brilho). O cartão "O que pagar" ganha setas para ver os meses seguintes. Ao guardar numa caixinha, escolhe-se de qual conta sai o dinheiro; ao tirar, de qual conta liberar.

**Marco 14 · Guardado sai do "dinheiro que eu tenho".** O dinheiro guardado nas caixinhas deixa de contar como dinheiro livre (moedas roxas na balança) e volta ao tirar, com botão rápido no Início.

**Marco 13 · Caixinhas só com dinheiro real.** Caixinhas passam a olhar só o dinheiro que existe nas contas (sem dívidas) e saem da contabilidade. Corrigido: tela Planejar não abria com dívida sem data.

**Marco 12 · Quanto falta pagar no mês.** Cartão com o total do mês (cartão, contas fixas, dívidas com pessoas), já pago e lista, no Início, em Planejar e em Relatórios.

**Marco 11 · Bens sempre visíveis.** Bens sem valor ou vendidos continuam na lista para ajustar ou apagar.

**Marco 10 · Palavras comuns.** "Gaveta" vira "conta"; "Mudei de lugar" vira "Transferi entre contas"; "projeção" vira "previsão"; e outros. Apagar conta com anotações passa a ser permitido (com aviso).

**Marco 9 · Apagar bem e pessoa com anotações.**

**Marco 8 · Bem que ainda estou pagando.** Cadastro do saldo e das parcelas cria o bem e a dívida juntos.

**Marco 7 · Juros ao pagar dívida.** Só os juros viram gasto; o resto abate a dívida.

**Marco 6 · Meus bens.** Carro, casa, TV: compra de bem não reduz o "é meu"; valorização e desvalorização; venda com ganho ou perda; balança com moedas azuis.

**Marco 5 · Balança explicada.** Legenda e "Como ler a balança" corrigidos: o app conta dinheiro e bens, não objetos consumidos.

**Marco 4 · Planejamento.** Pessoas (emprestei / devo), contas fixas, caixinhas e metas, simulador "e se eu comprar", balança viva de latão, frases de autores reais na capa, gráfico com previsão de 6 meses, "R$" em todos os campos de valor, botão Salvar no fim do formulário.

**Marco 3 · Visual "livro-razão vivo".** Capa verde de livro-caixa, tela Anotar em duas colunas com fio dourado e carimbo, números que rolam, página virando nos relatórios, tema escuro "lamparina", opção "Movimento: Vivo ou Parado".

**Marco 2 · Dívida por vencimento.** Informar "190 vence este mês e 15 no próximo" em vez de um valor único.

**Marco 1 · Primeira versão.** Primeiros passos, anotar gasto/ganho/transferência, contas e cartão com fatura e parcelas, contas a pagar, relatórios, cópia dos dados, instalável e sem internet.

[1.0.0]: https://github.com/grluans09-source/caderneta/tree/v1.0.0
