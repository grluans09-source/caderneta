# Balancete (antes Caderneta): regras e contexto para trabalhar no projeto

> Este arquivo é lido primeiro por quem (pessoa, Claude ou outra IA) for mexer no projeto. Outras IAs chegam por `AGENTS.md`, que manda ler este. É curto de propósito:
> aqui estão **as regras e o jeito de trabalhar**. O resto está em `docs/` (veja a tabela no fim).

## Em que pé estamos
- **Versão 1.28.0-beta.1** (9 nov 2026): **redesign "Tinta & Latão" em andamento (D67)**, fases A a E prontas: golden master que prova que as contas não mudam; abertura curta, um aviso por vez, Saúde honesta ("Aguardando dados" sem base mínima), ⓘ, janelas acessíveis, meta estourada (1.25.0); **cores e letras novas** (1.26.0: tokens, Fraunces + Atkinson locais, tinta = ação); **barra Início · Dinheiro · [Anotar] · Planejar · Saúde**, Perguntar e Ajustes no cabeçalho, Investimentos e Anotações dentro de Dinheiro, Início por urgência (1.27.0); **valor com vírgula** ("50" = R$ 50,00, D2), **anotar em 2 toques** com a folha de uma etapa e o Salvar sempre à vista, acerto em linha no Planejar, previsão só com 2 meses completos (D3) (1.28.0). Próxima: fase F (movimento). **A versão de antes está guardada** (marca `v1.24.1-beta.1`, ramo `salvo/1.24.1-antes-do-redesign`). Antes, na 1.24.1: **chat em dia** (63 perguntas, D66) e **"Ver no app" que leva ao lugar exato**; antes, na 1.24.0: **cada investimento rende do seu jeito** (D65: % do CDI, taxa fixa, IPCA +, poupança, varia; imposto estimado; atualizar o valor; lembrete semanal de conferir); antes, na 1.23.1, aplicações por último, com "(resgatar)", também no "De onde saiu" de Gastei; antes, na 1.23.0, **interface simplificada** depois de uma auditoria de inconsistências (D64, `docs/AUDITORIA-INTERFACE.md`): aba **Saúde** (Gráficos + Relatórios), seções que abrem, "Mais detalhes" nos formulários, "?" nos termos, no máximo 3 avisos, nada removido; nova trava "esse dinheiro está guardado na caixinha" (D63); as **notícias do IBGE vêm direto do celular** (D62; o IBGE recusa o robô, que roda fora do Brasil); as **4 bolinhas de anotar viraram medalhas douradas** no estilo do Brasão (D61); **auditoria completa** (passo 9, D60: as contas fecham; cédulas e edição de conta não mudam mais o passado; categorias do sistema por código; resultado em `docs/AVALIACAO.md`); **notícias de fontes oficiais** com "para você" (D59); **Investimentos** com aba Investir e rendimento por dia útil (D58); **travas de coerência** (D57); **chat do Balancete** com perguntas prontas (D56; 63 desde a 1.24.1); botão de anotar é a **pena** (D55). o app se chama **Balancete**, com o **Brasão** como logo, abertura em que ele ganha vida, letra de contabilidade, o **Mordomo** como balança do Início e os mascotes dos momentos especiais (D54). Antes: app reorganizado (`docs/MAPA-DO-APP.md`), só com a interface Balança (D39), paleta **preto, dourado e branco** (D44), anotar em dois toques (D43), conta Dinheiro com cédulas, **abas Gráficos e Relatórios com 10 indicadores** (D45, D53; hoje juntas na aba Saúde), acerto de contas no Planejar (D46), busca com lista completa e categorias favoritas (D47), seletor de tipo na folha (D48), visual "vivo" com animações (D49) e botão + solto no canto direito, com novidades que chegam a quem já usa o app (D51), e acerto de contas em janela por cima da tela, com dica de instalar (D52), e as funções contábeis conferir com o banco, contas do ano, mês a mês e custo fixo de vida (D53; análise em `docs/ANALISE-CONTABIL.md`). **O plano de 9 passos terminou**; o próximo passo é o teste de campo (`docs/ROTEIRO.md`). Continua valendo: cada mudança grande é examinada e decidida com o dono antes de fazer.  **Ainda sem teste com pessoas reais em celular.**
- App no ar em https://grluans09-source.github.io/caderneta/ (GitHub Pages, publicado por GitHub Actions a partir da pasta `app/`).
- 1 arquivo de app (`app/index.html`, ~5.100 linhas), 39 arquivos de teste (1042 verificações) que rodam com `npm test`.
- Próximos passos em `docs/ROTEIRO.md`. Estado, riscos e dívidas em `docs/AVALIACAO.md`.

## Quem é o dono e como falar com ele
- **Leia `docs/JEITO-DO-DONO.md`**: como ele decide, o que sempre exige e como responder. **Atualize esse documento ao fim de cada conversa** com o que aprendeu (preferência nova, correção que ele fez); é pedido dele (8 nov 2026).
- O dono **não é programador**. Idioma: **português do Brasil**, sempre.
- Ele pediu: explicar com **analogias** e **linguagem comum**. Evitar jargão; se usar um termo técnico, explicar em uma frase.
- Responder com: o que mudou, o que foi testado, o que **não** foi verificado (ex.: celular real), e uma decisão clara quando houver. Nada de enrolação.
- Antes de qualquer ação que **publica, cria algo público, cria conta ou mexe em configuração do GitHub**, confirmar com ele.
- Contas: o GitHub certo é a pessoal **grluans09-source**. A conta `lnfinanceiro9-commits` é da empresa e **não deve ser usada** neste projeto. Nunca guardar senhas, tokens ou chaves no repositório.

## O produto em 6 linhas
1. App de finanças **pessoa física**, mobile-first, instalável (PWA), **sem servidor e sem banco de dados**. Dados em `localStorage`, por aparelho.
2. Tem que ser usável por um **idoso**, um **jovem** e um **adulto na correria**: simples, intuitivo, letras grandes, poucas decisões por tela.
3. A **contabilidade (partida dobrada) trabalha por trás**; a pessoa vê palavras comuns. O "Modo contador" (opcional) mostra os termos técnicos.
4. Visual **"Tinta & Latão"** (D67, desde a 1.26.0): sério, próximo e fácil de ler. **Tinta = ação** (botão principal, selecionado, foco); **latão = marca, o "É meu de verdade", conquistas e a aba ativa**; neutros = estrutura; estados em verde-musgo (saudável), âmbar (atenção) e vermelho (alerta), sempre com ícone e texto. Cores só por **tokens** (`--color-*`, `--tinta*`, `--dv-*` para gráficos) em `:root`, com tema escuro; **nenhuma cor solta nas regras** (o teste `37` confere). **Letras locais**: `--font-display` = Fraunces (títulos e valores) e `--font-ui` = Atkinson Hyperlegible Next (texto), em `app/fontes/` (OFL), com **algarismos tabulares** nos números; tamanhos pela escala `--fs-*`/`--lh-*` em rem. O **Brasão** (logo) e o **Mordomo** continuam (D54). **Uma cor, um significado.** O "exótico" está no visual, nunca na navegação.
5. Tudo em **um arquivo HTML** (sem framework, sem build, sem nada de outro site): ao lado dele, só ícones, manifest, service worker e as **duas letras** em `app/fontes/`.
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
- **Vocabulário comum na tela**: "conta", "Transferi entre contas", "previsão", "Perdeu valor / Ganhou valor", "anotação", "Gasto anotado", "o que ainda deve". **Proibido na tela comum**: gaveta, partida dobrada, lançamento, saldo devedor, comprometido, projeção, débito/crédito (só no Modo contador). O teste `08-vocabulario-e-apagar-conta` varre todas as telas atrás dessas palavras.
- **O app conta dinheiro e bens cadastrados.** Comida/consumo é gasto; carro/TV/casa é "Comprei um bem" (não reduz o "é meu" na compra).
- **Caixinhas são organização pessoal**, fora da contabilidade: olham só o **dinheiro real nas contas** (sem dívidas), o guardado **continua na conta e continua sendo da pessoa** (como a caixinha de um banco: o total não muda), só sai de "Dinheiro para usar agora" e volta ao tirar. Na tela, "livre" virou "para usar". **Uma caixinha pode render** (taxa ao ano, D58): o rendimento é anotado como receita na conta dela e guardado nela.
- **Correção de saldo nunca muda o passado (D60)**: a diferença do Conferir com o banco e da contagem de cédulas entra como **anotação de hoje**; o saldo inicial de uma conta com anotações não se edita. **Categorias do sistema são achadas pelo código `sis`**, nunca pelo nome (a pessoa pode renomear).
- **Investimentos (D58)**: aplicação é uma conta com `inv`; **não é dinheiro para usar agora** (fica fora de `contasDinheiro()`), mas é seu (entra no "é meu de verdade"). Rendimento só em **dia útil** (sem feriado nacional), numa anotação por mês. **Cada aplicação diz como rende (D65)**: % do CDI, taxa fixa, IPCA +, poupança ou varia, com os índices oficiais de cada dia (`S.config.idx`); nunca tratar "% do CDI" como "% ao ano". Mudar como rende refaz só os rendimentos calculados pelo app.
- **Interface em camadas (D64)**: cada tela tem um objetivo e no máximo uns 5 blocos à vista; o resto vai para `recolhivel()` (seção que abre), `maisDetalhes()` (campos opcionais) ou `ajuda()` (o ⓘ com a explicação de termos; era "?" até a 1.24.1). **Nada pode sumir**: o teste `32-simplificacao` confere cada função no lugar novo. "Conta" é o lugar do dinheiro; boleto é "conta a pagar".
- **Redesign (D67)**: em fases (A a I), cada uma termina com testes verdes, fotos antes/depois e `docs/redesign/IMPLEMENTACAO_STATUS.md` atualizado. **O golden master (`tests/35-golden-master.test.js`) não pode mudar** sem uma entrada em `tests/golden/mudancas-aprovadas.json` com a decisão do dono. Fotos: `node tools/capturar-telas.js <pasta>` (precisa do puppeteer-core fora do projeto; veja o topo do arquivo).
- **Avisos e janelas (1.25.0)**: todo aviso passa por `toast()`/`toastDesfazer()` (um por vez); janela nova usa `abrirModal()` (foco, Tab, Esc e fundo inerte já vêm prontos). "Saudável" no panorama só com `baseMinima()`; selos de indicador por `seloInd()`.
- **Navegação (D67, D4, 1.27.0)**: a barra tem **4 destinos + Anotar** (`nav .nav-anotar`, `data-a="novo"`); **Perguntar** (`.perg`) e **Ajustes** (`.cab-aj`) ficam no cabeçalho que `capa()`/`cabAcoes()` monta em toda tela. Telas que não estão na barra continuam como views (`investir`, `anotacoes`, `noticias`, `ajustes`); `ABA` diz qual aba acende. **Nada pode ficar flutuando por cima do conteúdo** (só a barra e avisos de poucos segundos). Função nova precisa entrar na matriz `tests/38-matriz-preservacao.test.js`.
- **Dinheiro na tela (D2, 1.28.0)**: todo campo de dinheiro usa `ligarDinheiro()` (teclado com vírgula, `lerValor()` tolerante, valor por extenso a partir de R$ 1.000); **nunca** a máscara de centavos. Valores em R$ no texto não quebram (`protegerValores()`). A folha de anotar é de uma etapa (`.f-seg`, `.f-barra` presa embaixo); "Anotar" abre direto o Gastei.
- **Chat (D66)**: pergunta nova ou função que mudou de lugar? Atualize a resposta em `PERGS` e o destino em `ALVOS` (o "Ver no app" tem que levar ao lugar exato); o teste `34-chat-ver-no-app` confere.
- **Listas longas nunca aparecem inteiras**: 15 por vez, com busca e ordem por data, valor ou nome.
- **Apagar** conta, bem ou pessoa com anotações é permitido, **com aviso claro** do que sai junto.
- **Travas de coerência (D57)**: o app **impede** o que não acontece na vida real (cartão acima do limite, carteira negativa) e **pergunta "era isso?"** no que é possível mas estranho (banco negativo, pagar ou receber a mais, data distante, valor fora do costume, usar o dinheiro guardado numa caixinha, D63). Função nova que grava anotações deve passar por `conferirAnotacao()`.
- Conteúdo educativo (frases da capa): só autores reais, atribuição conferida.

## Como trabalhar (fluxo de toda mudança)
1. **Entender** o pedido e conferir `docs/DECISOES.md` e esta página (não desfazer decisão do dono sem perguntar).
2. **Mudar** em `app/index.html` (e só nela, salvo ícones/manifest/sw/fontes).
3. **Testar**: `npm test` (tem que dar "TUDO CERTO"). Mudança de comportamento ⇒ **escrever ou ajustar um teste** em `tests/`. Bug encontrado ⇒ teste que o reproduz **antes** da correção.
4. **Ver no navegador** em 375×812 (`npm start`), inclusive letra "Enorme" e tema escuro quando mexer em layout. Animação só se confere com o painel visível.
5. **Documentar (obrigatório, no mesmo envio)**: ver "Git sempre em dia" abaixo. Inclui `docs/JEITO-DO-DONO.md` quando o dono mostrar uma preferência nova.
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
node tools/medir-desempenho.js   # mede a velocidade das telas com 200, 2.000 e 10.000 anotações
node tools/conferir-larguras.js  # 320 px × 3 letras × 2 temas: nada pode passar da largura (precisa do puppeteer-core, veja o topo)
node tools/conferir-primeira-tela.js  # 390 × 844: o vencimento mais próximo à vista e nada flutuando sobre o conteúdo
node tools/capturar-telas.js <pasta>  # fotos de todas as telas (redesign)
npm run icones  # regenera app/icon.svg e os PNGs a partir do Brasão (tools/brasao.js), usando o Chrome sem janela
node tools/noticias.js app/noticias.json   # busca as notícias oficiais agora (o GitHub faz isso sozinho ao meio-dia)
```

## Armadilhas conhecidas
- O **service worker** serve a versão antiga: ao testar no navegador, desregistre o SW e limpe o cache (ou use janela anônima).
- O painel de navegador escondido **congela animações**: mostre-o antes de conferir.
- Os testes usam uma **cópia** do app com um "gancho" (`window.__T`). Se um teste novo precisar de outra função interna, acrescente o nome em `tests/preparar.js`.
- Nomes internos antigos continuam (`modalGaveta`, `data-a="gaveta"`): na tela já é "conta". **Não renomear às cegas**; se for renomear, faça com teste rodando.
- **Por dentro o app continua "caderneta"** (chave dos dados `caderneta:v2`, formato da cópia `app:"caderneta"`, cache do service worker, endereço `/caderneta/`). **Não renomear**: as pessoas perderiam os dados. Só o nome na tela é Balancete (D54).
- As **notícias** vêm de um arquivo gerado pelo robô (`app/noticias.json`, fora do Git). Tudo o que vem dele passa por `noticiasValidas()`; não mostrar nada dele sem `esc()`, e link só de site oficial (`linkOficial()`). **Exceção (D62):** as notícias do IBGE o celular busca direto (`buscarIbge()`), porque o IBGE recusa o robô; o pedido não pode levar nenhum dado da pessoa (sem cookies, sem referência, nada no endereço).
- O GitHub **desliga agendamentos** (o robô do meio-dia) de repositórios públicos que ficam **60 dias sem nenhum envio**. Se o app ficar parado tanto tempo, reative em Actions.
- O desenho do **Brasão** existe em `tools/brasao.js` e tem **cópias dentro do `index.html`** (símbolo do cabeçalho e abertura). Mudou o desenho? Rode `npm run icones` e recopie os dois SVGs.
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
| `docs/ANALISE-CONTABIL.md` | O que é contabilidade de verdade, o que é finanças pessoais e o que é ideia do dono; sugestões de funções contábeis |
| `docs/CHAT-PERGUNTAS.md` | As 63 perguntas do chat, como cada uma é respondida e aonde o "Ver no app" leva |
| `docs/MAPA-DO-APP.md` | Onde mora cada assunto, mapa de cores, fluxo de uso (o app de hoje) |
| `AGENTS.md` | Porta de entrada para qualquer IA: o que ler primeiro e as regras que mais causam estrago |
| `docs/JEITO-DO-DONO.md` | O jeito do dono: como decide, o que exige, como responder (documento vivo) |
| `docs/MODELO-COMANDO.md` | Modelo de comando para passar uma tarefa a outra IA programar (com exemplo) |
| `docs/redesign/` | Redesign (D67): situação item a item, desvios, fotos antes/depois de cada fase |
| `docs/AUDITORIA-INTERFACE.md` | Auditoria de inconsistências da interface (8 nov 2026) e o resultado da simplificação |
| `docs/GUIA-TESTADORES.md` | Como mandar o app a testadores e o que observar |
| `docs/design/balancete-identidade.html` | Protótipo aprovado do Brasão, do Mordomo, da abertura, do botão do chat, dos secundários e da letra (abra no navegador) |
| `docs/PLANO-BETA.md`, `docs/AUDITORIA-FUNCOES.md` | **Históricos** (como se chegou ao mapa atual) |
| `CHANGELOG.md` | Histórico de versões |
