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

**D29 · Hospedagem hoje: GitHub Pages (repositório público). Plano: Netlify + repositório privado (A, "por enquanto só organizar").** Por quê: Pages gratuito exige repositório público. Consequência: a troca muda o endereço e **os dados não acompanham**; exige aviso e cópia (ver `PUBLICACAO.md`).

**D30 · Frases da capa só de autores reais, atribuição conferida (A).** Consequência: texto é tradução livre; ao incluir novas, conferir a fonte.

## Venda e hospedagem (6 nov 2026)

**D31 · Modelo de venda: pagamento único (A).** Por quê: combina com um app sem servidor e sem login. Consequência: o app não sabe "quem pagou"; o link pode ser repassado. A defesa é suporte, atualizações e marca. Chave de licença com servidor mínimo só se o uso real pedir. Assinatura exigiria servidor.

**D32 · Fase de teste 100% gratuita, no endereço atual do GitHub Pages (A).** Por quê: o dono quer que as pessoas já usem, sem custo. Consequência: o GitHub Pages não deve ser usado para vender; migrar **antes** da primeira venda. Os testadores farão uma troca de endereço guardando e recuperando a cópia.

**D33 · Hospedagem definitiva recomendada: Cloudflare Pages (C, aguarda confirmação do dono).** Por quê: tráfego ilimitado no plano gratuito, uso comercial permitido segundo as fontes, aceita repositório privado e tem caminho para um servidor mínimo. O plano gratuito do Netlify funciona por créditos e pausa o site se acabarem. Consequência: conta no Cloudflare (feita pelo dono), pasta de publicação `app`, arquivo `app/_headers`. Confirmar os termos nos sites oficiais antes de contratar.

**D34 · Domínio próprio antes da primeira venda (C, recomendação pendente).** Por quê: os dados dos usuários pertencem ao endereço; o domínio impede que uma troca de hospedagem faça alguém perder dados. Custo: cerca de R$ 40 a R$ 60 por ano.

**D35 · Beta para testadores: desfazer, lembrete de cópia a cada 7 dias, selo beta e feedback por compartilhar (A).** Por quê: proteger dados antes de pessoas reais usarem. Feedback sem servidor: o botão abre o compartilhar do celular com texto pronto. Consequência: "Apagar tudo e recomeçar" ainda não tem desfazer.

**D36 · Caixinhas funcionam como a caixinha de um banco (A).** O guardado continua sendo dinheiro da pessoa, na mesma conta; só deixa de estar "para usar agora". Substitui o texto do Marco 14 ("guardado sai do que eu tenho"). O motor não mudou (o total já incluía o guardado); mudaram os nomes e as explicações. "Livre" virou "para usar".

**D37 · Reorganização por lugar único (A).** Decisões Q1 a Q7 da auditoria aceitas: Início enxuto com uma linha "Falta pagar"; Planejar é a casa do que vence; Dinheiro em 4 abas; Metas em tela própria; Relatórios sem repetir; Ajustes em 3 grupos. Mapa em `docs/MAPA-DO-APP.md`.

**D38 · Três jeitos de usar para o app inteiro: Balança, Razão e Cofre e fluxo (A).** O visual antigo deixa de ser uma opção separada (a Balança o continua). Cada jeito muda o visual e a distribuição das telas; dados e regras são os mesmos. Entrega por etapas (J1 a J7 em `docs/JEITOS-DE-USAR.md`); J1 (base e Início), J2 (Planejar) e J3 (Dinheiro) e J4 (Anotar) e J5 (Mais, Anotações, Relatórios, Ajustes) e J6 (escolha nos Primeiros passos) e J7 (conferência final) feitas.

**D39 · Os jeitos Razão e Cofre e fluxo foram apagados; fica só a Balança (A).** O dono pediu para tirar as duas interfaces extras e manter a padrão. Substitui a D38. Consequência: sem escolha de jeito em Ajustes nem nos Primeiros passos (voltaram a 3 passos); a reorganização por lugar único (D37) continua valendo. Quem tinha escolhido outro jeito volta sozinho para a Balança.

**D40 · Paleta "azul-noite, marfim e ouro" e regra de uma cor, um significado (A).** Por quê: o verde servia ao mesmo tempo para botão, "selecionado", dinheiro e transferência, e confundia. Agora: azul safira = entrou/para usar; bordô = saiu/dívida; ametista = guardado; cobre = bens; ouro = é meu de verdade e também selecionado (sempre com fundo claro e borda); azul-noite = capa e botões principais. Consequência: o verde não deve voltar ao app.
