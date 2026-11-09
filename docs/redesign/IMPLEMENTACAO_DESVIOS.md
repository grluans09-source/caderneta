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
