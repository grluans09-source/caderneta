# Auditoria: o que é útil e o que é enfeite (passo 2 do plano da beta)

> **Status (7 nov 2026): documento histórico.** É a leitura da versão 1.1.0. As decisões Q1 a Q7 foram aceitas e aplicadas na 1.2.0; **a organização atual está em `MAPA-DO-APP.md`**. As tabelas abaixo descrevem o app *antes* da reorganização.

Feita lendo o código da versão 1.1.0-beta.1 (6 nov 2026). **Não é baseada em uso real**: é a minha leitura do que cada tela mostra. O teste de campo pode mudar os vereditos.

**Critério:** uma função é *útil* se ajuda a pessoa a **decidir** algo ou a **não esquecer** algo. Se só repete um número que já aparece em outro lugar, é enfeite.

**Veredito:** ✅ manter · 🔗 juntar (ficar em um só lugar, nos outros só atalho) · ✂️ tirar da tela principal · ❓ você decide.

## 1. Como o app está hoje (5 abas e 16 telas)

| Aba | O que tem hoje |
|---|---|
| **Início** | Balança + legenda, resumo do mês (entrou/saiu/sobrou), "O que pagar" com setas, avisos, caixinhas, metas, últimas anotações |
| **Anotar** (botão +) | Folha para anotar gasto, ganho, transferência, bem |
| **Dinheiro** | Contas, cartões e dívidas, **bens**, **pessoas** |
| **Planejar** | "O que pagar" (de novo), agenda, atalhos: Caixinhas, Contas fixas, Simulador |
| **Mais** | Atalhos: Anotações, Relatórios, Ajustes |
| Telas internas | Caixinhas (com **metas** dentro), Contas fixas, Simulador, Anotações, Relatórios, Ajustes |

## 2. Repetições encontradas (o mesmo assunto em vários lugares)

| # | Assunto | Onde aparece hoje | Proposta: lugar único | Veredito |
|---|---|---|---|---|
| R1 | **"Quanto falta pagar no mês"** | Início, Planejar, Relatórios (três cartões iguais) | **Planejar** é a casa. O Início mostra só **uma linha** ("Falta pagar este mês: R$ X") que leva ao Planejar. Relatórios tira | 🔗 |
| R2 | **Contas a pagar** (lista) | Relatórios ("Contas a pagar"), Planejar (agenda), avisos do Início | **Planejar > Agenda**. Relatórios tira a lista. O Início mantém só os **avisos urgentes** (atrasado, vence hoje/amanhã) | 🔗 |
| R3 | **Lista de anotações** | Início (últimas 6), Anotações (completa), Relatórios (do mês) | **Anotações** é a casa. Início mostra as últimas 3 com atalho. Relatórios tira a lista | 🔗 |
| R4 | **Resumo do mês** (entrou, saiu, sobrou) | Início e Relatórios | **Início** (rápido). Relatórios mostra o detalhe por categoria, sem repetir os três números | 🔗 |
| R5 | **Caixinhas** | Início (cofres), Planejar (atalho), tela Caixinhas | **Tela Caixinhas** é a casa. O Início mostra os cofres só como vitrine (já tem atalho) | ✅ (já é atalho) |
| R6 | **Dinheiro guardado** | Balança, legenda, tela Dinheiro, tela Caixinhas, botão "Usar o dinheiro guardado" no Início | Casa: tela Caixinhas. A balança e a conta só mostram o número | 🔗 |
| R7 | **Agenda × Contas fixas** | A agenda mistura cartão, fixas e cobranças; Contas fixas tem outra lista "Para pagar agora" | Agenda é a única lista de "o que vence". Contas fixas vira só **cadastro** (as cadastradas) | 🔗 |
| R8 | **Cartão/dívida** | Dinheiro (cartão com próxima fatura, "Pagar"), Planejar/Início (cartão do mês) | **Dinheiro** é a casa do cartão (limite, devo, pagar). O "pagar" na agenda só leva até lá | 🔗 |
| R9 | **Metas do mês** | Início (jarras) e dentro da tela Caixinhas | Metas são **limite de gasto por categoria**, outro assunto que caixinha. Casa: **Planejar** (própria entrada "Metas") | 🔗 |
| R10 | **Tela Mais** com 3 atalhos | Só aponta para outras 3 telas | Manter "Mais" enxuto: Anotações, Relatórios, Ajustes (mas Anotações pode subir de nível: veja Q2) | ❓ |

## 3. Ficha de cada função

### Início
| Função | Representa | O que faz | Veredito |
|---|---|---|---|
| Balança + "Seu valor de verdade" | Quanto é seu de verdade | Dois pratos: o que tem × o que deve + sobra | ✅ É a identidade do app e responde a pergunta central. Mas explicar em **uma frase** logo abaixo |
| Legenda da balança (5 itens) | Detalhe dos pratos | Lista: para usar, guardado, bens, dívidas, sobra | ✅ Reduzir para **3 linhas** no Início (tenho, devo, é meu); o detalhe vai no "Como ler" |
| Frase do dia (autores) | Inspiração | Frase que muda ao tocar | ❓ **Enfeite puro**, mas é parte da identidade. Sugiro manter pequena, só na capa |
| Resumo do mês | Como foi o mês | Entrou / Saiu / Sobrou | ✅ |
| "Seus bens mudaram de valor" | Efeito de valorização | Linha de aviso | ✂️ Tirar do Início; fica em Relatórios (o dono precisa disso só quando olha o mês) |
| "O que pagar" com setas de mês | Compromissos | Cartão com total, já pago e lista | 🔗 Vira **uma linha** que leva ao Planejar (R1) |
| Avisos | Não esquecer | Atrasado, vence hoje, limite quase no fim, cópia | ✅ Mantém só os **urgentes** (máx. 3) |
| Cofres (caixinhas) | Progresso de guardar | Até 4 cofres animados | ✅ Vitrine, mas só quando houver caixinha |
| Metas do mês (jarras) | Limite por categoria | Até 4 jarras | 🔗 Sai do Início se a pessoa não criou metas; fica só com atalho |
| Últimas anotações (6) | Confirmar o que anotou | Lista curta | ✅ Reduzir para 3 |
| Botão "Usar o dinheiro guardado" | Atalho de tirar da caixinha | Abre janela de tirar | ✂️ Fica só na tela Caixinhas (R6) |

### Anotar
| Função | Representa | O que faz | Veredito |
|---|---|---|---|
| Gastei / Recebi / Transferi / Comprei um bem | O que aconteceu | Folha de duas colunas | ✅ Núcleo do app |
| Parcelas, data, categoria | Detalhes | Campos opcionais | ✅ |
| "Apagar anotação" + Desfazer | Corrigir | Remove e permite voltar | ✅ |

### Dinheiro
| Função | Representa | O que faz | Veredito |
|---|---|---|---|
| Contas (carteira, banco, poupança) | Onde o dinheiro está | Saldo, guardado e para usar | ✅ |
| Cartões e dívidas | O que você deve | Fatura, limite, "Pagar" | ✅ |
| Bens | O que você tem de valor | Carro, casa, TV; valorização; venda | ✅ (mas como **aba própria dentro de Dinheiro**, não misturado) |
| Pessoas (emprestei/devo) | Dívidas entre pessoas | Cobrança, perdão | ✅ Idem: seção própria |
| Tela é longa (contas + dívidas + bens + pessoas) | — | — | 🔗 Dividir em **4 abas curtas** dentro da tela: Contas · Dívidas · Bens · Pessoas |

### Planejar
| Função | Representa | O que faz | Veredito |
|---|---|---|---|
| Cartão "O que pagar" | Total do mês | Soma de cartão, fixas e dívidas | ✅ **Casa oficial** (R1) |
| Agenda | O que vence nos próximos dias | Lista ordenada | ✅ Casa oficial (R2, R7) |
| Caixinhas / Contas fixas / Simulador | Ferramentas | Atalhos | ✅ |
| Metas do mês | Limite de gasto | (hoje escondida em Caixinhas) | 🔗 Entrada própria (R9) |

### Mais
| Função | Representa | O que faz | Veredito |
|---|---|---|---|
| Anotações (buscar/ordenar/filtrar) | Histórico | Busca, ordem, 15 por vez | ✅ |
| Relatórios | Análise do mês | Para onde foi, de onde veio, evolução | ✅ **Sem** repetir resumo, "O que pagar", lista de contas e lista de anotações (R1 a R4) |
| Balancete (Modo contador) | Visão técnica | Mostra débito/crédito | ✅ Só no Modo contador |
| Ajustes | Configurar | Letra, cores, movimento, categorias, cópia, feedback | ✅ Ver Q3 |
| Simulador "e se eu comprar" | Decidir uma compra | Gráfico de 12 meses | ❓ Útil para decidir, mas **ninguém pediu fora o dono**. Manter e ver no teste se alguém usa |
| Gráfico de evolução (6 meses à frente) | Para onde caminha | Linha | ✅ Mas só em Relatórios |
| Frases, carimbo "ANOTADO", moedas rolando | Identidade | Animações | ✅ Dão a cara do app. Não tocar |

## 4. Resumo: o que sobra de "só preenchimento"

Funções que **só repetem** o que existe em outro lugar (candidatas a sair da tela onde estão):
1. Cartão "O que pagar" completo no **Início** e nos **Relatórios** (R1)
2. Lista "Contas a pagar" nos **Relatórios** (R2)
3. Lista de anotações nos **Relatórios** (R3)
4. Resumo entrou/saiu/sobrou nos **Relatórios** (R4)
5. "Para pagar agora" dentro de **Contas fixas** (R7)
6. Botão "Usar o dinheiro guardado" e "bens mudaram de valor" no **Início**

Isso não tira nenhuma capacidade do app: cada coisa continua existindo, em **um** lugar.

## 5. Perguntas para você decidir

- **Q1. Frase do dia.** Manter (identidade) ou tirar do Início? *Recomendo manter, menor.*
- **Q2. Anotações em "Mais"?** É o histórico e a pessoa vai querer achar fácil. Posso **subir Anotações** para a barra de baixo no lugar de "Anotar" ou como atalho no Início. *Recomendo atalho forte no Início ("Ver tudo") e manter em Mais.*
- **Q3. Ajustes.** Hoje mistura aparência, categorias, cópia dos dados e feedback. *Recomendo separar em: Aparência · Dados (cópia, recuperar, apagar tudo) · Ajuda (feedback, como ler a balança).*
- **Q4. Início enxuto.** Aceita que o Início mostre só: valor de verdade (balança), resumo do mês, **uma linha** "falta pagar", avisos urgentes, 3 últimas anotações?
- **Q5. Dinheiro em abas** (Contas · Dívidas · Bens · Pessoas)? *Recomendo sim.*
- **Q6. Metas** com entrada própria em Planejar? *Recomendo sim.*
- **Q7. Simulador:** manter como está até o teste de campo? *Recomendo sim.*

## 6. O que não pude verificar
- Se as pessoas realmente se confundem com essas repetições (hipótese minha, sem teste de campo).
- Como as telas ficam em celular real e com letra "Enorme" depois de enxugar.
