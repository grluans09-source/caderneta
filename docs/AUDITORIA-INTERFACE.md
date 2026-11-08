# Auditoria de interface (8 nov 2026)

> **Feita.** A etapa 1 (este levantamento, na 1.22.0) foi aprovada pelo dono com as 4 recomendações, e a etapa 2 entrou na **versão 1.23.0** (D63, D64). O resultado está na última seção. O app de hoje está descrito em `MAPA-DO-APP.md`.

> Pedido do dono: simplificar a interface para quem começa do zero, **sem perder nenhuma função, campo ou informação** (pode reorganizar, agrupar, esconder em camadas e mudar de lugar). Esta é a **etapa 1: só levantamento, nenhum código mudou**. A etapa 2 só começa depois da aprovação.

## Como foi feito
- Cada tela, aba e janela foi aberta com dados de exemplo completos (banco, carteira, cartão, empréstimo, pessoas, bem, aplicações, caixinhas, metas, contas fixas, notícias) e também **vazia** (primeiro uso).
- Medido por tela: altura (em "telas de celular" de 375×812), cartões, botões e campos visíveis.
- Comparados nomes, botões, formatos e valores entre abas. **Os valores batem entre as abas** (Falta pagar no Início = Planejar; Para usar agora em Dinheiro = legenda da balança; Guardado e investido nos Gráficos = aplicações + caixinhas).

## Tamanho de cada tela hoje (celular)
| Tela | Altura | Botões | Observação |
|---|---|---|---|
| Início | **3,9 telas** | 21 | balança, resumo, mês que fechou, falta pagar, até 5 avisos, Hoje no Brasil, caixinhas, metas, últimas anotações |
| Gráficos | **5,4 telas** | 12 | mês a mês + 10 indicadores, todos abertos |
| Notícias | **5,1 telas** | 8 | 7 notícias com 4 blocos de texto cada |
| Ajustes | **2,9 telas** | 23 | tudo aberto, inclusive a lista de categorias |
| Caixinhas | 2,0 telas | 13 | explicação longa + conta por conta + sugestão + caixinhas |
| Planejar | 1,9 tela | 12 | ok |
| Relatórios | 1,9 tela | 10 | repete os 10 indicadores dos Gráficos |
| Investir | 1,5 tela | 9 | 4 botões por aplicação |
| Dinheiro, Mais, Metas, Fixas, Simulador, Anotações | 1 a 1,3 | — | ok |
| Folha de anotar (Gastei) | — | 20 | 4 campos + caixinha opcional à vista |
| Janela da conta fixa | — | — | 7 campos à vista (2 opcionais) |

## Relatório (aba por aba)

Gravidade: **alta** = confunde ou leva a erro; **média** = atrapalha; **baixa** = acabamento.

| Aba | Funcionalidade | Problema | Gravidade | Proposta |
|---|---|---|---|---|
| Geral | Palavra "conta" | Quer dizer duas coisas: **lugar do dinheiro** (banco, carteira) e **boleto a pagar** ("27 contas", "Contas fixas", "Acerto de contas"). Para quem começa, "Nova conta" e "Falta pagar 27 contas" parecem a mesma coisa | **alta** | Ajustar: onde for boleto, dizer "conta a pagar" / "pagamentos" nos textos soltos (os nomes "Contas fixas" e "Acerto de contas" ficam). **Pede decisão** |
| Geral | Aba "Dinheiro" × conta "Dinheiro" | A aba Dinheiro tem dentro a conta Dinheiro (carteira) | média | Ajustar: dentro da aba, a carteira aparece como "Dinheiro vivo (carteira)". Nome da aba fica |
| Geral | "Patrimônio" × "É meu de verdade" | Gráficos pergunta "Meu patrimônio está crescendo?"; o resto do app diz "é meu de verdade" | média | Ajustar o texto para "O que é meu está crescendo?" (patrimônio vira explicação "?") |
| Geral | Botões das janelas | Mesma ação com nomes diferentes: "Apagar", "Apagar conta", "Apagar conta fixa"; "Cancelar" numa janela, "Fechar" em outra; pessoa tem "Salvar nome e data" | média | Ajustar: padrão único — **Salvar** (principal, em cima), **Cancelar**, e **Apagar** sempre por último, com o nome da coisa |
| Geral | Formatos | Resumo do mês sem "R$" (+11,57); datas em 4 jeitos (08nov, 13/07, 13/07/2026, 15fev) | baixa | Ajustar: valor sempre com R$; listas "08 nov", datas completas dd/mm/aaaa |
| Geral | Balão do Perguntar | Aparece a cada troca de aba e cobre o conteúdo de baixo | média | Esconder em camada: o balão só na **primeira visita** de cada aba no dia; a carinha continua reagindo |
| Geral | Termos sem explicação | CDI, Selic, IPCA, Focus, "% do CDI", "ao ano", DRE, ativo/passivo (Modo contador), patrimônio, "Movimento" | média | Ajustar: botão **"?"** ao lado do termo com uma frase |
| Início | Tela inteira | 3,9 telas e até 21 botões; a pessoa não sabe onde olhar | **alta** | Ajustar para no máximo ~2 telas (ver mapa abaixo) |
| Início | Avisos | Mostra até 5 avisos (o mapa do app diz no máximo 3). Conta atrasada aparece **3 vezes**: na linha "Falta pagar", em um aviso por conta e no Pesão | **alta** | Ajustar: atrasadas viram **um aviso só** ("4 contas atrasadas, R$ X › Resolver"); no máximo 3 avisos |
| Início | "Outubro fechou" (dias 1 a 10) | Cartão grande no meio da tela, repetindo o Mês a mês dos Gráficos | média | Esconder em camada: vira uma linha "Outubro fechou: sobrou R$ X › Ver" |
| Início | Hoje no Brasil | 3 notícias com "Para você" na tela inicial | média | Esconder em camada: uma linha resumida ("Dólar R$ 5,40 · Inflação 0,09% ›") |
| Início | Caixinhas e metas | Dois blocos de potes | baixa | Agrupar em "Seus objetivos" recolhível |
| Anotar | Folha Gastei | "Anotação" e "Pagar com o dinheiro de uma caixinha?" ficam à vista (opcionais) | média | Esconder em "Mais detalhes" (abre sozinho se a pessoa já usou) |
| Dinheiro | Conferir com o banco | Na aba Investir é botão à vista; nas contas de banco só aparece dentro de "Editar" | média | Ajustar: o mesmo lugar nos dois — ao tocar numa conta ou aplicação abre a janela dela com **Conferir com o banco** no topo |
| Dinheiro | Botão de criar | "+ Nova conta" (aba Contas) e "+ Nova conta ou dívida" (aba Dívidas) abrem a mesma janela | baixa | Ajustar: "+ Nova conta" e "+ Nova dívida", já com o tipo escolhido |
| Dinheiro | Explicação do topo | Frase longa repetida em todas as 4 sub-abas | baixa | Esconder em "?" |
| Dinheiro | Janela do cartão | Lista "o que você já devia antes do app" com vencimentos sempre aberta | média | Esconder em "Mais detalhes" quando o cartão já tem anotações |
| Dinheiro | Pessoas | Janela com 5 ações + campos de editar juntos | baixa | Ajustar: ações em cima (Recebi, Emprestei mais), editar e apagar em "Mais opções" |
| Investir | Cada aplicação | 4 botões por aplicação (Aplicar, Resgatar, Conferir, Editar) | média | Esconder em camada: o cartão mostra valor e rendimento; tocar abre a janela com as 4 ações |
| Investir | "Mais opções (apagar)" | Leva à janela genérica de conta, que deixa trocar a aplicação para **"Devo aqui (cartão)"** e mostra campos de cartão (fecha, vence, limite) — caminho errado | **alta** | Ajustar: "Apagar aplicação" dentro da janela da aplicação; a janela genérica não abre para aplicações |
| Investir | Texto do topo | 4 linhas de explicação | baixa | Esconder em "?" |
| Planejar | Agenda | Legenda de cores + rodapé "Data pintada..." sempre à vista | baixa | Esconder em "?" |
| Planejar > Caixinhas | Tela | Explicação longa, saldo conta por conta e sugestão de guardar antes das caixinhas (2 telas) | média | Ajustar ordem: caixinhas primeiro; "Ver por conta" recolhível; explicação em "?" |
| Planejar > Caixinhas | Nome da ação | "Usar o dinheiro guardado (tirar de uma caixinha)" no topo e "Tirar e usar" em cada caixinha: mesma ação, dois nomes | baixa | Ajustar: "Tirar" em todos |
| Planejar > Metas | Janela da meta | "+ Nova meta" abre "Editar categoria"; o texto diz que a meta "vira uma caixinha com pote" (meta não é caixinha) | média | Ajustar: título "Meta do mês" e texto correto ("é um limite de gasto, não guarda dinheiro") |
| Planejar > Contas fixas | Formulário | 7 campos à vista, com listas de seleção (as outras janelas usam botões) | média | Ajustar: só Nome, Valor, Repete, Dia, Conta e Categoria à vista; "Começa em" e "Quantas vezes" em "Mais detalhes" |
| Planejar > Simulador | "Vai pagar com" | Oferece CDB e Poupança como se fossem dinheiro para usar (a regra D58 diz que investido não é) | média | **Pede decisão**: tirar as aplicações ou deixar por último com "(resgatar)" |
| Planejar > Simulador | Campos opcionais | "Total com juros" e "Minha renda" sempre à vista | baixa | Esconder em "Mais detalhes" |
| Gráficos | Tela | 11 gráficos abertos (5,4 telas) | **alta** | Ajustar: no topo só **4**: É meu de verdade, Folga 30 dias, Reserva de emergência, Taxa de poupança; os outros 6 em "Ver mais indicadores" |
| Gráficos × Relatórios | Indicadores | Os mesmos 10 indicadores aparecem nas duas abas | média | **Pede decisão**: juntar numa aba só ("Saúde": gráfico em cima, relatório ao tocar), liberando um lugar na barra (7 → 6 abas). Alternativa: manter as duas |
| Relatórios | Panorama | "De 4 indicadores com dados, 3 saudáveis, 0 atenção e 0 alerta": a conta não fecha (o 4º é "informativo" e não aparece) | média | Ajustar o texto para fechar a conta |
| Notícias | Tela | 7 notícias × 4 blocos (5,1 telas) | média | Esconder em camada: título, selo e "Para você" à vista; fato e "O que isso significa" ao tocar |
| Notícias | Voltar | A seta sempre volta ao Início, mesmo quando a pessoa veio de Mais | baixa | Ajustar: volta para onde veio (como Anotações já faz) |
| Mais > Anotações | Filtros | 9 botões de ordem e filtro sempre à vista | baixa | Esconder em camada: busca à vista; "Ordenar e filtrar" recolhível |
| Mais > Ajustes | Tela | 2,9 telas, tudo aberto, inclusive a lista de categorias (cadastro) | média | Agrupar em seções recolhíveis: Aparência · Categorias · Seus dados · Ajuda |
| Mais > Ajustes | Modo contador | Fala em "ativo, passivo, DRE" sem explicar | baixa | "?" com explicação |
| Primeiros passos | Texto de boas-vindas | "...e **ela** mostra quanto é seu" (sobrou do tempo de "a Caderneta") | baixa | Ajustar para "ele" |
| Planejar > Caixinhas | Guardado maior que a conta | Gastar o dinheiro que está numa caixinha deixa "para usar −R$ 131,48 (separou a mais)" sem aviso na hora de anotar | média | **Pede decisão** (é regra de negócio): avisar "esse dinheiro está guardado na caixinha X" ao anotar, como as outras travas |

## Mapa: onde está hoje → para onde vai
Nada é apagado; tudo continua a no máximo 1 toque de onde está hoje.

| Funcionalidade | Hoje | Vai para |
|---|---|---|
| Atrasadas (um aviso por conta) | Início, um botão por conta | Início, **um aviso só** com o total → abre o acerto de contas |
| "Mês fechou" (dias 1 a 10) | Início, cartão grande | Início, uma linha → abre Mês a mês |
| Hoje no Brasil | Início, cartão com 3 notícias | Início, uma linha → abre Notícias |
| Caixinhas e metas (potes) | Início, dois blocos | Início, "Seus objetivos" recolhível |
| Anotação e caixinha na folha | Folha, à vista | Folha, "Mais detalhes" |
| Conferir com o banco (conta de banco) | Dentro de "Editar conta" | Janela da conta, no topo (igual à aplicação) |
| Aplicar, Resgatar, Conferir, Editar | Investir, 4 botões por aplicação | Janela da aplicação (toque no cartão) |
| Apagar aplicação | Janela genérica de conta | Janela da aplicação |
| Saldo conta por conta das caixinhas | Caixinhas, à vista | Caixinhas, "Ver por conta" |
| Explicações longas (Dinheiro, Investir, Caixinhas, agenda) | Topo das telas | Botão "?" |
| 6 dos 10 indicadores | Gráficos, à vista | Gráficos, "Ver mais indicadores" |
| Fato e significado de cada notícia | Notícias, à vista | Notícias, ao tocar no item |
| Ordenar e filtros de anotações | Anotações, à vista | Anotações, "Ordenar e filtrar" |
| Categorias | Ajustes, lista aberta | Ajustes, seção recolhível "Categorias" |
| Começa em / Quantas vezes (conta fixa) | Janela, à vista | Janela, "Mais detalhes" |
| Total com juros / renda (simulador) | Simulador, à vista | Simulador, "Mais detalhes" |
| Editar e apagar pessoa | Janela da pessoa, junto das ações | Janela da pessoa, "Mais opções" |
| Lista "devia antes do app" (cartão com anotações) | Janela do cartão, à vista | Janela do cartão, "Mais detalhes" |
| (Se aprovado) Relatórios | Aba própria | Dentro de "Saúde", junto dos gráficos |

## Peças reutilizáveis que serão criadas (etapa 2)
- **Seção recolhível** (título + seta; lembra aberta/fechada por aparelho).
- **"?" de explicação** (abre uma frase curta; funciona com toque e leitor de tela).
- **Estado vazio guiado** (título, frase e o botão da primeira ação).
- **"Mais detalhes" nos formulários** (abre sozinho se algum campo opcional já tem valor).

## Ordem da etapa 2 (da aba mais usada para a menos usada)
1. Correções de inconsistência (antes do visual). 2. Início. 3. Folha de anotar. 4. Dinheiro. 5. Planejar e ferramentas. 6. Investir. 7. Gráficos e Relatórios. 8. Notícias. 9. Mais e Ajustes.
Cada aba é conferida no celular e no computador, com teste automático de que tudo continua existindo.

## Resultado da etapa 2 (versão 1.23.0)

**Altura das telas no celular (375×812), antes → depois**: Início 3,9 → 2,4 · Gráficos 5,4 + Relatórios 1,9 → Saúde 2,9 · Notícias 5,1 → 3,9 · Ajustes 2,9 → 1,0 · Caixinhas 2,0 → 1,8 · Investir 1,5 → 1,2. Nada vazando da tela em 14 telas × 3 tamanhos de letra × 2 temas; contas conferidas de novo com dados aleatórios (nenhuma diferença).

**Inconsistências corrigidas**: "conta a pagar" quando é boleto · atrasadas num aviso só e no máximo 3 avisos · aplicação com janela própria (não vira dívida por engano) · "Conferir com o banco" no topo de toda janela de conta · "+ Nova dívida" já como dívida · "patrimônio" → "o que é meu" · botões padronizados (Apagar + nome da coisa, Cancelar) · "Tirar" com um nome só · meta do mês sem "vira caixinha" · panorama que fecha a conta · resumo com R$ · Notícias volta para onde veio · boas-vindas "ele" · simulador com aplicações por último "(resgatar)" · balão do Perguntar uma vez por aba por dia · trava do dinheiro guardado (D63) · ferramentas do Planejar não saem da tela com letra Grande.

**Realocado (de → para)**: Relatórios (aba) → Saúde > "Todos os relatórios em lista" e "Ler o relatório" em cada indicador · Gráficos (aba) → Saúde · Mês a mês (topo dos Gráficos) → Saúde > "Mês a mês" · Aplicar/Resgatar/Conferir/Editar (cartão da aplicação) → janela da aplicação · Apagar aplicação (janela genérica de conta) → janela da aplicação · saldo por conta (topo das Caixinhas) → "Ver por conta" · "Tirar de uma caixinha" e sugestão da sobra (topo das Caixinhas) → depois das caixinhas · Categorias (Ajustes > Dados) → Ajustes > Categorias · Conferir com o banco (meio da janela da conta) → topo.

**Foi para uma camada ("Ver mais", seção que abre ou "Mais detalhes")**: 6 dos 10 indicadores · Mês a mês · "<mês> fechou" · Hoje no Brasil · caixinhas e metas do Início ("Seus objetivos") · fato e significado de cada notícia ("Entenda a notícia") · ordem e filtros das anotações · Aparência, Categorias, Seus dados e Ajuda · anotação e caixinha na folha de anotar · alvo, prazo e rendimento da caixinha · começo e quantas vezes da conta fixa · renda no simulador · nome, data e apagar da pessoa · o que já se devia antes do app (cartão com anotações).

**Termos que ganharam "?"**: conta (Dinheiro) · taxa ao ano e investido (Investir) · "% do CDI" (nova aplicação) · legenda e datas da agenda · caixinha (Caixinhas) · patrimônio e como ler os indicadores (Saúde) · Selic, CDI, IPCA, IPCA por grupo e Focus (Notícias) · Movimento e Modo contador (ativo, passivo, DRE, balancete).

**Telas vazias guiadas**: agenda vazia (botão "Cadastrar uma conta fixa") · anotações sem resultado (botão "Limpar filtros").

**Não mexido de propósito**: cálculos, dados, regras do motor contábil. A única regra nova é a pergunta da D63, aprovada pelo dono.
