# Mapa do app (passo 3 do plano da beta)

Aplica as decisões Q1 a Q7 da [auditoria](AUDITORIA-FUNCOES.md), aceitas pelo dono em 6 nov 2026.

**Regras do mapa**
1. **Cada assunto mora em um único lugar.** Nos outros lugares só existe um **atalho** (uma linha que leva até a casa dele).
2. **Cada tela responde uma pergunta** e diz isso no topo, em uma frase.
3. **Palavra comum, sem inventar.** Conta é "conta"; cartão é "cartão"; empréstimo é "empréstimo".
4. **Cada botão diz o que faz** (verbo + coisa: "Guardar na caixinha", "Pagar a fatura").
5. **No máximo 5 blocos por tela.** O resto fica atrás de "Ver mais".

## 1. A barra de baixo (sempre igual)

| Botão | Pergunta que responde |
|---|---|
| **Início** | Como estou hoje? |
| **Dinheiro** | Onde está meu dinheiro e o que eu devo? |
| **+ Anotar** (botão do meio) | O que aconteceu agora? |
| **Planejar** | O que vem pela frente? |
| **Mais** | Ver o histórico, os relatórios e ajustar o app |

## 2. Onde mora cada assunto

| Assunto | Casa (única) | Aparece como atalho em |
|---|---|---|
| Valor de verdade (balança) | Início | – |
| Resumo do mês (entrou, saiu, sobrou) | Início | – |
| **Quanto falta pagar no mês** | **Planejar** | Início (uma linha) |
| **O que vence (agenda)** | **Planejar** | Início (só avisos urgentes) |
| Contas fixas (cadastro) | Planejar > Contas fixas | Agenda |
| Metas do mês (limite por categoria) | Planejar > Metas | Início (se existirem) |
| Caixinhas (guardar) | Planejar > Caixinhas | Início (vitrine), Dinheiro (quanto está guardado em cada conta) |
| Simulador "e se eu comprar" | Planejar > Simulador | – |
| Contas (carteira, banco, poupança) | Dinheiro > Contas | – |
| Cartões e empréstimos | Dinheiro > Dívidas | Planejar (quando vence) |
| Bens (carro, casa...) | Dinheiro > Bens | – |
| Pessoas (emprestei, devo) | Dinheiro > Pessoas | Agenda (cobranças) |
| **Lista de anotações** (buscar, ordenar) | **Mais > Anotações** | Início (3 últimas + "Ver todas") |
| Relatórios (para onde foi, de onde veio, evolução) | Mais > Relatórios | – |
| Cópia dos dados, recuperar, apagar tudo | Mais > Ajustes > Dados | Início (aviso de cópia) |
| Feedback, "Como ler a balança" | Mais > Ajustes > Ajuda | Início ("Como ler a balança?") |

## 3. As telas, uma por uma

Em cada tela: **título**, **a frase que explica para que serve** (aparece no topo, em letra normal) e **o que tem**.

### Início: "Como estou hoje"
> *"Quanto é seu de verdade hoje, e o que pede atenção."*
1. Frase do dia (pequena, só na capa)
2. Balança + 3 linhas: **Tenho · Devo · É meu de verdade** (com "Como ler a balança?")
3. Resumo do mês: Entrou · Saiu · Sobrou
4. Uma linha: **"Falta pagar este mês: R$ X"** → Planejar
5. Avisos urgentes (no máximo 3): atrasado, vence hoje ou amanhã, limite quase no fim, lembrete de cópia
6. Vitrine das caixinhas (só se existirem) e metas (só se existirem)
7. 3 últimas anotações + "Ver todas as anotações"

### Dinheiro: "Onde está seu dinheiro"
> *"Suas contas, o que você deve, seus bens e as pessoas."*
Quatro abas curtas: **Contas · Dívidas · Bens · Pessoas**
- **Contas:** cada conta mostra o saldo e, se houver caixinha, "guardado · para usar"
- **Dívidas:** cartões e empréstimos, com limite, quanto devo e botão "Pagar a fatura"
- **Bens:** o que tem valor e como o valor mudou
- **Pessoas:** quem me deve e a quem devo

### + Anotar: "O que aconteceu"
> *"Escolha o que aconteceu e preencha: de onde saiu, para onde foi."*
Gastei · Recebi · Transferi entre contas · Comprei um bem (duas colunas, como hoje)

### Planejar: "O que vem pela frente"
> *"O que você precisa pagar e como se organizar."*
1. **Ferramentas no topo** (4 botões compactos: Metas do mês · Caixinhas · Contas fixas · Simulador), para nunca ficarem escondidas atrás de uma lista longa
2. **Falta pagar este mês** (cartão com total, até 5 contas, já pago e setas de mês) ← casa oficial
3. **Agenda dos próximos dias** (mostra 4; "Ver todas" abre o resto)

**Mapa de cores do Planejar** (uma cor, um significado; vale para as outras telas também):

| Cor | Onde aparece no Planejar | Significa |
|---|---|---|
| Bordô | Faixa do cartão "Falta pagar", dívidas na agenda, ferramenta Metas, data pintada | Dinheiro que **sai**; dívida |
| Ardósia | Contas fixas (faixa e linhas) | Compromisso que se repete |
| Azul safira | Cobranças "A receber" na agenda | Dinheiro que **entra** |
| Ametista | Ferramenta Caixinhas | Dinheiro **guardado** |
| Cobre | Ferramenta Simulador | Compra de **bem** |
| Ouro | (só quando algo está selecionado) | Item **selecionado** |

Urgência na data de cada conta: **pintada** = vence hoje ou já passou; **clara** = vence em até 3 dias; sem destaque = mais longe.

### Planejar > Contas fixas: "Todo mês, no mesmo dia"
Só o **cadastro** (as contas cadastradas, o total por mês e "+ Nova conta fixa"). O que vence aparece na Agenda.

### Planejar > Metas do mês: "Quanto posso gastar em cada coisa"
Limite por categoria (mercado, lazer...) e quanto já foi usado. Sai de dentro de Caixinhas.

### Planejar > Caixinhas: "Guardar sem sair da conta"
Funciona como a caixinha do banco. Cofres animados, "Guardar" e "Tirar", e o dinheiro guardado por conta.

### Planejar > Simulador: "E se eu comprar"
Como está hoje.

### Mais: "Tudo o resto"
Três entradas: **Anotações · Relatórios · Ajustes**

### Mais > Anotações: "Tudo o que você anotou"
Busca, ordem por data, valor ou nome, filtros e 15 por vez. É a única lista completa.

### Mais > Relatórios: "Como foi o mês"
Setas de mês, **Para onde foi o dinheiro**, **De onde veio**, **Evolução** e, no Modo contador, o balancete. Sem repetir o resumo, o "O que pagar", a lista de contas nem a lista de anotações.

### Mais > Ajustes: três grupos
- **Aparência:** letra, cores, movimento, Modo contador
- **Dados:** categorias, guardar uma cópia, recuperar, apagar tudo
- **Ajuda:** contar um problema ou ideia, como ler a balança

## 4. Fluxos de uso (o caminho da pessoa)

| Situação | Caminho |
|---|---|
| Primeiro acesso | Primeiros passos (3 telas) → Início |
| Gastei no mercado | **+ Anotar** → Gastei → Salvar |
| Quero saber o que ainda vou pagar | Início ("Falta pagar") → Planejar |
| Paguei a fatura do cartão | Dinheiro > Dívidas > Pagar a fatura |
| Quero guardar dinheiro | Planejar > Caixinhas > Guardar |
| Procurar um gasto antigo | Mais > Anotações (busca) |
| Trocar de celular | Mais > Ajustes > Dados > Guardar uma cópia → no novo, Recuperar |
| Apaguei sem querer | Botão **Desfazer** (8 segundos) |

## 5. O que muda no código (visão geral para o passo 5)

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

## 6. O que fica fora (de propósito)
- Nenhuma função é removida do app.
- Visual, balança, animações e carimbo continuam como estão. Os 3 novos modelos de interface são o passo 6.
- Notificações: continuam fora (o app não tem servidor).
