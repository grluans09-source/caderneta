# Matriz de preservação verificada

> Pedido do prompt de redesign: cada função de antes (PF-01 a PF-50 do celular, PD-01 a PD-34 do computador) com **onde ficou**, **como foi testada** e o **resultado**.
> Teste automático: `tests/38-matriz-preservacao.test.js` (roda em `npm test`, com a massa de teste e o relógio parado em 9/11/2026). Cada linha abaixo é uma verificação dele.
> Situação em 1.27.0-beta.1: **50 de 50 funções do celular preservadas**. PD-01 a PD-34 (computador) entram nas fases G e H.

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
| PF-16 | Anotar: 4 tipos | Anotar no centro da barra | Abre e confere os 4 tipos | ✅ |
| PF-17 | Busca e favoritas | Folha de anotar (igual) | Confere as 2 buscas e as favoritas | ✅ |
| PF-18 | + Nova categoria · + Novo bem | Folha de anotar (igual) | Confere os dois | ✅ |
| PF-19 | Quando: Hoje / Ontem / Outro dia | Folha de anotar (igual) | Confere os botões | ✅ |
| PF-20 | Anotação e caixinha opcionais | "Mais detalhes" da folha | Confere os campos | ✅ |
| PF-21 | Resumo em linguagem comum | Folha de anotar (igual) | Confere o resumo | ✅ |
| PF-22 | Juros ou multa ao pagar | Dinheiro > Dívidas > Pagar | Abre o pagamento e confere o campo | ✅ |
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
| PF-34 | Acerto de contas | Planejar (igual) | Abre e confere os meses | ✅ |
| PF-35 | Agenda: Pagar, Paguei, Pular, Ver todas | Planejar (igual) | Confere as ações | ✅ |
| PF-36 | Metas do mês | Planejar > Metas (estados da fase B) | Confere os 3 potes | ✅ |
| PF-37 | Caixinhas | Planejar > Caixinhas (igual) | Confere guardar/tirar e abrir | ✅ |
| PF-38 | Contas fixas | Planejar > Contas fixas (igual) | Confere nova e a existente | ✅ |
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
A fazer nas fases G e H (layout de computador, mouse e teclado). Até lá, o computador usa as mesmas telas do celular, e tudo da tabela acima vale para ele.
