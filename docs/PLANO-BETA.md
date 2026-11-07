# Plano até a beta de uso (passo a passo)

Pedido do dono em 6 nov 2026. Cada passo termina com: testes passando, conferência na tela, documentação e CHANGELOG atualizados, e **só então** vai ao ar (um passo por vez, com a sua autorização).

Ordem pensada para **não refazer trabalho**: primeiro decidir o que existe e onde fica (passos 1 a 3), depois mexer em como aparece (4 a 6), por fim publicar (7).

| # | Passo | O que entrega | Precisa de decisão sua? |
|---|---|---|---|
| 1 ✅ | Caixinhas como no banco | Dinheiro guardado continua **seu**, sai só do "livre na conta" | Sim (veja abaixo) |
| 2 ✅ | Auditoria: o que é útil e o que é enfeite | Lista função por função: o que faz, o que representa, se repete, se fica | Sim: você aprova o que sai |
| 3 ✅ | Mapa do app e lugar único de cada coisa | Um desenho do app: cada tela, cada função, onde mora, como se chega | Sim: você aprova o mapa |
| 4 ✅ | Linguagem e telas autoexplicativas | Cada tela diz, em uma frase, para que serve; palavras de uso comum | Não |
| 5 ✅ | Reorganizar o app conforme o mapa | Funções repetidas viram um lugar só; fluxo de uso mais claro | Não (segue o mapa aprovado) |
| 6 ✅ | Mais 3 modelos de interface simples | 3 "jeitos" de usar o app: poucas informações, animados, com cara de contabilidade | Sim: escolher o padrão |
| 7 | Publicar a beta | Versão 1.7.1-beta, guia atualizado, aviso aos testadores | Sim: autorizar o envio |

---

## Passo 1: Caixinhas como no banco

**Hoje:** o dinheiro guardado numa caixinha **sai do total** de "Dinheiro que eu tenho" (Marco 14). Isso não é o que acontece no banco.

**Como é no banco (exemplo: Caixinha Turbo do Nubank):** o dinheiro continua sendo seu, continua no banco, só **muda de bolso**: sai de "conta corrente (para movimentar)" e vai para "guardado". O total não muda; o que muda é **quanto está livre para gastar**.

**Regra nova proposta:**
- **Dinheiro que eu tenho** (total) = soma de tudo, **inclusive o guardado**. Guardar não muda esse número.
- Cada conta mostra **duas partes**: **Para usar** (livre) e **Guardado** (nas caixinhas). Exemplo: Banco R$ 1.500 = R$ 1.000 para usar + R$ 500 guardado.
- Gastar, pagar cartão e transferir só usam o **Para usar**. Se faltar, o app avisa e oferece **tirar da caixinha**.
- Guardar e tirar continuam sendo um toque; o app só **muda de bolso** (não vira gasto nem ganho).
- A balança e os relatórios continuam usando o total; a tela inicial ganha "Para usar agora" em destaque.

**Dúvida para você decidir:** o dinheiro guardado conta como "o que eu tenho" na balança? **Recomendo que sim** (é o que o banco mostra: saldo total). Quem quiser ver só o livre olha "Para usar".

**Mudança em dados já guardados:** nenhuma perda; só muda como o saldo é mostrado.

**Testes:** atualizar os testes 11, 12 e 13 (hoje esperam o guardado fora do total).

## Passo 2: Auditoria "útil ou enfeite"

Para **cada função** do app, uma ficha com: *o que representa*, *o que faz*, *quem usa*, *se já existe em outro lugar*, *veredito* (manter, juntar, tirar).

Suspeitas de repetição que vou conferir no código (hipóteses, ainda não confirmadas):
- "Quanto falta pagar no mês" aparece no Início, no Planejar e nos Relatórios.
- A lista de anotações aparece nas Anotações e nos Relatórios.
- Caixinhas aparecem no Início e no Planejar; contas fixas e agenda se misturam.
- Pessoas (empréstimos) moram dentro de "Dinheiro", junto com contas e bens.
- Balança, resumo do mês e gráficos mostram números que se sobrepõem.

Critério de "útil": ajuda a pessoa a **decidir** ou a **não esquecer** algo? Se só mostra um número que já está em outro lugar, é enfeite.

Entrega: `docs/AUDITORIA-FUNCOES.md`, para você aprovar o que sai.

## Passo 3: Mapa do app (lugar único e fixo)

Regra: **cada coisa mora em um só lugar**; nos outros, só aparece um atalho.

Proposta de partida (será refinada pela auditoria):

| Aba | Pergunta que responde | Fica aqui |
|---|---|---|
| **Início** | "Como estou hoje?" | Para usar agora, quanto é meu, o que vence logo, atalho para anotar |
| **Anotar** | "O que aconteceu?" | Gastei, Recebi, Transferi, Comprei um bem |
| **Dinheiro** | "Onde está meu dinheiro e o que devo?" | Contas, cartões, empréstimos, bens, pessoas, caixinhas |
| **Planejar** | "O que vem pela frente?" | Contas que vencem, contas fixas, metas, simulador |
| **Mais** | "Ver, buscar e ajustar" | Anotações, relatórios, cópia dos dados, ajustes |

Entrega: `docs/MAPA-DO-APP.md` com o desenho de telas e do fluxo de uso (do primeiro acesso ao uso diário).

## Passo 4: Linguagem e telas autoexplicativas

- **Palavra comum, sem inventar**: conta é "conta" (nunca "gaveta"); cartão é "cartão"; empréstimo é "empréstimo". O teste de vocabulário já varre isso e será ampliado com a lista nova.
- **Cada tela tem um título que diz o que ela é e uma linha que diz para que serve.** Exemplo: "Dinheiro: onde ele está e o que você deve".
- **Cada botão diz o que faz** ("Guardar na caixinha", não "Movimentar").
- Quando um número aparece, ao lado diz **de onde vem** (toque para ver o cálculo).
- Estados vazios ensinam: "Você ainda não tem caixinhas. Toque em + para criar a primeira."

## Passo 5: Reorganizar conforme o mapa

Executa o que foi aprovado nos passos 2 e 3, **um bloco por vez**, rodando os testes a cada bloco. Nenhuma função sai sem o seu OK. Atualiza testes e `docs/ARQUITETURA.md`.

## Passo 6: Mais 3 modelos de interface (visuais)

Hoje há **1** visual ("livro-razão vivo"). A ideia é oferecer **mais 3**, escolhidos em Ajustes ("Jeito de usar"), todos com **poucas informações por tela**, **animados** e com **referências contábeis**. O dado e o motor são os mesmos; muda só a "roupa" e quanto aparece na tela.

| Modelo | Ideia | Como a contabilidade aparece | Animação |
|---|---|---|---|
| **A. Balança** | Uma tela só: uma balança grande; de um lado o que tenho, do outro o que devo | A própria balança de dois pratos | Os pratos pendem e equilibram quando algo muda |
| **B. Razão (livro aberto)** | Duas páginas lado a lado: "entrou / saiu" | Colunas de débito e crédito, sem nomes técnicos | Linhas se escrevem sozinhas; carimbo ao anotar |
| **C. Cofre e fluxo** | Contas como vasos ligados por canos; o dinheiro corre entre eles | Cada anotação é um fluxo que sai de um vaso e entra em outro (partida dobrada visual) | Líquido que sobe, desce e passa pelo cano |

Eu preparo uma **pré-visualização navegável de cada um** para você escolher e ajustar antes de eu aplicar no app inteiro. Cuidados que valem para os três: letra grande, tema escuro, "Movimento: Parado" e alvos de toque grandes.

## Passo 7: Publicar a beta

- Plataforma: a melhor opção gratuita já definida é **Cloudflare Pages** (ver `PUBLICACAO.md`). Enquanto isso, continua no GitHub Pages **só para teste, não para vender**.
- Antes de enviar: testes verdes, conferência na tela (letra Enorme, tema escuro), `GUIA-TESTADORES.md` e mensagem aos testadores atualizados.
- Fazem parte do envio: versão `1.2.0-beta` nos 3 lugares, tag no Git e CHANGELOG.
- Passos que só você pode fazer: criar a conta no Cloudflare e autorizar o GitHub.

---

## Como vamos andar
1. Eu faço o **passo 1** e mostro funcionando.
2. Você aprova ou ajusta. Só então vou para o **passo 2**, e assim por diante.
3. Em cada passo digo: o que mudou, o que foi testado e **o que não consegui conferir** (por exemplo, celular real).
