# Caderneta: regras e contexto para trabalhar no projeto

> Este arquivo é lido primeiro por quem (pessoa ou Claude) for mexer no projeto. É curto de propósito:
> aqui estão **as regras e o jeito de trabalhar**. O resto está em `docs/` (veja a tabela no fim).

## Em que pé estamos
- **Versão 1.12.0-beta.1** (7 nov 2026): app reorganizado (`docs/MAPA-DO-APP.md`), só com a interface Balança (D39), paleta **preto, dourado e branco** (D44), anotar em dois toques (D43), conta Dinheiro com cédulas, **abas Gráficos e Relatórios com 9 indicadores** (D45) acerto de contas no Planejar (D46), busca com lista completa e categorias favoritas (D47), bolinhas em círculo e seletor de tipo na folha (D48) e visual "vivo" com animações (D49). **Próximo (desenho decidido, ainda sem código):** investimentos, caixinhas que rendem e nova aba (D50). **Ainda sem teste com pessoas reais em celular.**
- App no ar em https://grluans09-source.github.io/caderneta/ (GitHub Pages, publicado por GitHub Actions a partir da pasta `app/`).
- 1 arquivo de app (`app/index.html`, ~2.400 linhas), 20 arquivos de teste (606 verificações) que rodam com `npm test`.
- Próximos passos em `docs/ROTEIRO.md`. Estado, riscos e dívidas em `docs/AVALIACAO.md`.

## Quem é o dono e como falar com ele
- O dono **não é programador**. Idioma: **português do Brasil**, sempre.
- Ele pediu: explicar com **analogias** e **linguagem comum**. Evitar jargão; se usar um termo técnico, explicar em uma frase.
- Responder com: o que mudou, o que foi testado, o que **não** foi verificado (ex.: celular real), e uma decisão clara quando houver. Nada de enrolação.
- Antes de qualquer ação que **publica, cria algo público, cria conta ou mexe em configuração do GitHub**, confirmar com ele.
- Contas: o GitHub certo é a pessoal **grluans09-source**. A conta `lnfinanceiro9-commits` é da empresa e **não deve ser usada** neste projeto. Nunca guardar senhas, tokens ou chaves no repositório.

## O produto em 6 linhas
1. App de finanças **pessoa física**, mobile-first, instalável (PWA), **sem servidor e sem banco de dados**. Dados em `localStorage`, por aparelho.
2. Tem que ser usável por um **idoso**, um **jovem** e um **adulto na correria**: simples, intuitivo, letras grandes, poucas decisões por tela.
3. A **contabilidade (partida dobrada) trabalha por trás**; a pessoa vê palavras comuns. O "Modo contador" (opcional) mostra os termos técnicos.
4. Visual **"livro-razão vivo"**: preto, dourado e branco (luxo com ar contábil), balança de latão, carimbo, animações com propósito. **Dourado = clicável, preto = selecionado; uma cor, um significado** (sem verde; ver `docs/MAPA-DO-APP.md`). O "exótico" está no visual, nunca na navegação.
5. Tudo em **um arquivo HTML autocontido** (sem framework, sem build, sem fontes ou scripts externos).
6. Distribuído por **link**; a pessoa instala na tela inicial. Backup manual pelo botão "Guardar uma cópia".

## Regras de ouro do código (não quebrar)
1. **Um arquivo só**: `app/index.html` com HTML, CSS e JS dentro. Sem framework, bundler ou dependência externa no app. Todo o JS fica dentro de uma IIFE.
2. **Dinheiro em centavos (inteiros)**. Nunca ponto flutuante para valor.
3. **Nunca** `alert()`, `confirm()` ou `prompt()` nativos. Usar `confirmar()` e os modais próprios.
4. **Dados de fora são desconfiados**: tudo que vem do `localStorage` ou de um backup passa por `higienizar()`. Dado ilegível nunca é sobrescrito sem guardar cópia (`caderneta:v2:corrompido`).
5. **Storage só por `lsGet`/`lsSet`** (podem falhar em modo privado). 
6. **Todo texto de usuário passa por `esc()`** ao entrar em HTML. Ids só `[A-Za-z0-9_-]`.
7. Lançamentos apontam para contas e categorias por **id**, nunca por nome.
8. **Todo lançamento vira partidas de mesmo valor** (débito = crédito). Não criar "atalhos" que quebrem isso. Os testes conferem.
9. **Acessibilidade**: alvos de toque grandes; cor nunca é a única pista (sempre também sinal +/− e texto); respeitar letra grande (`data-tam`), tema escuro e "Movimento: Parado" / `prefers-reduced-motion`. Animar só `transform` e `opacity`.
10. **Não copiar** identidade visual nem código de outros sistemas do dono.

## Regras de produto (o que o dono decidiu)
- **Vocabulário comum na tela**: "conta", "Transferi entre contas", "previsão", "Perdeu valor / Ganhou valor", "anotação", "ANOTADO", "o que ainda deve". **Proibido na tela comum**: gaveta, partida dobrada, lançamento, saldo devedor, comprometido, projeção, débito/crédito (só no Modo contador). O teste `08-vocabulario-e-apagar-conta` varre todas as telas atrás dessas palavras.
- **O app conta dinheiro e bens cadastrados.** Comida/consumo é gasto; carro/TV/casa é "Comprei um bem" (não reduz o "é meu" na compra).
- **Caixinhas são organização pessoal**, fora da contabilidade: olham só o **dinheiro real nas contas** (sem dívidas), o guardado **continua na conta e continua sendo da pessoa** (como a caixinha de um banco: o total não muda), só sai de "Dinheiro para usar agora" e volta ao tirar. Na tela, "livre" virou "para usar".
- **Listas longas nunca aparecem inteiras**: 15 por vez, com busca e ordem por data, valor ou nome.
- **Apagar** conta, bem ou pessoa com anotações é permitido, **com aviso claro** do que sai junto.
- Conteúdo educativo (frases da capa): só autores reais, atribuição conferida.

## Como trabalhar (fluxo de toda mudança)
1. **Entender** o pedido e conferir `docs/DECISOES.md` e esta página (não desfazer decisão do dono sem perguntar).
2. **Mudar** em `app/index.html` (e só nela, salvo ícones/manifest/sw).
3. **Testar**: `npm test` (tem que dar "TUDO CERTO"). Mudança de comportamento ⇒ **escrever ou ajustar um teste** em `tests/`. Bug encontrado ⇒ teste que o reproduz **antes** da correção.
4. **Ver no navegador** em 375×812 (`npm start`), inclusive letra "Enorme" e tema escuro quando mexer em layout. Animação só se confere com o painel visível.
5. **Documentar (obrigatório, no mesmo envio)**: ver "Git sempre em dia" abaixo.
6. **Versionar** (ver "Versão e publicação") e **enviar ao GitHub**. O GitHub roda os testes e publica sozinho.
7. **Reportar** ao dono em português simples, dizendo o que **não** foi verificado.

## Git sempre em dia (regra do dono)
O dono pediu: **quem ler o repositório nunca deve encontrar informação velha, substituída ou melhorada.** Em **todo envio**:
1. **Procure o que ficou velho**: rode `grep -rn` pelos nomes e números que mudaram (versão, número de testes, nomes de tela e de botão, cores, hospedagem) em `README.md`, `CLAUDE.md` e `docs/`.
2. **Corrija** o que mudou. Se um documento descreve um passado que não vale mais, ponha **no topo um aviso "histórico"** dizendo o que vale hoje (como em `PLANO-BETA.md` e `AUDITORIA-FUNCOES.md`).
3. **Decisão substituída** em `DECISOES.md`: marque a antiga como *SUBSTITUÍDA pela Dxx* e crie a nova. Nunca apague sem deixar rastro.
4. **Atualize sempre**: `CHANGELOG.md`, a linha "Em que pé estamos" deste arquivo (versão e número de testes), `docs/MAPA-DO-APP.md` (se mudou tela, botão ou cor), `docs/ARQUITETURA.md` (se mudou código ou regra), `docs/ROTEIRO.md` (se mudou o plano) e `docs/GUIA-TESTADORES.md` (se mudou algo que o testador vê).
5. Só então **versionar e enviar**. Isto vale também para mudanças pequenas.

## Versão e publicação
- Versão semântica `MAJOR.MINOR.PATCH`: **PATCH** = correção; **MINOR** = função nova compatível; **MAJOR** = quebra de dados/compatibilidade.
- A versão fica em **3 lugares que sobem juntos**: `package.json` ("version"), `app/index.html` (`VERSAO_APP`) e `app/sw.js` (`VERSAO = "caderneta-<versão>"`). **Esquecer o `sw.js` faz os celulares não atualizarem.**
- Marcar cada versão no Git: `git tag -a vX.Y.Z -m "..."` e `git push --tags`.
- Checklist completo e plano de migração (Cloudflare Pages recomendado; Netlify como alternativa): `docs/PUBLICACAO.md`. Modelo de venda: pagamento único (D31).

## Comandos
```bash
npm install     # uma vez, instala o jsdom (só para os testes)
npm test        # roda tudo; sai com erro se algo falhar
npm start       # app em http://localhost:8765 (pasta app/)
npm run icones  # regenera os ícones PNG a partir do desenho em tools/gerar-icones.js
```

## Armadilhas conhecidas
- O **service worker** serve a versão antiga: ao testar no navegador, desregistre o SW e limpe o cache (ou use janela anônima).
- O painel de navegador escondido **congela animações**: mostre-o antes de conferir.
- Os testes usam uma **cópia** do app com um "gancho" (`window.__T`). Se um teste novo precisar de outra função interna, acrescente o nome em `tests/preparar.js`.
- Nomes internos antigos continuam (`modalGaveta`, `data-a="gaveta"`): na tela já é "conta". **Não renomear às cegas**; se for renomear, faça com teste rodando.
- Cuidado com `desenhar()`: refaz a tela inteira. Para campos com foco (busca), repintar só o pedaço (veja `pintarAnot`).

## Onde está o resto
| Documento | Para quê |
|---|---|
| `README.md` | Visão geral e como rodar |
| `docs/CONTEXTO.md` | Por que o app é assim; o que o dono pediu; glossário |
| `docs/ARQUITETURA.md` | Dados, motor contábil, telas, mapa das funções, testes |
| `docs/AVALIACAO.md` | Estado atual, riscos, dívidas técnicas |
| `docs/ROTEIRO.md` | Próximos passos por prioridade |
| `docs/DECISOES.md` | Decisões e motivos |
| `docs/PUBLICACAO.md` | Publicar, backup, recuperar o projeto, migrar de hospedagem |
| `docs/MAPA-DO-APP.md` | Onde mora cada assunto, mapa de cores, fluxo de uso (o app de hoje) |
| `docs/GUIA-TESTADORES.md` | Como mandar o app a testadores e o que observar |
| `docs/PLANO-BETA.md`, `docs/AUDITORIA-FUNCOES.md` | **Históricos** (como se chegou ao mapa atual) |
| `CHANGELOG.md` | Histórico de versões |
