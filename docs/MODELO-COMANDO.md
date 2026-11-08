# Modelo de comando (para passar uma tarefa a uma IA que vai programar)

O fluxo: **o dono diz o que quer → uma IA escreve o comando neste formato → outra IA programa**. O comando tem que ser completo: quem programa não viu a conversa com o dono. Copie o modelo, preencha e cole na IA que vai programar.

---

## O modelo

```text
# Tarefa: <título curto>

## Antes de começar (obrigatório)
Leia AGENTS.md, CLAUDE.md e docs/JEITO-DO-DONO.md. Siga as regras deles. Se algo deste
comando contrariar essas regras, pare e pergunte ao dono.

## O que o dono quer (nas palavras dele)
"<frase do dono, como ele disse>"
Em outras palavras: <o pedido explicado em 1 a 3 frases>.

## Por quê
<o problema que isso resolve para quem usa o app>

## Decisões já tomadas (não mudar)
- <ex.: D64: nada pode sumir da interface>
- <ex.: o dono escolheu a opção B>

## Onde mexer
- Arquivo: app/index.html (o app inteiro está nele)
- Funções: <nomes das funções, ex.: listaColuna, contasRapidas>
- Testes: tests/<arquivo>.test.js (novo ou ajustado)

## O que fazer (passos)
1. <passo>
2. <passo>

## O que NÃO fazer
- Não renomear nada que seja "caderneta" por dentro (chave caderneta:v2, formato da cópia,
  cache do service worker, endereço /caderneta/): as pessoas perderiam os dados.
- Não usar alert/confirm/prompt; não pôr dependência externa; dinheiro sempre em centavos.
- Não enviar ao GitHub nem publicar sem o dono dizer "Sim, enviar".
- Não usar a conta do GitHub da empresa (lnfinanceiro9-commits). Só grluans09-source.
- <o que mais não pode mudar nesta tarefa>

## Testes
- Escrever ou ajustar: <o que o teste deve conferir>
- Rodar: npm test  → tem que terminar com "TUDO CERTO".

## Conferir na tela
npm start, abrir http://localhost:8765 em 375×812 (celular), também com letra "Enorme" e
tema escuro. Antes, limpar o service worker (ele mostra a versão antiga).
Conferir: <o que olhar>

## Documentos a atualizar (no mesmo envio)
CHANGELOG.md, CLAUDE.md ("Em que pé estamos": versão e número de testes), README.md,
docs/MAPA-DO-APP.md (se mudou tela ou botão), docs/ARQUITETURA.md (se mudou código),
docs/DECISOES.md (se foi decisão), docs/ROTEIRO.md, docs/GUIA-TESTADORES.md (se o testador
vê a mudança) e docs/JEITO-DO-DONO.md (se o dono mostrou uma preferência nova).
Procurar com grep números e nomes velhos (versão, número de testes, nomes de telas).

## Versão
<PATCH = correção; MINOR = função nova>. Subir junto nos 3 lugares: package.json,
VERSAO_APP em app/index.html e VERSAO em app/sw.js ("caderneta-<versão>").

## Pronto quando
- <critério 1>
- npm test com "TUDO CERTO"; conferido na tela; documentos atualizados.

## Relato ao dono (em português simples, sem jargão)
O que mudou · o que foi testado · o que NÃO foi verificado (ex.: celular real) ·
a pergunta "Envio a versão X ao GitHub?".
```

---

## Exemplo preenchido (a versão 1.23.1, já feita)

```text
# Tarefa: aplicações por último no "De onde saiu" de Gastei

## Antes de começar (obrigatório)
Leia AGENTS.md, CLAUDE.md e docs/JEITO-DO-DONO.md.

## O que o dono quer (nas palavras dele)
"Sim, fazer" (resposta à proposta de aplicar na folha de anotar a mesma regra do simulador).
Em outras palavras: ao anotar um gasto ou a compra de um bem, as aplicações (CDB, Poupança)
não devem aparecer como se fossem dinheiro para usar.

## Por quê
Dinheiro investido não é "dinheiro para usar agora" (D58). Na lista curta elas confundem.

## Decisões já tomadas (não mudar)
- D64 (decisão 3): no simulador, aplicações vão por último, com "(resgatar)".
- Em "Transferi entre contas" as aplicações continuam normais (é assim que se aplica e resgata).

## Onde mexer
- app/index.html: contasRapidas, listaColuna, itemColuna, desenharFolha (F.cols.E)
- tests/32-simplificacao.test.js

## O que fazer (passos)
1. Na coluna "De onde saiu" de Gastei e Comprei um bem, marcar semInv.
2. Lista curta: tirar aplicações, salvo se forem favoritas.
3. Lista completa e busca: aplicações por último, com " (resgatar)" no nome.

## O que NÃO fazer
- Não mexer em Transferi nem em Recebi. Não mudar cálculos.

## Testes
- Lista curta de Gastei sem a aplicação; lista completa termina em "CDB (resgatar)";
  em Transferi a aplicação aparece sem "(resgatar)".

## Pronto quando
- Os 3 testes novos passam e npm test dá "TUDO CERTO"; conferido em 375×812.
```
