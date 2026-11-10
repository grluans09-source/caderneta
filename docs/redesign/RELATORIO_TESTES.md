# Redesign "Tinta & Latão": relatório dos testes (fase I)

> Entregável 6 da seção 9 do prompt de implementação: regressão, responsivo, acessibilidade e offline.
> Versão testada: **1.32.0-beta.1** (10 nov 2026). Massa de teste: `tests/golden/fixture.js` (relógio parado em 9/11/2026, meio-dia).
> Como repetir tudo: `npm test` e, com o puppeteer-core e o axe-core numa pasta fora do projeto, `CAPTURA_MODULOS=<pasta>/node_modules node tools/conferir-final.js tudo docs/redesign/capturas/fase-i` (mais as ferramentas listadas em cada seção).

## Resultado em uma linha
**Tudo aprovado no que dá para conferir por máquina.** Não foi feito o teste manual com leitor de tela (TalkBack, NVDA, VoiceOver) nem em celular de verdade: isso precisa de uma pessoa (veja "O que não foi verificado").

## 1. Regressão funcional (seção 8.1)

| Pedido | Resultado | Como |
|---|---|---|
| Todos os valores iguais ao golden master da fase A | **Iguais.** A única diferença é a regra do panorama da Saúde (D1), aprovada e registrada em `tests/golden/mudancas-aprovadas.json` | `tests/35-golden-master.test.js` (20 grupos: é meu de verdade, saldos, caixinhas, entrou/saiu/sobrou, faturas, agenda, 10 indicadores, 10 relatórios por escrito, contas do ano, metas, rendimentos, resgate, 63 respostas do Perguntar, anotações em cada filtro e busca) |
| Restaurar a cópia .json da fase A | **Restaura sem perder nada** | teste `35` (`tests/golden/copia-1.24.1.json`) |
| Testes automáticos | **1174 verificações em 43 arquivos, todos verdes** | `npm test` (também roda no GitHub a cada envio) |

Fluxos de ponta a ponta pedidos pelo prompt e o teste que cobre cada um:

| Fluxo | Testes |
|---|---|
| Primeiros passos com e sem cartão | `01`, `02`, `15`, `38` |
| Anotar nos 4 tipos | `01`, `03`, `04`, `19`, `39`, `42` |
| Editar | `01`, `04`, `09`, `15`, `27`, `41`, `42` |
| Apagar + Desfazer | `01`, `16`, `25`, `36`, `39` |
| Pagar fatura com e sem juros | `03`, `05`, `06`, `20`, `30` |
| Paguei / Pular em conta fixa | `03`, `36`, `39` |
| Guardar e tirar de caixinha | `03`, `11`, `12`, `13`, `17` |
| Aplicar e resgatar investimento | `28`, `33` |
| Conferir com o banco | `23`, `27`, `30`, `33`, `41` |
| Contar cédulas | `19`, `30` |
| Arredondamento do dinheiro vivo | `19`, `28` |
| Criar meta, caixinha, conta fixa, bem e pessoa | `03`, `04`, `07`, `08`, `17`, `39` |
| Filtros e ordenação de anotações | `14`, `32`, `38`, `42` |
| Perguntar com "Ver no app" | `26`, `34` |
| Modo contador, tema, letra, movimento | `08`, `37`, `40` e os testes que trocam a configuração |
| Guardar cópia e restaurar | `01`, `21`, `35` |
| Cada função de antes no lugar novo (PF-01 a PF-50, PD-01 a PD-34) | `38` (celular), `41` e `42` (computador); `MATRIZ_PRESERVACAO_VERIFICADA.md` |

## 2. Visual e responsivo (seção 8.2)

| Pedido | Resultado | Como |
|---|---|---|
| 10 larguras (320, 360, 390, 430, 480, 1024, 1280, 1366, 1440, 1920) × claro/escuro × letra Normal/Enorme | **40 combinações, 13 telas + a folha de anotar em cada uma (560 telas): nenhum problema** | `tools/conferir-final.js visual` |
| Nenhuma rolagem para o lado | Nenhuma | idem, mais `tools/conferir-larguras.js` (320 px, 3 letras, 2 temas, 78 combinações) |
| Nenhum texto cortado | Nenhum. **Corrigido na fase I**: 182 lugares cortavam com "…" (nomes e detalhes das anotações e da agenda, linha de baixo das ferramentas); agora quebram a linha. Valores em R$ continuam sem quebrar no meio | idem; teste `43` |
| Nenhum controle encoberto | Nenhum (o centro de cada botão à vista é o próprio botão) | idem |
| Início do celular mostra o próximo vencimento sem rolar (390 × 844) | **Sim** (termina em y = 612; a barra começa em 765) | `tools/conferir-primeira-tela.js` |
| Início do computador mostra valor, pendências, anotações e mês (1440 × 900) | **Sim** | `tools/conferir-computador.js` |
| Fotos | Antes: `capturas/antes/`. Depois: `capturas/fase-i/` (26 telas × celular, computador e celular escuro) e `capturas/fase-i/matriz/` (o Início nas 40 combinações). Uma pasta por fase (`fase-b` a `fase-h`) mostra o caminho | `tools/capturar-telas.js` |

## 3. Acessibilidade (seção 8.3)

| Pedido | Resultado | Como |
|---|---|---|
| axe-core sem violações sérias ou críticas | **Nenhuma**, em 44 telas e janelas (celular 390 px e computador 1440 px, claro e escuro; telas principais com as seções abertas, folha/painel de anotar, janela Como ler, Perguntar). **Corrigido na fase I**: 12 lugares usavam `aria-pressed` onde ele não vale (abas de Dinheiro, tipos da anotação, escolhas das janelas, interruptores) | `tools/conferir-final.js acesso` (axe-core 4.10.2, regras WCAG 2.0/2.1/2.2 A e AA); teste `43` |
| Contraste ≥ 4,5:1 (texto) e ≥ 3:1 (texto grande e limites de controle), nos dois temas | **Aprovado** | teste `37` (calcula o contraste de cada par de cores dos tokens) e a regra `color-contrast` do axe-core |
| Navegação completa por teclado, foco visível | **Aprovado**: 5 anotações seguidas só com o teclado; atalhos desligados num campo de texto; dicas no foco que fecham com Esc; foco preso nas janelas | testes `36` e `42`; `tools/conferir-teclado.js` (teclas de verdade no Chrome) |
| Teste manual com TalkBack e NVDA ou VoiceOver | **Não feito** (precisa de uma pessoa com o leitor de tela) | roteiro em `docs/GUIA-TESTADORES.md` |

## 4. Offline e atualização (seção 8.4)

| Pedido | Resultado |
|---|---|
| Sem internet depois da 1ª visita: o app abre | **Sim** |
| As letras carregam | **Sim** (Fraunces e Atkinson, guardadas no aparelho) |
| Todas as telas funcionam | **Sim** (Início, Dinheiro, Planejar, Saúde) |
| Notícias mostram a última cópia guardada | **Sim** |
| Versão nova do service worker substitui a anterior | **Sim**, e apaga o cache velho |

Como: `tools/conferir-final.js offline` (1ª visita, depois o servidor é desligado; por fim uma cópia do app com outra versão no `sw.js`).

## 5. Critério de sucesso (seção 12 do prompt)

| # | Critério | Situação |
|---|---|---|
| 1 | Valores idênticos ao golden master (salvo o panorama, D1) | ✅ teste `35` |
| 2 | Todas as linhas das matrizes de preservação verificadas | ✅ 50 de 50 (celular) e 34 de 34 (computador) |
| 3 | Início: vencimento sem rolar em 390 × 844; valor, pendências, anotações e mês em 1440 × 900 | ✅ `conferir-primeira-tela` e `conferir-computador` |
| 4 | Anotar ≤ 4 toques no celular; só com teclado no computador | ✅ 2 toques (Anotar → Salvar, com valor digitado); N · valor · Tab · Shift+Enter |
| 5 | Nada flutuando sobre o conteúdo; avisos sem sobreposição | ✅ `conferir-primeira-tela` (nada flutuando) e a fila única de avisos (teste `36`) |
| 6 | Acessibilidade, responsivo e offline aprovados | ✅ por máquina; ⚠️ falta o teste manual com leitor de tela |
| 7 | Identidade por tokens, igual nas duas plataformas | ✅ teste `37` (nenhuma cor solta no estilo) |

## O que não foi verificado
- **Leitor de tela de verdade** (TalkBack no Android, NVDA no Windows, VoiceOver no iPhone/Mac): o axe-core confere as regras, mas não substitui ouvir o app.
- **Celular e computador de verdade**: todos os testes usam o Chrome sem janela, imitando o tamanho e o toque.
- **Safari** (iPhone e Mac) e **Firefox**: não testados.
- **Teclados de outros idiomas**: o app olha o caractere ("/" e "?"), não a posição da tecla, mas não foi conferido.
