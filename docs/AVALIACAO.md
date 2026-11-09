# Avaliação do projeto

**Data:** 7 de novembro de 2026 · **Versão avaliada:** 1.21.1-beta.1 · **Situação:** beta, pronto para teste com pessoas reais.
Esta avaliação substitui a da 1.0.0 (6 nov 2026). Ela junta o **passo 9 do plano: a auditoria completa** (estrutura, visual, harmonia, incoerências, cálculos e GitHub), pedida pelo dono e aprovada por ele item a item. Refaça esta página a cada auditoria; não deixe números velhos.

## 1. Resumo em poucas linhas

- **As contas fecham.** Uma auditoria com dados aleatórios (6 rodadas, cada uma com 180 anotações, cartão, empréstimo, pessoas, bens, aplicação, poupança, caixinhas e contas fixas) conferiu 12 regras em todas as telas e nas 53 respostas do chat: **nenhuma diferença**.
- **A auditoria achou 7 problemas reais e todos foram corrigidos na 1.21.1** (lista na seção 3). O mais sério: contar as cédulas da carteira e editar uma conta podiam **mudar o passado**.
- **O maior risco continua fora do código: o uso real.** O app ainda não foi usado por outra pessoa num celular de verdade. Tudo foi conferido em computador (jsdom e navegador em tamanho de celular).
- **O segundo risco são os dados**: ficam só no aparelho; a cópia de segurança é manual.
- **Próximo passo certo:** teste de campo com 3 a 5 pessoas (`GUIA-TESTADORES.md`). A conversa sobre venda fica para depois (pedido do dono).

## 2. Números (medidos, não estimados)

| Item | Valor |
|---|---|
| Tamanho do app | **357 KB** em **1 arquivo** (`app/index.html`) |
| Linhas | **4.242** no total na 1.21.1 (**~4.420** na 1.23.0): **~725 de CSS** e **~3.460 de JavaScript** |
| Funções | ~311 · ações de tela: ~108 |
| Dependências do app | **0** (nada de internet para funcionar; as notícias são opcionais) |
| Testes automáticos | **30 arquivos, 778 verificações** na 1.21.1 (780 na 1.21.2; 794 em 31 arquivos na 1.22.0; **842 em 32 na 1.23.0; 845 na 1.23.1; 872 em 33 na 1.24.0; 886 em 34 na 1.24.1; 947 em 36 na 1.25.0; 968 em 37 desde a 1.26.0, com o golden master do redesign**), ~80 segundos (`npm test`) |
| Desempenho (computador, 10.000 anotações) | abrir o app: **~250 ms**; telas: **5 a 90 ms** (Saúde é a mais pesada, ~100 ms); busca digitando: **~6 ms**; salvar uma anotação: **~50 ms** |
| Espaço de dados | ~150 bytes por anotação simples ⇒ **10.000 anotações ≈ 1,4 MB**; limite típico do navegador ~5 MB ⇒ **~34 mil anotações** (quem anota 10 por dia tem ~9 anos de folga) |

> No celular, espere de 3 a 6 vezes mais tempo que no computador: ainda abaixo de meio segundo no pior caso. Para repetir: `node tools/medir-desempenho.js`.

## 3. Auditoria da 1.21.1: o que foi conferido e o que mudou

### 3.1 O que foi conferido
| Frente | Como | Resultado |
|---|---|---|
| **Cálculos** | Script com dados aleatórios (6 rodadas): ativo − passivo = é meu; toda anotação com 2 partidas de mesmo valor; é meu = saldos iniciais + receitas − despesas + ajustes de bens; para usar + guardado = dinheiro nas contas; aplicações fora do "para usar"; resumo do mês; o que falta pagar = saldo da dívida; caixinha nunca negativa; um rendimento por mês e aplicação; cópia dos dados sem perda | **Nenhuma diferença** |
| **Telas sem erro** | 14 telas e 10 relatórios atrás de "NaN", "undefined", "Infinity" | Nenhum |
| **Layout** | 14 telas × 3 tamanhos de letra × 2 temas, procurando algo saindo da tela | **Nada vazando** |
| **Código morto** | Funções declaradas e nunca usadas | Nenhuma |
| **Vocabulário** | Palavras proibidas (gaveta, lançamento, débito…) em todas as telas e no chat | Nenhuma (o teste agora cobre Investir, Notícias e o chat) |
| **Visual** | Botão da pena aberto e fechado, edição de conta, agenda com conta atrasada no tema escuro (375×812) | Conferido no navegador |

### 3.2 Problemas encontrados e corrigidos (aprovados pelo dono: "Sim, tudo")
1. **Contar as cédulas mudava o passado.** O app mexia no saldo inicial da carteira; o "é meu" de meses atrás mudava. Agora a diferença vira **uma anotação de hoje** ("Diferença ao contar as cédulas").
2. **Editar uma conta mostrava o valor de quando ela foi criada** como se fosse o de hoje. Quem corrigisse ali mudava o passado (e podia dobrar o saldo). Agora, numa conta com anotações, o app mostra o **saldo de hoje só para ler** e indica o **Conferir com o banco**. No cartão, o texto deixa claro que a lista é do que já se devia **antes de usar o app** e mostra quanto se deve hoje.
3. **"Juros e multas" e "Dívidas não pagas" eram achadas pelo nome.** Renomear a categoria tirava os juros do relatório. Agora têm **código fixo** (`sis:"juros"`, `sis:"perdas"`), e os dados antigos ganham o código sozinhos.
4. **Data de conta atrasada** na agenda ficava com pouco contraste no tema escuro. Corrigido.
5. **Robô das notícias**: a fonte de notícias do IBGE às vezes recusa a primeira conexão. Agora tenta **3 vezes** antes de desistir; se falhar, o resto das notícias sai normalmente.
6. **CSS repetido e sem uso** (regras do botão da pena escritas três vezes e um estilo antigo inteiro) foi limpo.
7. **A ferramenta que mede a velocidade** (`tools/medir-desempenho.js`) tinha parado de funcionar quando Relatórios virou aba. Consertada; agora mede também Investir e Gráficos e avisa se ficar desatualizada de novo.

Também: o teste de vocabulário passou a varrer Investir, Notícias e as 53 respostas do chat (`tests/30-auditoria.test.js`), os documentos foram atualizados e a descrição do repositório no GitHub passou a dizer "Balancete".

## 4. O que está pronto e o que falta

Legenda: ✅ completo · ◐ parcial · ❌ não existe

| Área | Situação | Observação |
|---|---|---|
| Anotar gasto, ganho, transferência e compra de bem | ✅ | Pena → 4 bolinhas → folha curta com favoritas e busca |
| Travas de coerência | ✅ | Impede o impossível (cartão acima do limite, carteira negativa); pergunta "era isso?" no estranho |
| Editar e apagar anotação | ✅ | **Desfazer** por 8 segundos |
| Contas, cartão (fecha/vence/limite), parcelas e fatura | ✅ | Ciclo do cartão testado nos casos difíceis |
| Conferir com o banco | ✅ | A diferença vira anotação de hoje (contas e aplicações) |
| Pagar dívida com juros | ✅ | Juros informados pela pessoa; contados no relatório pelo código fixo |
| Dinheiro com pessoas | ✅ | Data de cobrança; perdoar vira gasto |
| Contas fixas e contas do ano | ✅ | Sem notificação com o app fechado |
| Caixinhas e metas do mês | ✅ | Caixinha pode render |
| Investimentos | ✅ | Rendimento por dia útil, sem feriados; IR/IOF acertados pelo Conferir |
| Bens | ✅ | Valorização/desvalorização por estimativa da pessoa |
| Simulador "e se eu comprar" | ✅ | Referência, não conselho |
| Saúde: 10 indicadores, relatórios e mês a mês | ✅ | Texto educativo automático (Gráficos e Relatórios juntos desde a 1.23.0) |
| Chat (63 perguntas prontas desde a 1.24.1; "Ver no app" no lugar exato) | ✅ | Sem internet e sem inteligência artificial |
| Notícias de fontes oficiais | ✅ | Banco Central, IBGE e ANP; atualiza ao meio-dia. Receita Federal: sem fonte em formato de dados |
| Cópia de segurança | ◐ | **Manual** (arquivo `.json`), com lembrete |
| Exportar para planilha/PDF | ❌ | |
| Lembretes com o app fechado | ❌ | Exige servidor; alternativa: exportar vencimentos para o calendário |
| Sincronizar entre aparelhos | ❌ | Exige login e servidor |
| Bloqueio por senha/PIN | ❌ | Quem abre o celular desbloqueado vê tudo |
| Receitas que se repetem (salário fixo) | ❌ | Hoje só gastos fixos |
| Acessibilidade | ◐ | Letra grande/enorme, tema escuro, "Movimento: Parado", rótulos. **Sem teste com leitor de tela** |
| Instalável e sem internet (PWA) | ✅ | Falta conferir no iPhone e no Android reais |

## 5. Qualidade do código

### Pontos fortes
- **Regras importantes protegidas por teste**: partidas dobradas, ciclo do cartão, pagamento das parcelas mais antigas primeiro, caixinhas por conta, bens, juros, rendimento por dia útil, travas.
- **Entrada desconfiada**: `higienizar()` valida o que vem do aparelho e de cópias; `noticiasValidas()` valida o arquivo de notícias; links só de sites oficiais.
- **Segurança de texto**: o teste 15 põe HTML malicioso em todos os nomes e numa cópia adulterada: **nada é executado**.
- **Categorias do sistema por código, não por nome** (`sis`: conferir, rendimentos, impostos de investimento, juros, dívidas não pagas).
- **Sem dependências** no app.

### Dívidas técnicas (por ordem de importância)
1. **Arquivo único de 4.242 linhas.** Passou do gatilho que a avaliação anterior tinha marcado (~3.500). Ainda funciona e os testes protegem, mas mexer está mais lento. *Proposta:* dividir em módulos numa pasta `src/` com um script que gera o `app/index.html` único (testes iguais). Fazer **depois do teste de campo**, para não mexer na estrutura enquanto pessoas testam.
2. **Telas como texto HTML + estado global**: `desenhar()` refaz tudo; foco e animação pedem cuidado.
3. **Nomes internos antigos** (`modalGaveta`, `data-a="gaveta"`, "caderneta" nos dados). Os dos dados **não podem** mudar (perda de dados).
4. **Funções longas** e estilos inline repetidos.
5. **Cálculos refeitos a cada desenho**. Folgado até 10 mil anotações (seção 2).
6. **Sem migração formal de dados**: as migrações (carteira, poupança, códigos de categoria) vivem dentro de `higienizar()`.
7. **Sem política de segurança de conteúdo (CSP)** no HTML. Risco baixo; proteção barata.

## 6. Avaliação contábil
Detalhe em `ANALISE-CONTABIL.md`.
- **Correto e testado**: partida dobrada em tudo; pagar fatura não é gasto novo; juros separados do principal; comprar bem não reduz o "é meu"; rendimento é receita financeira; IR/IOF é despesa; a conciliação ("Conferir com o banco") e a contagem de cédulas lançam a diferença **na data de hoje**, sem reescrever o passado (corrigido nesta auditoria).
- **Limitações assumidas**: só competência; juros de financiamento informados pela pessoa; valorização de bens por estimativa; sem moeda estrangeira; sem fechamento de mês.
- **De propósito**: o saldo inicial de uma conta só se edita enquanto ela não tem anotações; depois, só pelo Conferir com o banco.

## 7. Avaliação de uso (UX)
**Fortes:** um assunto por tela; botões grandes; prévia em frase simples; Mordomo e chat explicam sem jargão; letra grande; travas que explicam o porquê.
**Preocupações:** muitos conceitos para iniciantes (contas, bens, pessoas, caixinhas, metas, aplicações), em parte resolvido na 1.23.0 (interface em camadas, "?" nos termos, 6 abas; ver `AUDITORIA-INTERFACE.md`); nunca visto num celular real (toque, teclado numérico, fluidez em aparelho simples).

## 8. Segurança e privacidade
| Tema | Situação |
|---|---|
| Dados saem do aparelho? | **Não.** Sem servidor, login, análise de uso ou anúncios. As notícias só **chegam**: o arquivo do próprio site e, desde a 1.22.0, as notícias do IBGE pedidas direto ao IBGE, sem cookies e sem nenhum dado da pessoa (D62) |
| Texto malicioso (XSS) | Testado em todas as telas; nada executado |
| Cópia adulterada | Itens inválidos descartados; ids perigosos rejeitados |
| Dados em repouso | `localStorage` sem criptografia e sem senha |
| Por endereço | Trocar o endereço do app **começa vazio** (ver `PUBLICACAO.md`) |
| iPhone/Safari | Pode apagar dados de sites não instalados e sem uso; orientar instalar e guardar cópias |
| Repositório | Público; só código e documentos, nunca dados nem senhas |

## 9. Confiabilidade e processo
- ✅ Testes no repositório e no GitHub (bloqueiam a publicação se falharem).
- ✅ Robô das notícias ao meio-dia, que não bloqueia a publicação se uma fonte cair.
- ✅ Desempenho medido de novo nesta versão (`tools/medir-desempenho.js`).
- ❌ Sem teste em celular real, Safari ou leitor de tela.
- ⚠ O GitHub desliga o robô do meio-dia se o repositório ficar 60 dias sem envio.

## 10. Riscos priorizados
| # | Risco | Chance | Impacto | O que fazer |
|---|---|---|---|---|
| 1 | Problemas só aparecem no celular real | Alta | Alto | Teste de campo com 3 a 5 pessoas, Android e iPhone |
| 2 | Perda de dados (limpar navegador, trocar de celular) | Média | Alto | Lembrete de cópia; instalar na tela inicial |
| 3 | Pessoa não entende algum conceito | Média | Médio | Chat, tour curto, dicas na primeira visita |
| 4 | Arquivo único grande demais para mexer | Média | Médio | Dividir em módulos depois do teste de campo |
| 5 | Mudança de endereço apaga dados | Certa (se migrar) | Alto | Plano de migração com aviso e cópia (`PUBLICACAO.md`) |
| 6 | Uma fonte oficial muda o formato e a notícia some | Média | Baixo | O robô tenta 3 vezes e publica o resto; olhar a aba Actions. O IBGE recusa o robô (fora do Brasil): desde a 1.22.0 o celular busca as notícias do IBGE (D62) |

## 11. Veredito
O app está **completo para o que foi pedido** nos 9 passos do plano, e a auditoria mostrou que **as contas fecham**. Os problemas achados foram corrigidos e protegidos por teste. O que falta para "pronto para todo mundo" não é função nova: é **prova no mundo real**.
