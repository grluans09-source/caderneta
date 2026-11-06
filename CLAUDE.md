# Caderneta: regras e contexto para trabalhar no projeto

> Este arquivo é lido primeiro por quem (pessoa ou Claude) for mexer no projeto. É curto de propósito:
> aqui estão **as regras e o jeito de trabalhar**. O resto está em `docs/` (veja a tabela no fim).

## Em que pé estamos
- **Versão 1.0.0** (6 nov 2026): primeira versão completa e estável, **ainda sem teste com pessoas reais em celular**.
- App no ar em https://grluans09-source.github.io/caderneta/ (GitHub Pages, publicado por GitHub Actions a partir da pasta `app/`).
- 1 arquivo de app (`app/index.html`, ~2.400 linhas), 15 arquivos de teste (470 verificações) que rodam com `npm test`.
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
4. Visual **"livro-razão vivo"**: papel, tinta, balança de latão, carimbo, animações com propósito. O "exótico" está no visual, nunca na navegação.
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
- **Caixinhas são organização pessoal**, fora da contabilidade: olham só o **dinheiro real nas contas** (sem dívidas), o guardado sai de "Dinheiro que eu tenho" e volta ao tirar.
- **Listas longas nunca aparecem inteiras**: 15 por vez, com busca e ordem por data, valor ou nome.
- **Apagar** conta, bem ou pessoa com anotações é permitido, **com aviso claro** do que sai junto.
- Conteúdo educativo (frases da capa): só autores reais, atribuição conferida.

## Como trabalhar (fluxo de toda mudança)
1. **Entender** o pedido e conferir `docs/DECISOES.md` e esta página (não desfazer decisão do dono sem perguntar).
2. **Mudar** em `app/index.html` (e só nela, salvo ícones/manifest/sw).
3. **Testar**: `npm test` (tem que dar "TUDO CERTO"). Mudança de comportamento ⇒ **escrever ou ajustar um teste** em `tests/`. Bug encontrado ⇒ teste que o reproduz **antes** da correção.
4. **Ver no navegador** em 375×812 (`npm start`), inclusive letra "Enorme" e tema escuro quando mexer em layout. Animação só se confere com o painel visível.
5. **Documentar**: atualizar `docs/ARQUITETURA.md` se mudou modelo/regra, `docs/DECISOES.md` se foi uma decisão, `docs/ROTEIRO.md` se mudou o plano, e `CHANGELOG.md`.
6. **Versionar** (ver "Versão e publicação") e **enviar ao GitHub**. O GitHub roda os testes e publica sozinho.
7. **Reportar** ao dono em português simples, dizendo o que **não** foi verificado.

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
| `CHANGELOG.md` | Histórico de versões |
