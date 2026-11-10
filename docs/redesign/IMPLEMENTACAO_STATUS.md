# Redesign "Tinta & Latão": situação da implementação

> Documento vivo: é atualizado no fim de **cada fase** (regra do prompt de implementação).
> Fonte: `PROMPT_Implementacao_Redesign.md` + `Auditoria_Redesign_Mobile.pdf` (Relatório 01) + `Auditoria_Redesign_Desktop.pdf` (Relatório 02), recebidos em 9 nov 2026.
> Decisão do dono: **"siga o relatório, porém deixe essa versão de hoje salva"** (9 nov 2026). Decisões D1 a D6 do prompt seguem o que já veio marcado.

## Versão salva antes do redesign (para voltar, se o dono pedir)
- No GitHub: marca (tag) **`v1.24.1-beta.1`** e ramo **`salvo/1.24.1-antes-do-redesign`**. É a versão no ar em 9 nov 2026.
- Para voltar: passo a passo em `docs/PUBLICACAO.md`, seção "Voltar para a versão salva antes do redesign (1.24.1)". Basta o dono pedir.
- Os dados das pessoas **não mudam de formato** no redesign: quem voltar para a 1.24.1 continua com tudo.

## Fases

| Fase | O que é | Situação |
|---|---|---|
| A | Linha de base: massa de teste, "golden master", fotos "antes", cópia .json | **Concluída** (9 nov 2026), publicada na **1.25.0-beta.1** |
| B | Correções rápidas (avisos, abertura, panorama, diálogos, contraste, textos, formulário) | **Concluída** (9 nov 2026), publicada na **1.25.0-beta.1** |
| C | Fundação: cores (tokens), letras Fraunces + Atkinson locais, componentes base | **Concluída** (9 nov 2026), versão **1.26.0-beta.1** |
| D | Estrutura do celular: barra Início · Dinheiro · [Anotar] · Planejar · Saúde; Perguntar e Ajustes no cabeçalho | **Concluída** (9 nov 2026), versão **1.27.0-beta.1** |
| E | Componentes e telas do celular (folha de anotar, valor, Planejar, metas, gráficos, 320 px) | **Concluída** (9 nov 2026), versão **1.28.0-beta.1** |
| F | Movimento (animações MM e MD) | **Concluída** (10 nov 2026), versão **1.29.0-beta.1** |
| G | Layout do computador (barra lateral, colunas) | **Concluída** (10 nov 2026), versão **1.30.0-beta.1** |
| H | Mouse e teclado no computador (atalhos, hover, tabela) | A fazer |
| I | Validação final, matriz de preservação, documentação | A fazer |

## Fase A: o que foi feito e como conferir

| Pedido do prompt | Feito | Onde |
|---|---|---|
| 1. Massa de teste igual à da auditoria | Carteira R$ 180; banco R$ 3.420,50; CDB R$ 8.000 a 110% do CDI; Nubank (fecha 3, vence 10, limite R$ 4.000, dívidas R$ 612,40 e R$ 240,00); 11 anotações dos 4 tipos; moto perdendo 25% ao ano; 3 metas; 1 caixinha; 3 contas fixas. Relógio parado em 9/11/2026, meio-dia | `tests/golden/fixture.js` |
| 2. "Golden master" de todos os valores calculados | 20 grupos: é meu de verdade, devo, para usar agora, guardado, investido, saldos, caixinhas, entrou/saiu/sobrou (set, out, nov), falta pagar, faturas por vencimento, agenda, os 10 indicadores (valor, estado, leitura), os 10 relatórios por escrito, contas do ano, metas, rendimentos, estimativa de resgate, as 63 respostas do Perguntar, totais e ordem das anotações em cada filtro e busca | `tests/golden/golden-1.24.1.json` (gerado por `tests/golden/gerar.js`, lido por `tests/golden/capturar.js`) |
| 3. Fotos "antes" em 390×844 e 1440×900 | 25 telas × 2 tamanhos = 50 fotos | `docs/redesign/capturas/antes/` (gerador: `tools/capturar-telas.js`) |
| 4. Cópia .json para testar a restauração | Cópia no formato do app (`app:"caderneta"`, versão 2) | `tests/golden/copia-1.24.1.json` |
| Aceite: testes que recalculam e comparam | `tests/35-golden-master.test.js` (23 verificações): compara cada grupo com a 1.24.1 e restaura a cópia sem perder nada | rodado 5 vezes seguidas, sempre igual |

**Testes ao fim da Fase A:** `npm test` com 35 arquivos, **todos verdes** (909 verificações).
**Achado na Fase A:** o teste `33-como-rende` falhava em alguns dias do mês (perto da virada, quando o primeiro rendimento cai no mês seguinte por fim de semana ou feriado). **Não era erro de conta**: o teste esperava a data errada. Corrigido para seguir a regra "refazer só o que o app calculou". Sem essa correção, o GitHub recusaria o próximo envio.

**O golden master só pode mudar com autorização:** cada diferença aprovada entra em `tests/golden/mudancas-aprovadas.json` com a decisão que autorizou (ex.: D1, panorama da Saúde, Fase B). Qualquer outra diferença trava a fase.

### Telas fotografadas (inventário: seção 09 do Relatório 01 e seção 08 do Relatório 02)
01 Início · 02 Dinheiro (Contas) · 03 Dívidas · 04 Bens · 05 Pessoas · 06 Editar conta · 07 Investir · 08 Aplicação · 09 Planejar · 10 Acerto de contas · 11 Caixinhas · 12 Metas · 13 Contas fixas · 14 Simulador · 15 Saúde · 16 Relatórios · 17 Um relatório · 18 Mais · 19 Anotações · 20 Notícias · 21 Ajustes · 22 Menu de anotar · 23 Folha "Gastei" · 24 Perguntar · 25 Primeiros passos (app vazio).
No celular as telas que rolam aparecem inteiras (até 4.200 px); no computador, a primeira tela (o que se vê sem rolar).

## Fase B: o que foi feito
- Avisos: um por vez no mesmo lugar (4 s; 8 s com "Desfazer", nunca cortado antes de 3 s); o balão do Perguntar fala só no primeiro acesso e nunca por cima de outro aviso.
- Abertura: só no primeiro uso e depois de atualizar, em 1,2 s; tocar pula.
- Saúde (D1): contadores Saudáveis · Atenção · Alerta + "Aguardando dados". Para contar como saudável é preciso ter 30 dias de anotações ou a renda informada. O selo dos cartões e a resposta do chat seguem a mesma regra; os indicadores e os relatórios não mudaram.
- ⓘ de 20 px num alvo de 44 px no lugar do "?". Janelas e folha de anotar: foco no título, Tab fica dentro, Esc fecha, o foco volta, o fundo fica inerte. O <main> sem aria-live, link "Pular para o conteúdo", um H1 por tela.
- Bordas de campo #8C8473 / #7C7566 (contraste ≥ 3:1); hover básico com mouse; Enter num campo salva.
- Meta estourada: pote cheio, vermelho, transbordando, "R$ X acima". Textos: "Escolha ou crie o bem…", "Limite ultrapassado em R$ X", "Procure uma pergunta".
- Dica de instalar por aparelho: no computador, só com a opção do navegador; as instruções ficam em Ajustes > Ajuda.
- **Testes:** 36 arquivos, **947 verificações, todos verdes**. Novo: `tests/36-redesign-fase-b.test.js`. Golden master igual, menos a resposta "Minhas finanças estão saudáveis?" (mudança aprovada por D1, em `tests/golden/mudancas-aprovadas.json`). Fotos depois: `docs/redesign/capturas/fase-b/`.
- **Não verificado:** celular de verdade, leitor de tela de verdade (só simulado).

## Fase C: o que foi feito
- **Tokens** da seção 6.1 em `:root`, com o tema escuro nos mesmos seletores de hoje; os nomes antigos apontam para os novos. **Nenhuma cor solta nas regras** do estilo (eram 89 linhas com cores escritas direto).
- **Letras locais**: Fraunces (variável, 36 KB) e Atkinson Hyperlegible Next (variável, 34 KB), dos pacotes oficiais Fontsource (OFL 1.1), em `app/fontes/` e no cache do service worker. Baixadas com autorização do dono.
- **Escala de letra** (celular e computador) e **espaçamento** em tokens; "Normal/Grande/Enorme" multiplicam por 1 / 1,1875 / 1,375 (o app já usava 16/19/22 px).
- **Componentes base**: botão tinta (primário) e com contorno (secundário), campos com borda de 1,5 px, chips e escolhas selecionados em tinta, foco com anel de 2 px, selos de estado (✓ ! ✕ —), aviso em faixa de tinta, diálogo e folha com o fundo `--color-scrim`, cartões arredondados.
- **Testes**: 37 arquivos, **968 verificações, todos verdes** (novo: `tests/37-redesign-fase-c.test.js`: valores dos tokens, 22 pares de contraste em cada tema, nenhuma cor solta, letras locais no cache, escala). Golden master igual (as contas não mudaram).
- **320 px**: `tools/conferir-larguras.js` no Chrome, 14 telas × Normal/Grande/Enorme × claro/escuro = 84 combinações, **nenhuma passa da largura** (antes da fase C, Planejar com letra Grande e Saúde com letra Enorme já passavam; corrigido).
- Fotos depois (claro, escuro e computador): `docs/redesign/capturas/fase-c/`.
- **Não verificado:** celular de verdade (as letras e o tema escuro foram vistos só no Chrome do computador).

## Fase D: o que foi feito
- **Barra de baixo** Início · Dinheiro · [Anotar] · Planejar · Saúde (R-01): ícones de traço 2 px em 24 px, rótulos sempre visíveis (12 / 13 / 14 px), pílula latão-claro na aba ativa, Anotar de 58 × 58 px em tinta com "+" latão-claro, 26 px acima da barra. A pena e o Perguntar flutuantes saíram.
- **Cabeçalho** de toda tela com Perguntar (rosto do Mordomo, 44 × 44) e Ajustes (engrenagem, 44 × 44).
- **D4**: Investimentos é aba de Dinheiro (mesma tela e botões); Todas as anotações em Dinheiro; Notícias no Início > Hoje no Brasil; Ajustes no cabeçalho; a aba Mais saiu (o endereço interno `mais` leva ao Início).
- **Início por urgência** (R-02): cartão do valor com variação e Tenho × Devo; "Precisa de você" (some vazio); cartão do mês com "por dia"; últimas anotações; Hoje no Brasil e Seus objetivos recolhidos; dica de instalar só depois da 1ª anotação; frase no rodapé; balança no "Como ler?".
- **Chat**: 9 respostas com o caminho novo (aprovadas no golden master pela D4; nenhum valor mudou).
- **Aceite**: em 390 × 844 com a massa de teste, o 1º vencimento termina em y = 611 px e a barra começa em 765 px; nada flutua sobre o conteúdo (Normal, Grande e Enorme) — `tools/conferir-primeira-tela.js`. **Matriz PF-01 a PF-50: 50 de 50** no lugar novo (`tests/38-matriz-preservacao.test.js`; detalhe em `MATRIZ_PRESERVACAO_VERIFICADA.md`). 320 px: 78 combinações sem rolagem para o lado.
- **Testes**: 38 arquivos, **1019 verificações, todos verdes**. Fotos: `docs/redesign/capturas/fase-d/` (inclui `26-inicio-primeira-tela`).
- **Não verificado:** celular de verdade; leitor de tela de verdade.

## Fase E: o que foi feito
- **D2 / R-07**: `lerValor()` tolerante ("50" = R$ 50,00; "50,5"; "1.234,56"), teclado com vírgula em todos os campos de dinheiro, valor por extenso a partir de R$ 1.000. Os valores continuam em centavos.
- **R-03 + R-01**: Anotar → folha já no Gastei com o valor em foco (segurar = 4 tipos); seletor de tipo no topo; contas em carrossel, categorias em grade de 3; Salvar numa barra presa embaixo, acima do teclado; erro no próprio campo; alça para fechar. Tudo da folha preservado (busca, favoritas, nova categoria, novo bem, datas, parcelas, juros, anotação, caixinha, resumo, arredondamento do dinheiro vivo).
- **MF-20**: um retorno só ao salvar (aviso com Desfazer + linha em destaque); sem carimbo.
- **MF-09**: pagar abre "Pagar <conta>".
- **R-09**: acerto de contas em linha no Planejar, com Pagar / Paguei / Pular este mês e as pagas recolhidas.
- **R-11**: conta e categoria por botões em Contas fixas e Metas.
- **R-15 / D3**: previsão só com 2 meses completos; barras com raio 3, título ao tocar, "sem anotações", legenda maior; "vezes" no plural certo.
- **R-16**: abaixo de 360 px, ferramentas em 1 coluna; nenhum valor em R$ quebra no meio da linha (`protegerValores()`).
- **Aceite**: no Chrome, com o teclado aberto (390 × 520), tocar em Anotar mostra o Salvar à vista (y = 510 de 520), com o foco no valor e a conta e a categoria escolhidas: **Anotar → digitar → Salvar = 2 toques**. 320 px: 78 combinações sem rolagem lateral e sem valor quebrado. Golden master igual, menos "vez(es)" → "vezes" (aprovado, MF-15).
- **Testes**: 39 arquivos, **1042 verificações, todos verdes** (novo: `tests/39-redesign-fase-e.test.js`). Fotos: `docs/redesign/capturas/fase-e/`.
- **Não verificado:** celular de verdade (o teclado real do Android e do iPhone).

## Fase F: o que foi feito
- **Regras** (seção de movimento do relatório): só `transform` e `opacity` (mais o desenho da linha, o contorno do destaque e a cor do tipo); tokens `--dur-*` e `--ease-*`; números e gráficos sem curva que passa do ponto; nada em loop fora dos momentos de deleite; "Movimento: Parado" = só esmaecer de até 0,12 s.
- **Limpeza**: 7 curvas que "quicavam" trocadas pela curva padrão, 5 loops tirados, e as animações de largura (barras) e posição (pote, chave) trocadas por `transform`.
- **Novos**: folha que sobe e desce (MM-03), indicador do tipo que desliza e cor do tipo no Salvar e na categoria (MM-04), campo que treme (MM-07), linha nova em destaque e contagem do valor (MM-06/MM-10), aviso que sobe com barra de tempo do Desfazer (MM-08/MM-14), barras e linha do gráfico só na 1ª vez (MM-11), janela que entra com escala .96 → 1 (MM-13), resposta do Perguntar e destaque do "Ver no app" (MM-15), pote que enche e gota (MM-16).
- **Ajuste**: os nomes das metas aparecem inteiros (hifenização em português) e os potes dividem a largura.
- **Testes**: 40 arquivos, **1068 verificações, todos verdes** (novo: `tests/40-redesign-fase-f.test.js`: lê as 56 animações do estilo e confere as regras, e testa cada movimento no app). Chrome: aceite das fases D e E e 320 px continuam OK. Fotos: `docs/redesign/capturas/fase-f/` (fotos mostram o estado final; o movimento em si só se vê no aparelho).
- **Não verificado:** a sensação do movimento num celular de verdade (fluidez e se "mexe demais").

## Fase G: o que foi feito
- **Regra**: tudo vale **só a partir de 1.024 px** de largura; no celular nada muda (as fotos `*-celular.jpg` da fase G são iguais às da F, salvo duas correções abaixo). No código, `ehPC()` decide pelo tamanho real da janela e a tela se redesenha quando a janela cruza 1.024 px.
- **RD-01 / RD-02 (barra lateral)**: marca e «, **+ Nova anotação** em latão claro com a tecla N à vista, 4 destinos, Atalhos (Anotações, Hoje no Brasil), e embaixo Perguntar, Ajustes e a data da última cópia. Larguras da matriz: 72 px (1024–1279, só ícones com dica do mouse), 232 px (1280–1439), 248 px (≥ 1440). Recolher fica guardado.
- **RD-03 (Início)**: duas colunas: valor + 5 últimas anotações + Hoje no Brasil | Precisa de você + mês + "fechou" + objetivos. Em 1024: valor em cima, Precisa e mês lado a lado (6/6), o resto embaixo.
- **RD-05 (Dinheiro)**: em Contas e Dívidas, lista (4/12) + detalhe (8/12) com valor, Conferir com o banco, Editar e o extrato (15 mais recentes); 3/9 em 1920; um embaixo do outro em 1024.
- **RD-07 (Saúde)**: panorama em faixa (números | texto) e os 10 indicadores em grade de 2, 3 ou 4 colunas, do mais grave ao mais tranquilo, "Aguardando dados" por último.
- **RD-08 (Planejar)**: acerto e agenda (7/12) | ferramentas (5/12).
- **RD-14 e matriz**: conteúdo até 1.200 px (1.440 em 1920), relatório com 720 px, janelas no centro até 560 px (RD-11), folha de anotar como painel de 460 px à direita com véu de 18% (RD-04, parte de layout).
- **Correções que valem no celular também**: o selo "▲ R$ … desde o mês passado" tinha perdido o espaço antes de "desde", e a linha de baixo das ferramentas do Planejar quebrava a cada palavra (efeito da proteção dos valores da fase E).
- **Testes**: 41 arquivos, **1114 verificações, todos verdes** (novo: `tests/41-fase-g-computador.test.js`, que finge uma janela de computador com um `matchMedia` de mentira e confere celular e computador). Chrome: `tools/conferir-computador.js` (1024, 1280, 1440, 1920: barra, colunas, nada passa da largura, Início sem rolar em 1440 × 900, painel de anotar), `conferir-larguras` (320 px) e `conferir-primeira-tela` continuam OK. Fotos: `docs/redesign/capturas/fase-g/` (26 telas × celular e computador) e `fase-g/larguras/` (8 telas × 4 larguras).
- **Não verificado:** num computador de verdade com mouse (as fotos são do Chrome sem janela); telas com zoom do navegador; Safari no Mac.

## Itens dos relatórios

Situação: **A fazer** · **Feito** · **Parcial** · **Descartado** (com motivo). A coluna "Fase" diz quando cada item entra.

### Relatório 01 (celular): problemas (MF)
| ID | Prioridade | Problema | Fase | Situação |
|---|---|---|---|---|
| MF-01 | P1 | Camada flutuante permanente cobre conteúdo e ações | D | Feito (fase D) |
| MF-02 | P1 | Balões e avisos se sobrepõem e reaparecem a cada troca de aba | B | Feito (fase B) |
| MF-03 | P1 | Abertura obrigatória de 4,1 s a cada carregamento | B | Feito (fase B) |
| MF-04 | P1 | A primeira dobra do Início não mostra o que exige ação | D | Feito (fase D) |
| MF-05 | P1 | Painel de Saúde declara "saudável" sem dados | B (D1) | Feito (fase B) |
| MF-06 | P2 | Campo de valor interpreta dígitos como centavos sem aviso | E (D2) | Feito (fase E, D2) |
| MF-07 | P2 | Botão "?" colado ao título é lido como pontuação | B | Feito (fase B) |
| MF-08 | P2 | Formulário de anotação: Salvar fora da tela e foco não automático | E | Feito (fase E) |
| MF-09 | P2 | Padrões de seleção inconsistentes entre formulários | E | Feito (fase E) |
| MF-10 | P2 | Diálogos não gerenciam foco; anúncio de tela inteira | B | Feito (fase B) |
| MF-11 | P2 | Contraste insuficiente em bordas de campos e controles | B | Feito (fase B) |
| MF-12 | P2 | Repetição de valores no Início e no Planejar | D/E | Feito (D: Início; E: Planejar) |
| MF-13 | P2 | Dourado usado para tudo dilui o sinal | C/E | Feito (fase C: latão só para marca e valor; ação em tinta) |
| MF-14 | P2 | Tipografia serifada depende do sistema | C | Feito (fase C) |
| MF-15 | P2 | Gráficos e projeções com pouca base de dados | E (D3) | Feito (fase E, D3) |
| MF-16 | P2 | Meta estourada aparece como pote vazio | B | Feito (fase B) |
| MF-17 | P3 | Textos com lacuna e inconsistência | B | Feito (fase B) |
| MF-18 | P3 | Letra "Enorme" esconde os rótulos da barra inferior | D | Feito (fase D) |
| MF-19 | P3 | Em 320 px, as ferramentas do Planejar ficam espremidas | E | Feito (fase E) |
| MF-20 | P3 | Excesso de camadas de confirmação ao salvar | E | Feito (fase E: aviso único; os momentos do Mordomo continuam só ao receber e pagar) |
| MF-21 | P3 | Dinheiro e Investir divididos em abas diferentes | D (D4) | Feito (fase D) |
| MF-22 | P3 | Cartão de instalação ocupa o topo até ser dispensado | B | Feito (B: texto por aparelho; D: só depois da 1ª anotação, no fim do Início) |

### Relatório 01 (celular): recomendações (R)
| ID | Recomendação | Resolve | Fase | Situação |
|---|---|---|---|---|
| R-01 | Navegação: barra Início · Dinheiro · [Anotar] · Planejar · Saúde; Perguntar e Ajustes no cabeçalho | MF-01, MF-18, MF-21 | D | Feito (D: barra e cabeçalho; E: tocar = Gastei, segurar = 4 tipos) |
| R-02 | Início reorganizado por urgência | MF-04, MF-12, MF-22 | D | Feito (fase D) |
| R-03 | Folha "Nova anotação" de uma etapa | MF-08, MF-20, MF-06 | E | Feito (fase E) |
| R-04 | Fila única de avisos e regra para o mascote | MF-02, MF-20 | B | Feito (fase B) |
| R-05 | Abertura curta e só quando agrega | MF-03 | B | Feito (fase B) |
| R-06 | Saúde honesta: panorama por estado | MF-05, MF-15 | B | Feito (fase B) |
| R-07 | Entrada monetária à prova de engano | MF-06 | E | Feito (fase E, D2) |
| R-08 | Ajuda contextual com ícone ⓘ | MF-07 | B | Feito (fase B) |
| R-09 | Planejar: acerto de contas em linha | MF-12, MF-09 | E | Feito (fase E) |
| R-10 | Estados das metas e caixinhas | MF-16 | B/E | Feito (B: estados; E: pote 56 × 72 e nome em 2 linhas) |
| R-11 | Componentes de seleção unificados | MF-09 | E | Feito (fase E) |
| R-12 | Diálogos e leitores de tela | MF-10 | B | Feito (fase B) |
| R-13 | Papel do dourado e limites visíveis | MF-11, MF-13 | C/E | Feito (fase C) |
| R-14 | Sistema tipográfico próprio | MF-14 | C | Feito (fase C) |
| R-15 | Gráficos com base mínima | MF-15 | E | Feito (fase E, D3) |
| R-16 | Ajustes para 320 px | MF-19 | E | Feito (fase E) |

### Relatório 01 (celular): movimento (MM)
| ID | Elemento · onde | Fase | Situação |
|---|---|---|---|
| MM-01 | Marca (moeda) e conteúdo · Abertura | F | Feito (B: abertura curta; F: conteúdo entra em 0,22 s) |
| MM-02 | Conteúdo da aba · Barra inferior | F | Parcial (a tela nova entra; a saída da anterior não, para a tela ficar livre na hora) |
| MM-03 | Folha "Nova anotação" · Global | F | Feito (fase F) |
| MM-04 | Controle de tipo (Gastei/Recebi/Transferi/Bem) · Folha Anotar | F | Feito (fase F) |
| MM-05 | Chip de conta / categoria · Folha Anotar | F | Parcial (cor do tipo e leve escala ao tocar; sem o ícone de check) |
| MM-06 | Saldo animado e linha nova ao salvar ("Gasto anotado · Desfazer") | F | Parcial (contagem, linha nova em destaque, aviso com Desfazer; sem o ✓ no botão e sem a linha abrir de altura 0) |
| MM-07 | Campo com erro · Formulários | F | Feito (fase F) |
| MM-08 | Linha excluída + aviso · Listas | F | Parcial (barra do tempo do Desfazer; a linha apagada não recolhe antes de sumir; 8 s em vez de 5 s, R-04) |
| MM-09 | Item da agenda pago · Planejar / Início | F | Parcial (as barras crescem; check desenhado e valor riscado ficam para depois) |
| MM-10 | Números principais · Início / Saúde | F | Feito (fase F) |
| MM-11 | Barras e linhas dos gráficos · Saúde | F | Feito (fase F; 1 vez por sessão, sem IntersectionObserver) |
| MM-12 | Seções recolhíveis · Global | F | Parcial (o conteúdo esmaece ao abrir; sem animar a altura) |
| MM-13 | Diálogo de confirmação · Global | F | Feito (fase F) |
| MM-14 | Avisos (fila única) · Global | F | Feito (fase F) |
| MM-15 | Resposta e "Ver no app" · Perguntar | F | Feito (fase F) |
| MM-16 | Pote da meta · Metas | F | Feito (fase F) |

### Relatório 02 (computador): problemas (DF)
| ID | Prioridade | Problema | Fase | Situação |
|---|---|---|---|---|
| DF-01 | P1 | Layout de telefone esticado na tela do computador | G | Feito (fase G) |
| DF-02 | P1 | Ações globais nos cantos da janela, longe do conteúdo | G | Feito (fase G: Nova anotação, Perguntar, Ajustes e cópia na barra lateral) |
| DF-03 | P1 | Nenhum estado de hover | B (básico) / H | Parcial (B: hover básico; completo na H) |
| DF-04 | P1 | Rolagem excessiva e ação importante fora da dobra | G | Feito (fase G: em 1440 × 900 o Início mostra valor, Precisa de você, anotações e mês sem rolar) |
| DF-05 | P1 | Panorama da Saúde declara "saudável" sem dados | B (D1) | Feito (fase B) |
| DF-06 | P2 | Barra de navegação inferior (padrão de telefone) | G | Feito (fase G) |
| DF-07 | P2 | Teclado: foco visível, mas fluxo lento e diálogos sem contenção | B (diálogos) / H | Parcial (B: diálogos; atalhos na H) |
| DF-08 | P2 | Diálogos e formulário em formato de telefone | G | Parcial (G: painel de anotar de 460 px e janelas no centro; teclado na H) |
| DF-09 | P2 | Listas sem estrutura de tabela | G/H | Parcial (G: extrato ao lado da conta; tabela de anotações na H) |
| DF-10 | P2 | Instruções de instalação de Android mostradas no computador | B | Feito (fase B) |
| DF-11 | P2 | Gráficos estreitos e sem interação de mouse | G/H | Parcial (G: grade de 2 a 4 colunas; mouse nos gráficos na H) |
| DF-12 | P2 | Abertura de 4,1 s também no computador | B | Feito (fase B) |
| DF-13 | P2 | Contraste insuficiente de limites de controle | B | Feito (fase B) |
| DF-14 | P3 | Escala tipográfica idêntica à do telefone | C/G | Feito (C: escala do computador; G: layout) |
| DF-15 | P3 | Repetição de valores e lista duplicada | G | Feito (D/E: menos repetição; G: colunas sem lista duplicada) |

### Relatório 02 (computador): recomendações (RD)
| ID | Recomendação | Resolve | Fase | Situação |
|---|---|---|---|---|
| RD-01 | Layout de aplicação com barra lateral e grade de 12 colunas | DF-01, DF-06 | G | Feito (fase G) |
| RD-02 | Ações globais na barra lateral | DF-02 | G | Feito (fase G; a tecla N funciona na H) |
| RD-03 | Início em painel de duas colunas | DF-04, DF-15 | G | Feito (fase G; desvio 30) |
| RD-04 | Painel lateral de anotação (não modal) | DF-08, DF-07 | G | Parcial (G: painel de 460 px com véu leve; Enter, Shift+Enter e 1–4 na H) |
| RD-05 | Dinheiro em mestre-detalhe (com Investimentos) | DF-01, DF-09 | G | Parcial (G: Contas e Dívidas com detalhe e extrato; desvios 31 e 32) |
| RD-06 | Anotações como tabela ordenável | DF-09 | H | A fazer |
| RD-07 | Saúde em grade com panorama horizontal | DF-04, DF-05, DF-11 | G | Feito (fase G) |
| RD-08 | Planejar em duas colunas | DF-04, DF-15 | G | Feito (fase G) |
| RD-09 | Estados de interação para mouse | DF-03 | H | A fazer |
| RD-10 | Teclado de primeira classe (atalhos completos, D5) | DF-07 | H | A fazer |
| RD-11 | Diálogos centralizados | DF-08 | G | Feito (fase G: no centro, até 560 px) |
| RD-12 | Conteúdo sensível à plataforma | DF-10 | B | Feito (fase B) |
| RD-13 | Gráficos para mouse e telas largas | DF-11 | H | A fazer |
| RD-14 | Escala tipográfica do computador | DF-14 | C/G | Feito (C: escala; G: larguras e relatório com 720 px) |

### Relatório 02 (computador): movimento (MD)
| ID | Elemento | Fase | Situação |
|---|---|---|---|
| MD-01 | Linhas, cartões, botões, itens da barra lateral | F/H | A fazer |
| MD-02 | Anel de foco | F/H | A fazer |
| MD-03 | Painel lateral "Nova anotação" (460 px) | F/G | A fazer |
| MD-04 | Indicador da seção ativa | F/G | A fazer |
| MD-05 | Dica ao passar o mouse (tooltip) | H | A fazer |
| MD-06 | Nova linha + valores | F | Feito (fase F, igual ao MM-06) |
| MD-07 | Linhas ao ordenar | H | A fazer |
| MD-08 | Filtros | H | A fazer |
| MD-09 | Painel de detalhe (mestre-detalhe) | G | A fazer |
| MD-10 | Diálogo centralizado | G | A fazer |
| MD-11 | Gráficos (barras/linhas) + dica | H | A fazer |
| MD-12 | Aviso (fila única) | F | Feito (fase F, igual ao MM-14) |
| MD-13 | Item "Precisa de você" pago | F | Parcial (as barras crescem; igual ao MM-09) |
| MD-14 | Abertura do aplicativo | F | Feito (B e F: abertura curta e entrada do conteúdo) |
| MD-15 | Recolher / expandir a barra lateral (1024 a 1279 px) | G | A fazer |

## Matriz de preservação
PF-01 a PF-50 (celular) e PD-01 a PD-34 (computador): cada função de hoje, onde ficou e como foi testada. Arquivo `docs/redesign/MATRIZ_PRESERVACAO_VERIFICADA.md`, preenchido a partir da Fase D (quando as funções mudam de lugar) e fechado na Fase I.
