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
| C | Fundação: cores (tokens), letras Fraunces + Atkinson locais, componentes base | A fazer |
| D | Estrutura do celular: barra Início · Dinheiro · [Anotar] · Planejar · Saúde; Perguntar e Ajustes no cabeçalho | A fazer |
| E | Componentes e telas do celular (folha de anotar, valor, Planejar, metas, gráficos, 320 px) | A fazer |
| F | Movimento (animações MM e MD) | A fazer |
| G | Layout do computador (barra lateral, colunas) | A fazer |
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

## Itens dos relatórios

Situação: **A fazer** · **Feito** · **Parcial** · **Descartado** (com motivo). A coluna "Fase" diz quando cada item entra.

### Relatório 01 (celular): problemas (MF)
| ID | Prioridade | Problema | Fase | Situação |
|---|---|---|---|---|
| MF-01 | P1 | Camada flutuante permanente cobre conteúdo e ações | D | A fazer |
| MF-02 | P1 | Balões e avisos se sobrepõem e reaparecem a cada troca de aba | B | Feito (fase B) |
| MF-03 | P1 | Abertura obrigatória de 4,1 s a cada carregamento | B | Feito (fase B) |
| MF-04 | P1 | A primeira dobra do Início não mostra o que exige ação | D | A fazer |
| MF-05 | P1 | Painel de Saúde declara "saudável" sem dados | B (D1) | Feito (fase B) |
| MF-06 | P2 | Campo de valor interpreta dígitos como centavos sem aviso | E (D2) | A fazer |
| MF-07 | P2 | Botão "?" colado ao título é lido como pontuação | B | Feito (fase B) |
| MF-08 | P2 | Formulário de anotação: Salvar fora da tela e foco não automático | E | A fazer |
| MF-09 | P2 | Padrões de seleção inconsistentes entre formulários | E | A fazer |
| MF-10 | P2 | Diálogos não gerenciam foco; anúncio de tela inteira | B | Feito (fase B) |
| MF-11 | P2 | Contraste insuficiente em bordas de campos e controles | B | Feito (fase B) |
| MF-12 | P2 | Repetição de valores no Início e no Planejar | D/E | A fazer |
| MF-13 | P2 | Dourado usado para tudo dilui o sinal | C/E | A fazer |
| MF-14 | P2 | Tipografia serifada depende do sistema | C | A fazer |
| MF-15 | P2 | Gráficos e projeções com pouca base de dados | E (D3) | A fazer |
| MF-16 | P2 | Meta estourada aparece como pote vazio | B | Feito (fase B) |
| MF-17 | P3 | Textos com lacuna e inconsistência | B | Feito (fase B) |
| MF-18 | P3 | Letra "Enorme" esconde os rótulos da barra inferior | D | A fazer |
| MF-19 | P3 | Em 320 px, as ferramentas do Planejar ficam espremidas | E | A fazer |
| MF-20 | P3 | Excesso de camadas de confirmação ao salvar | E | A fazer |
| MF-21 | P3 | Dinheiro e Investir divididos em abas diferentes | D (D4) | A fazer |
| MF-22 | P3 | Cartão de instalação ocupa o topo até ser dispensado | B | Parcial (B: texto por aparelho; mudar de lugar fica na D) |

### Relatório 01 (celular): recomendações (R)
| ID | Recomendação | Resolve | Fase | Situação |
|---|---|---|---|---|
| R-01 | Navegação: barra Início · Dinheiro · [Anotar] · Planejar · Saúde; Perguntar e Ajustes no cabeçalho | MF-01, MF-18, MF-21 | D | A fazer |
| R-02 | Início reorganizado por urgência | MF-04, MF-12, MF-22 | D | A fazer |
| R-03 | Folha "Nova anotação" de uma etapa | MF-08, MF-20, MF-06 | E | A fazer |
| R-04 | Fila única de avisos e regra para o mascote | MF-02, MF-20 | B | Feito (fase B) |
| R-05 | Abertura curta e só quando agrega | MF-03 | B | Feito (fase B) |
| R-06 | Saúde honesta: panorama por estado | MF-05, MF-15 | B | Feito (fase B) |
| R-07 | Entrada monetária à prova de engano | MF-06 | E | A fazer |
| R-08 | Ajuda contextual com ícone ⓘ | MF-07 | B | Feito (fase B) |
| R-09 | Planejar: acerto de contas em linha | MF-12, MF-09 | E | A fazer |
| R-10 | Estados das metas e caixinhas | MF-16 | B/E | Parcial (B: metas; caixinhas e movimento na E/F) |
| R-11 | Componentes de seleção unificados | MF-09 | E | A fazer |
| R-12 | Diálogos e leitores de tela | MF-10 | B | Feito (fase B) |
| R-13 | Papel do dourado e limites visíveis | MF-11, MF-13 | C/E | A fazer |
| R-14 | Sistema tipográfico próprio | MF-14 | C | A fazer |
| R-15 | Gráficos com base mínima | MF-15 | E | A fazer |
| R-16 | Ajustes para 320 px | MF-19 | E | A fazer |

### Relatório 01 (celular): movimento (MM)
| ID | Elemento · onde | Fase | Situação |
|---|---|---|---|
| MM-01 | Marca (moeda) e conteúdo · Abertura | F | A fazer |
| MM-02 | Conteúdo da aba · Barra inferior | F | A fazer |
| MM-03 | Folha "Nova anotação" · Global | F | A fazer |
| MM-04 | (não existe no relatório: a numeração pula de MM-03 para MM-05) | n/a | Descartado: item inexistente |
| MM-05 | Chip de conta / categoria · Folha Anotar | F | A fazer |
| MM-06 | Saldo animado e linha nova ao salvar ("Gasto anotado · Desfazer") | F | A fazer |
| MM-07 | Campo com erro · Formulários | F | A fazer |
| MM-08 | Linha excluída + aviso · Listas | F | A fazer |
| MM-09 | Item da agenda pago · Planejar / Início | F | A fazer |
| MM-10 | Números principais · Início / Saúde | F | A fazer |
| MM-11 | Barras e linhas dos gráficos · Saúde | F | A fazer |
| MM-12 | Seções recolhíveis · Global | F | A fazer |
| MM-13 | Diálogo de confirmação · Global | F | A fazer |
| MM-14 | Avisos (fila única) · Global | F | A fazer |
| MM-15 | Resposta e "Ver no app" · Perguntar | F | A fazer |
| MM-16 | Pote da meta · Metas | F | A fazer |

### Relatório 02 (computador): problemas (DF)
| ID | Prioridade | Problema | Fase | Situação |
|---|---|---|---|---|
| DF-01 | P1 | Layout de telefone esticado na tela do computador | G | A fazer |
| DF-02 | P1 | Ações globais nos cantos da janela, longe do conteúdo | G | A fazer |
| DF-03 | P1 | Nenhum estado de hover | B (básico) / H | Parcial (B: hover básico; completo na H) |
| DF-04 | P1 | Rolagem excessiva e ação importante fora da dobra | G | A fazer |
| DF-05 | P1 | Panorama da Saúde declara "saudável" sem dados | B (D1) | Feito (fase B) |
| DF-06 | P2 | Barra de navegação inferior (padrão de telefone) | G | A fazer |
| DF-07 | P2 | Teclado: foco visível, mas fluxo lento e diálogos sem contenção | B (diálogos) / H | Parcial (B: diálogos; atalhos na H) |
| DF-08 | P2 | Diálogos e formulário em formato de telefone | G | A fazer |
| DF-09 | P2 | Listas sem estrutura de tabela | G/H | A fazer |
| DF-10 | P2 | Instruções de instalação de Android mostradas no computador | B | Feito (fase B) |
| DF-11 | P2 | Gráficos estreitos e sem interação de mouse | G/H | A fazer |
| DF-12 | P2 | Abertura de 4,1 s também no computador | B | Feito (fase B) |
| DF-13 | P2 | Contraste insuficiente de limites de controle | B | Feito (fase B) |
| DF-14 | P3 | Escala tipográfica idêntica à do telefone | C/G | A fazer |
| DF-15 | P3 | Repetição de valores e lista duplicada | G | A fazer |

### Relatório 02 (computador): recomendações (RD)
| ID | Recomendação | Resolve | Fase | Situação |
|---|---|---|---|---|
| RD-01 | Layout de aplicação com barra lateral e grade de 12 colunas | DF-01, DF-06 | G | A fazer |
| RD-02 | Ações globais na barra lateral | DF-02 | G | A fazer |
| RD-03 | Início em painel de duas colunas | DF-04, DF-15 | G | A fazer |
| RD-04 | Painel lateral de anotação (não modal) | DF-08, DF-07 | G | A fazer |
| RD-05 | Dinheiro em mestre-detalhe (com Investimentos) | DF-01, DF-09 | G | A fazer |
| RD-06 | Anotações como tabela ordenável | DF-09 | H | A fazer |
| RD-07 | Saúde em grade com panorama horizontal | DF-04, DF-05, DF-11 | G | A fazer |
| RD-08 | Planejar em duas colunas | DF-04, DF-15 | G | A fazer |
| RD-09 | Estados de interação para mouse | DF-03 | H | A fazer |
| RD-10 | Teclado de primeira classe (atalhos completos, D5) | DF-07 | H | A fazer |
| RD-11 | Diálogos centralizados | DF-08 | G | A fazer |
| RD-12 | Conteúdo sensível à plataforma | DF-10 | B | Feito (fase B) |
| RD-13 | Gráficos para mouse e telas largas | DF-11 | H | A fazer |
| RD-14 | Escala tipográfica do computador | DF-14 | C/G | A fazer |

### Relatório 02 (computador): movimento (MD)
| ID | Elemento | Fase | Situação |
|---|---|---|---|
| MD-01 | Linhas, cartões, botões, itens da barra lateral | F/H | A fazer |
| MD-02 | Anel de foco | F/H | A fazer |
| MD-03 | Painel lateral "Nova anotação" (460 px) | F/G | A fazer |
| MD-04 | Indicador da seção ativa | F/G | A fazer |
| MD-05 | Dica ao passar o mouse (tooltip) | H | A fazer |
| MD-06 | Nova linha + valores | F | A fazer |
| MD-07 | Linhas ao ordenar | H | A fazer |
| MD-08 | Filtros | H | A fazer |
| MD-09 | Painel de detalhe (mestre-detalhe) | G | A fazer |
| MD-10 | Diálogo centralizado | G | A fazer |
| MD-11 | Gráficos (barras/linhas) + dica | H | A fazer |
| MD-12 | Aviso (fila única) | F | A fazer |
| MD-13 | Item "Precisa de você" pago | F | A fazer |
| MD-14 | Abertura do aplicativo | F | A fazer |
| MD-15 | Recolher / expandir a barra lateral (1024 a 1279 px) | G | A fazer |

## Matriz de preservação
PF-01 a PF-50 (celular) e PD-01 a PD-34 (computador): cada função de hoje, onde ficou e como foi testada. Arquivo `docs/redesign/MATRIZ_PRESERVACAO_VERIFICADA.md`, preenchido a partir da Fase D (quando as funções mudam de lugar) e fechado na Fase I.
