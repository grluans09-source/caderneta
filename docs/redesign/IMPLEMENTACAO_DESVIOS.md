# Redesign: desvios do relatório

> Toda decisão que se afastou do relatório (ou que precisou interpretar um trecho ambíguo) fica aqui, com o motivo.
> Formato pedido pelo prompt: ID do item, trecho ambíguo, opção escolhida, motivo.

| # | Fase | ID | Trecho do relatório / prompt | O que foi feito | Motivo |
|---|---|---|---|---|---|
| 1 | A | MM-04 | A tabela de movimento do celular vai de MM-03 para MM-05 | Registrado como "item inexistente" | Não há o que implementar; evita alguém procurar um MM-04 perdido |
| 2 | A | Fase A, item 3 | "Capture telas 'antes' ... de todas as telas do inventário" | 25 telas em JPEG (qualidade 60); no celular, página inteira até 4.200 px; no computador, só o que se vê sem rolar | Manter o repositório leve (2,7 MB as 50 fotos). A página inteira do computador repete o layout de celular (DF-01) e não acrescenta informação |
| 3 | A | Fase A, item 2 | "golden master" com data fixa | Ids que o app sorteia (rendimentos, ajustes de bens) são comparados por tipo, data e valor; empates são postos em ordem fixa | Sem isso a comparação falharia de forma aleatória sem nenhum valor ter mudado |
| 4 | B | R-04 / MM-14 | "FIFO, 1 visível, 4 s (8 s com ação)" | Um visível; o aviso novo entra na hora; "Desfazer" nunca é cortado antes de 3 s (quem chega espera na fila) | FIFO estrito atrasaria em até 4 s a resposta de erro do Salvar ("Diga quanto foi"); é a opção mais próxima do comportamento atual |
| 5 | B | R-04 | Balão também em "meta atingida e alerta crítico" | Só no primeiro acesso (o alerta de conta atrasada já tem o aviso próprio) | O mascote vai para o cabeçalho na fase D; os outros momentos entram lá |
| 6 | B | D1 / R-06 | "≥ 30 dias de anotações ou ≥ 1 valor de referência" | 30 dias da primeira anotação até hoje, ou a renda do mês informada em Ajustes | O "valor de referência" mais claro do app é a renda; atenção e alerta continuam aparecendo sempre |
| 7 | B | R-06 | Ordenar cartões por gravidade e agrupar os sem dados | Ficou para a fase E (telas) | A fase B pede só a regra do panorama |
| 8 | B | Formulário semântico | "<form> com submit: Enter salva" | Enter num campo aciona o Salvar (folha) ou o único botão principal da janela; sem <form> | Com <form>, todos os botões virariam "enviar" e o Enter fecharia a folha pelo botão Voltar |
| 9 | B | R-12 | "Foco no título" na folha de anotar | Foco no título; o foco automático no valor (MF-08) fica para a fase E | Segue a ordem das fases |
| 10 | C | Fase C, componentes | "ícones de traço 2 px em grade de 24 px" | Fica para a fase D | Os ícones da barra de baixo são trocados na fase D (barra nova com 5 destinos); redesenhar agora seria desenhar duas vezes, o motivo que o próprio prompt dá para a ordem das fases |
| 11 | C | Fase C, aceite | "nenhum valor hexadecimal solto nos componentes" | Cumprido no estilo (CSS). As cores dentro dos desenhos feitos no JavaScript (gráficos, balança, Brasão, mascotes) continuam no código | Gráficos são refeitos na fase E (R-15, MM-11); balança e mascotes são ilustrações, não componentes |
| 12 | C | Escala tipográfica | H1 28/32 | No cabeçalho preto das telas, o título usa o tamanho H2 (20/26); H1 28/32 vale para os títulos no conteúdo e nos primeiros passos | Com 28 px o título do cabeçalho quebrava em duas linhas ao lado do texto da esquerda; o cabeçalho muda na fase D |
| 13 | C | R-13 | "latão só para marca, valor, conquistas, item ativo" | O fio dourado sob os títulos de seção (h2) continua | É detalhe de marca (não indica clique); os sinais de clique (setas ›, contornos) passaram para neutro e tinta |
| 14 | D | R-01 | "Tocar em Anotar abre a folha já com Gastei; toque longo abre os 4 tipos" | Tocar em Anotar abre as 4 medalhas, como hoje | É o comportamento atual (D43/D61, aprovado pelo dono). Abrir direto em Gastei depende da folha de uma etapa com o seletor de tipo (R-03, fase E); sem ela, Recebi e Transferi ficariam a 3 toques |
| 15 | D | R-01 | Menu dos 4 tipos | Na barra, as 4 medalhas ficam numa fileira acima do Anotar (antes, arco no canto) | Com o Anotar no centro, o arco cortava o nome "Gastei" na borda em 390 px e cobria os nomes em 320 px com letra Enorme |
| 16 | D | R-02 | "Precisa de você": vencimentos ≤ 7 dias, limite, cópia por último | Mantido o limite de 3 avisos (D64) e a ordem: atrasadas, próximo vencimento, limite, lembrete de conferir (D6), outros vencimentos, cópia | O limite de 3 é decisão do dono (D64); o lembrete de conferir é preservado por D6 |
| 17 | D | R-02 | Valor herói "chip de variação ▲/▼" | Variação do "é meu de verdade" desde o fim do mês passado (a mesma conta do indicador Patrimônio) | É o número que o app já calcula; não inventa uma regra nova |
| 18 | D | PF-04 | "Faixa discreta no fim da Início (opcional em Ajustes)" | A frase fica no rodapé do Início; não foi criada a opção de desligar em Ajustes | Criar uma opção nova seria função nova; pode entrar se o dono pedir |
