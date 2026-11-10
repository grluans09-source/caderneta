# Matriz de preservação verificada

> Pedido do prompt de redesign: cada função de antes (PF-01 a PF-50 do celular, PD-01 a PD-34 do computador) com **onde ficou**, **como foi testada** e o **resultado**.
> Teste automático: `tests/38-matriz-preservacao.test.js` (roda em `npm test`, com a massa de teste e o relógio parado em 9/11/2026). Cada linha abaixo é uma verificação dele.
> Situação em 1.30.0-beta.1: **50 de 50 funções do celular preservadas** e **34 de 34 funções do computador preservadas** (PD-01 a PD-34). A apresentação nova do computador está pronta nas telas da fase G; o que é teclado e tabela entra na fase H (coluna "Apresentação").

## Celular (Relatório 01, seção 28)
| ID | Função | Onde ficou (desde a 1.27.0) | Como foi testada | Resultado |
|---|---|---|---|---|
| PF-01 | Abertura animada | Só no 1º uso e ao atualizar, 1,2 s | Estático: regra e duração no código (testes 36 e 38) | ✅ |
| PF-02 | Primeiros passos: carteira, banco, guardado, como rende | Iguais (etapa 2) | Abre o app vazio e confere os campos | ✅ |
| PF-03 | Primeiros passos: cartão | Iguais (etapa 3) | Liga "tenho cartão" e confere os campos | ✅ |
| PF-04 | Frase do dia (troca ao tocar) | Rodapé do Início | Acha e toca na frase | ✅ |
| PF-05 | Dica de instalar | Fim do Início, depois da 1ª anotação; Ajustes > Ajuda | Testes 22 e 38 | ✅ |
| PF-06 | É meu de verdade | Cartão do topo do Início | Confere R$ 26.376,75 com a massa | ✅ |
| PF-07 | Composição (para usar, guardado, bens, devo) | Barra Tenho × Devo + legenda no cartão do topo | Confere a barra e os 4 itens | ✅ |
| PF-08 | Balança ilustrada e "Como ler" | Início > "Como ler?" (janela) | Abre e confere a balança e a legenda | ✅ |
| PF-09 | Entrou / Saiu / Sobrou | Cartão do mês no Início | Confere as 3 colunas | ✅ |
| PF-10 | Falta pagar + vencimentos | "Precisa de você" no Início | Confere a linha (R$ 5.232,10) e o aviso | ✅ |
| PF-11 | Alerta de limite | "Precisa de você" (prioridade alta) | Massa com limite de R$ 500: "ultrapassado" | ✅ |
| PF-12 | Lembrete de cópia | "Precisa de você" (por último) + Ajustes | Texto no código e botão em Ajustes | ✅ |
| PF-13 | Hoje no Brasil | Início, recolhível | Acha a seção | ✅ |
| PF-14 | Seus objetivos | Início, recolhível | Acha a seção | ✅ |
| PF-15 | Últimas anotações + Ver todas | Início + Dinheiro > Todas as anotações | Confere as 3 e os dois atalhos | ✅ |
| PF-16 | Anotar: 4 tipos | Anotar no centro da barra: tocar = Gastei; os 4 tipos no seletor do topo da folha e segurando o Anotar | Abre e confere o seletor e as 4 medalhas | ✅ |
| PF-17 | Busca e favoritas | Folha de uma etapa (contas em carrossel, categorias em grade) | Confere as 2 buscas e as favoritas | ✅ |
| PF-18 | + Nova categoria · + Novo bem | Folha de anotar (igual) | Confere os dois | ✅ |
| PF-19 | Quando: Hoje / Ontem / Outro dia | Folha de anotar (igual) | Confere os botões | ✅ |
| PF-20 | Anotação e caixinha opcionais | "Mais detalhes" da folha | Confere os campos | ✅ |
| PF-21 | Resumo em linguagem comum | Folha (resumo completo) + barra do Salvar (resumo curto) | Confere o resumo | ✅ |
| PF-22 | Juros ou multa ao pagar | Dinheiro > Dívidas > Pagar (folha "Pagar <conta>") | Abre o pagamento e confere o campo | ✅ |
| PF-23 | Editar, apagar, Desfazer | Tocar na anotação (igual) | Abre e confere Apagar e Salvar | ✅ |
| PF-24 | Carteira com cédulas | Dinheiro > Contas > Dinheiro | Abre a carteira | ✅ |
| PF-25 | Conta: editar, conferir, apagar | Dinheiro > Contas > a conta | Confere as 3 ações | ✅ |
| PF-26 | + Nova conta | Dinheiro > Contas | Confere o botão | ✅ |
| PF-27 | Dívidas: limite, disponível, pagar | Dinheiro > Dívidas | Confere barra, Disponível e Pagar | ✅ |
| PF-28 | Nova dívida | Dinheiro > Dívidas | Confere o botão | ✅ |
| PF-29 | Bens: atualizar, vendi, apagar | Dinheiro > Bens | Abre o bem e confere as 3 ações | ✅ |
| PF-30 | Pessoas | Dinheiro > Pessoas | Confere nova pessoa e a lista | ✅ |
| PF-31 | Investimentos: resumo | Dinheiro > Investimentos | Confere o resumo e a barra marcando Dinheiro | ✅ |
| PF-32 | Aplicação: aplicar, resgatar, conferir, editar, apagar | Dinheiro > Investimentos > a aplicação | Confere as 5 ações | ✅ |
| PF-33 | Nova aplicação: 5 jeitos de render | Dinheiro > Investimentos > + Nova | Confere os 5 jeitos | ✅ |
| PF-34 | Acerto de contas | Planejar, em linha (sem janela) | Confere os meses e as ações | ✅ |
| PF-35 | Agenda: Pagar, Paguei, Pular, Ver todas | Planejar (igual) | Confere as ações | ✅ |
| PF-36 | Metas do mês | Planejar > Metas (estados da fase B) | Confere os 3 potes | ✅ |
| PF-37 | Caixinhas | Planejar > Caixinhas (igual) | Confere guardar/tirar e abrir | ✅ |
| PF-38 | Contas fixas | Planejar > Contas fixas (conta e categoria por botões) | Confere nova e a existente | ✅ |
| PF-39 | Simulador | Planejar > Simulador (igual) | Confere a tela | ✅ |
| PF-40 | Panorama + 10 indicadores | Saúde (contadores da fase B) | Confere o panorama e os 10 cartões | ✅ |
| PF-41 | Relatório + Compartilhar | Saúde > Ler o relatório | Abre e confere Compartilhar | ✅ |
| PF-42 | Mês a mês · Relatórios em lista | Saúde (igual) | Confere os dois | ✅ |
| PF-43 | Anotações: ordenar e filtrar | Dinheiro > Todas as anotações | Confere busca, ordem e filtros | ✅ |
| PF-44 | Notícias | Início > Hoje no Brasil > Ver todas | Abre e confere a barra marcando Início | ✅ |
| PF-45 | Ajustes: letra, cores, movimento, modo contador | Engrenagem no alto de toda tela | Abre do Planejar e confere os 4 | ✅ |
| PF-46 | Categorias | Ajustes (igual) | Confere + Nova categoria | ✅ |
| PF-47 | Seus dados | Ajustes (igual) | Confere guardar, recuperar, apagar | ✅ |
| PF-48 | Ajuda | Ajustes (igual) | Confere Como ler e Contar um problema | ✅ |
| PF-49 | Perguntar | Rostinho no alto de toda tela | Confere nas 4 abas e abre o chat | ✅ |
| PF-50 | Lembrete semanal de conferir (D6) | "Precisa de você" no Início (igual) | Confere o texto com a massa | ✅ |

## Computador (Relatório 02, PD-01 a PD-34)
Situação na fase G (1.30.0): todas as funções continuam no computador. "Apresentação" diz se a arrumação nova do relatório já está pronta; o que falta é teclado, mouse e tabelas (fase H).

| ID | Função | Onde ficou (computador) | Como foi testada | Apresentação |
|---|---|---|---|---|
| PD-01 | Abertura animada | Só no 1º uso e quando o app atualiza (fase B, igual no computador) | teste 36 | Feita |
| PD-02 | Primeiros passos | Coluna centralizada, as mesmas 3 etapas | teste 36 e foto 25 | Feita (desvio 36) |
| PD-03 | Frase do dia | Rodapé do Início, largura toda | teste 38 (PF-04) e teste 41 | Feita |
| PD-04 | Dica de instalar | "Instalar no computador", no fim do Início, só depois da 1ª anotação | teste 36 | Feita |
| PD-05 | É meu de verdade + composição | Coluna esquerda do Início, no alto | teste 41 e conferir-computador | Feita |
| PD-06 | Como ler a balança | Janela no centro (até 560 px) | teste 38 e foto 18 | Feita |
| PD-07 | Entrou / Saiu / Sobrou; quanto dá por dia | Cartão do mês, coluna direita do Início | teste 41 | Feita |
| PD-08 | Falta pagar, vencimentos, limite | "Precisa de você", coluna direita do Início | teste 41 e conferir-computador | Feita |
| PD-09 | Lembrete de cópia | "Precisa de você" + rodapé da barra lateral ("Cópia: dd/mm") | teste 41 | Feita |
| PD-10 | Hoje no Brasil / Notícias | Cartão no Início + atalho na barra lateral | teste 41 | Feita |
| PD-11 | Seus objetivos | Coluna direita do Início (seção que abre) | teste 38 | Feita |
| PD-12 | Últimas anotações | 5 linhas, coluna esquerda do Início | teste 41 | Feita (tabela na H) |
| PD-13 | Anotar (4 tipos, busca, favoritas, nova categoria, novo bem, datas, anotação, caixinha, resumo) | Painel de 460 px à direita | testes 39 e 41, conferir-computador | Feita (teclas 1–4 e Enter na H) |
| PD-14 | Arredondamento do dinheiro vivo | No painel, igual ao celular | teste 39 | Feita |
| PD-15 | Pagar fatura (juros/multa) | No painel ("Pagar <conta>") | teste 39 | Feita |
| PD-16 | Editar · Apagar · Desfazer | Painel; Apagar com janela; Desfazer no aviso | testes 36 e 39 | Feita |
| PD-17 | Contas, cédulas, conferir, editar, apagar | Dinheiro > Contas: lista + detalhe com extrato; Editar no detalhe | teste 41 | Feita |
| PD-18 | Dívidas (limite, disponível, pagar) | Dinheiro > Dívidas: lista + detalhe | teste 41 | Feita |
| PD-19 | Bens (valorização, atualizar, vendi) | Dinheiro > Bens: lista (como no celular) | teste 38 | Feita (desvio 31) |
| PD-20 | Pessoas (emprestei / peguei) | Dinheiro > Pessoas: lista (como no celular) | teste 38 | Feita (desvio 31) |
| PD-21 | Investimentos | Dinheiro > Investimentos (como no celular) | teste 38 | Feita (desvio 31) |
| PD-22 | Acerto de contas do mês | Coluna principal do Planejar (7/12), em linha | teste 41 | Feita |
| PD-23 | Agenda | Mesma coluna, embaixo do acerto | teste 41 | Feita (hover na H) |
| PD-24 | Metas do mês | Coluna lateral do Planejar + tela própria | teste 41 | Feita |
| PD-25 | Caixinhas | Coluna lateral + tela própria | teste 41 | Feita |
| PD-26 | Contas fixas | Coluna lateral + tela própria | teste 41 | Feita |
| PD-27 | Simulador | Coluna lateral + tela própria (coluna única) | teste 38 | Feita (desvio 36) |
| PD-28 | Panorama + 10 indicadores | Faixa de panorama + grade de 2 a 4 colunas | teste 41 e conferir-computador | Feita |
| PD-29 | Relatório + compartilhar | Coluna de leitura de 720 px | teste 41 | Feita |
| PD-30 | Mês a mês · Relatórios em lista | Embaixo da grade da Saúde | teste 41 | Feita (tabela na H) |
| PD-31 | Anotações (busca, ordenar, filtrar) | Atalho na barra lateral; lista como no celular | teste 41 | Feita (tabela e "/" na H) |
| PD-32 | Ajustes | Atalho no rodapé da barra lateral; coluna única | teste 41 | Feita (desvio 36) |
| PD-33 | Perguntar | Rodapé da barra lateral; janela no centro | teste 41 | Feita (desvio 35) |
| PD-34 | Lembrete semanal de conferir | "Precisa de você" (igual) | teste 38 (PF-50) | Feita |
