# Histórico de versões

Formato: versão semântica (`MAIOR.MENOR.CORREÇÃO`). Cada versão diz **o que mudou para a pessoa que usa**.
Antes da 1.0.0 as versões eram numeradas só pelo nome do cache do app (v1 a v16); estão aqui como marcos de desenvolvimento.

## [1.11.0-beta.1]: 7 de novembro de 2026 · Gráficos, Relatórios de consultor, paleta preto/dourado/branco e acerto de contas
- **Nova aba Gráficos** com **9 indicadores** de finanças pessoais, cada um com selo (Saudável, Atenção, Alerta), valor, gráfico e leitura em uma frase: O que é seu de verdade (patrimônio), Folga para os próximos 30 dias, Reserva de emergência (meses), Taxa de poupança, Peso das dívidas, Quanto da renda já tem dono, Para onde vai o dinheiro, De que é feito o que você tem e Custo dos juros e multas.
- **Relatórios agora são de consultor.** Um relatório por indicador, com 5 partes: O que é · Como você está (com os números da pessoa) · Para comparar (faixas de referência) · O que isso quer dizer · Por onde começar. A tela abre com um **panorama** e lista primeiro o que está em alerta. Dá para compartilhar o relatório como texto. Texto automático e educativo; não substitui um profissional.
- **Barra de baixo** com 7 espaços: Início, Dinheiro, Planejar, **+**, **Gráficos**, **Relatórios**, Mais. Com letra grande, só a aba aberta mostra o nome (os outros ficam só com o ícone e nome para leitor de tela).
- **Paleta preto, dourado e branco.** O que é **clicável** é dourado (botões, o +) ou tem **contorno dourado** e seta ›; o que está **selecionado** fica **preto** com texto dourado (no tema escuro, creme). Capa e barra pretas, fundo branco quente, cartões brancos. Cores com significado continuam: bordô = saiu/dívida, azul = entrou, ardósia = transferência, ametista = guardado, cobre = bens. Ícone e cor da barra do celular atualizados.
- **Planejar harmonizado.** Três partes com título: **Ferramentas** (4 botões com ícone e seta), **Acerto de contas do mês** (cartão preto com ouro) e **Agenda**. No cartão, **"Abrir o acerto de contas"** mostra **todas as dívidas e contas fixas do mês**, cada uma com **Pagar** (ou **Paguei**); o que já foi pago aparece embaixo. A agenda segue como visão rápida.
- Testes: 590 verificações em 20 arquivos.

## [1.10.0-beta.1]: 7 de novembro de 2026 · anotar em dois toques, listas curtas e conta Dinheiro com cédulas
- **Anotar em dois toques.** O botão **+** agora **gera 4 bolinhas com animação** (saem do botão em leque): **Gastei** (bordô), **Recebi** (azul), **Transferi entre contas** (ardósia) e **Comprei um bem** (cobre). O 1º toque gera as bolinhas, o 2º escolhe o tipo e abre a folha já nesse tipo. Tocar fora, no × ou em Esc fecha. (Substitui as 2 bolinhas fixas da 1.9.0.)
- **Folha de anotar mais curta.** Saíram os 4 botões de tipo do topo. No lugar, **3 bolinhas** (os outros 3 tipos) no canto do cabeçalho, para trocar de tipo; o título mostra o tipo atual.
- **Listas curtas com busca.** "De onde saiu" mostra a **Dinheiro + 3 contas** e "Para onde foi" mostra **5 categorias** (as mais usadas), cada uma com um campo de **busca** que olha todas. As 3 contas são as **favoritas** que a pessoa escolhe ("★ Escolher minhas 3 favoritas"); sem escolha, valem as mais usadas.
- **Conta Dinheiro (a carteira).** Todo app novo já nasce com a conta **Dinheiro**; ela **não pode ser apagada**, só alterada. Dá para **contar as cédulas** de R$ 2, 5, 10, 20, 50, 100 e 200 (o saldo passa a valer o que foi contado, com confirmação). Contas antigas chamadas "Carteira" ou "Dinheiro" viram a carteira sozinhas.
- **Sugestão de reais inteiros.** Ao anotar um valor com centavos na conta Dinheiro (ex.: R$ 3,25), o app **sugere arredondar**: "Para R$ 4,00", "Para R$ 3,00" ou "Manter R$ 3,25", para o saldo do dinheiro vivo não carregar moedas perdidas.
- Novo teste de 44 verificações; testes antigos ajustados (548 verificações em 19 arquivos).

## [1.9.0-beta.1]: 7 de novembro de 2026 · anotação rápida: bolinhas Gastei e Recebi
> *Histórico: as 2 bolinhas fixas foram substituídas na 1.10.0 pelo menu de 4 bolinhas que o botão + gera (D43).*
- **Problema:** os botões "Gastei" e "Recebi" do Início pareciam texto, não botão, e só existiam nessa tela.
- **Solução:** viraram **duas bolinhas na barra de baixo, sobre o botão + Anotar**: uma **bordô (Gastei)** e uma **azul (Recebi)**, com o nome escrito dentro. Aparecem em **todas as telas**, então dá para anotar logo ao abrir o app, sem procurar. Tocar numa bolinha abre a folha de anotar **já escolhida** em Gastei ou Recebi.
- O botão **+ Anotar** do meio continua igual. Os botões saíram do Início (um só lugar).
- As cores seguem a regra da D40: saiu = bordô, entrou = azul. Com letra Enorme as bolinhas ficam um pouco menores.
- Novo teste (517 verificações em 19 arquivos).
- **Documentação revisada**: README, roteiro, arquitetura, decisões e guia dos testadores atualizados; `PLANO-BETA.md` e `AUDITORIA-FUNCOES.md` marcados como históricos; regra "Git sempre em dia" no CLAUDE.md.

## [1.8.2-beta.1]: 7 de novembro de 2026 · mapa de cores da aba Planejar
A aba Planejar ganhou uma organização por cor, seguindo a regra "uma cor, um significado":
- **As 4 ferramentas** têm uma faixa na cor do assunto: Metas do mês = bordô (limite do que sai), Caixinhas = ametista (guardado), Contas fixas = ardósia (compromisso fixo), Simulador = cobre (compra de bem).
- **"Falta pagar"**: o cartão tem uma faixa bordô (tudo o que sai), e cada linha leva a cor do tipo (dívida em bordô, conta fixa em ardósia).
- **Agenda**: cada conta tem a faixa do tipo (dívida = bordô, conta fixa = ardósia, a receber = azul safira) e uma **legenda** acima. A **data** mostra a urgência: pintada = vence hoje ou já passou; clara = vence em até 3 dias; sem destaque = mais longe.
- Novas cores de significado fixo: ametista e cobre agora existem como variáveis do app (claro e escuro).
- Novos testes (503 verificações em 18 arquivos).

## [1.8.1-beta.1]: 7 de novembro de 2026 · Planejar com as ferramentas sempre à vista
- **Problema:** com muitas contas a pagar, as ferramentas (Metas, Caixinhas, Contas fixas, Simulador) ficavam lá embaixo, depois da agenda.
- **Solução:** as 4 ferramentas agora ficam **no topo** da tela Planejar, em 4 botões compactos. O cartão do mês lista até 5 contas (e diz "e mais N"), e a **agenda mostra só 4** com o botão **"Ver todas (N)"** / "Mostrar menos". Ao voltar à tela, a agenda volta recolhida.
- Novo teste (497 verificações em 18 arquivos).

## [1.8.0-beta.1]: 7 de novembro de 2026 · só a interface Balança, paleta nova e revisão
- **Apagados os jeitos Razão e Cofre e fluxo** (pedido do dono, D39). Fica só a interface Balança. Sem escolha de jeito em Ajustes; os Primeiros passos voltam a 3 passos. Quem tinha escolhido outro jeito volta sozinho para a Balança, sem perder dados.
- **Paleta nova, de luxo contábil**: azul-noite, marfim e ouro. O **verde saiu do app** (confundia com "selecionado"). Agora cada cor tem um só significado: **azul safira** = entrou e dinheiro para usar; **bordô** = saiu e dívida; **ametista** = guardado nas caixinhas; **cobre** = bens; **ouro** = é meu de verdade; e **ouro com fundo claro** = item selecionado.
- Ícone do app, cor da barra do celular e tela de abertura atualizados para a paleta nova.
- **Inconsistências corrigidas**: a legenda da balança agora explica todas as moedas (faltava "Meus bens", e "O que eu tenho" somava o que as moedas azuis não mostravam); no cartão, "Livre" virou "Disponível" (o app já usava "para usar" para o dinheiro); as abas do Dinheiro cabem numa linha e nomes longos de conta não são mais cortados; o número grande do Início encolhe em vez de quebrar.
- Documentação atualizada (README, arquitetura, avaliação).

## [1.7.1-beta.1]: 6 de novembro de 2026 · conferência final dos 3 jeitos
> *Histórico: esta versão tinha os jeitos Razão e Cofre e fluxo, **removidos na 1.8.0 (D39)**.*
Conferência com letra **Enorme**, tema **escuro** e **Movimento** parado e vivo, em tela de celular (375 px), nos 3 jeitos, em 16 telas (Início, 4 abas do Dinheiro, Planejar, Metas, Caixinhas, Contas fixas, Simulador, Mais, Anotações, Relatórios, Ajustes e a folha de Anotar):
- **Corrigido:** no jeito Razão, com letra Enorme, as duas páginas do livro passavam da largura da tela. Agora, com letra Enorme, as páginas ficam uma embaixo da outra.
- **Corrigido:** o número grande do Início quebrava no meio ("R$ 102.930,0" e "0" em outra linha). Agora ele encolhe para caber.
- **Corrigido:** nomes de conta muito longos cortavam o texto dentro dos cofres. Agora o cofre cresce.
- Depois das correções: nenhuma tela passa da largura (0 problemas nas 96 combinações de jeito, tema e tela conferidas com letra Enorme) e não houve erro no console.

## [1.7.0-beta.1]: 6 de novembro de 2026 · escolha do jeito na primeira abertura
> *Histórico: esta versão tinha os jeitos Razão e Cofre e fluxo, **removidos na 1.8.0 (D39)**.*
- Os **Primeiros passos** agora têm 4 passos. O 2º é **"Escolha seu jeito de usar"**, com uma miniatura de cada jeito (Balança, Razão, Cofre e fluxo). A barra de baixo já muda na hora e a escolha fica salva. Dá para trocar depois em Ajustes.
- Novo teste (561 verificações em 22 arquivos).

## [1.6.0-beta.1]: 6 de novembro de 2026 · Mais, Anotações, Relatórios e Ajustes nos 3 jeitos
> *Histórico: esta versão tinha os jeitos Razão e Cofre e fluxo, **removidos na 1.8.0 (D39)**.*
- **Mais:** Balança (cartões), Razão (vira o **Índice** do livro, com a linha pontilhada e o resumo de cada item) e Cofre e fluxo (peças em forma de cofre).
- **Anotações:** na Razão as linhas ficam em itálico, como num livro-caixa; no Cofre ganham uma faixa dourada na lateral.
- **Relatórios:** na Razão as barras ficam tracejadas; no Cofre viram canos (vermelho para o que saiu, verde para o que veio).
- **Ajustes:** na Razão os grupos viram "Capítulo 1, 2, 3"; no Cofre ganham um pequeno cano antes do título.
- Novo teste (549 verificações em 21 arquivos).

## [1.5.0-beta.1]: 6 de novembro de 2026 · Anotar nos 3 jeitos
> *Histórico: esta versão tinha os jeitos Razão e Cofre e fluxo, **removidos na 1.8.0 (D39)**.*
- **Razão:** a folha de anotar vira páginas de livro ("Escrever no livro"; "Corrigir no livro" ao editar), com linhas de caderno e margem dourada.
- **Cofre e fluxo:** a folha vira "Mover o dinheiro". Cada conta aparece como um cofre com o nível do que tem (dívidas em vermelho) e as colunas perguntam "De qual cofre sai" e "Para qual cofre vai". O fio que liga as duas colunas fica mais grosso, como um cano.
- **Balança:** igual a antes.
- Novo teste (537 verificações em 20 arquivos).

## [1.4.0-beta.1]: 6 de novembro de 2026 · jeitos em Planejar e Dinheiro
> *Histórico: esta versão tinha os jeitos Razão e Cofre e fluxo, **removidos na 1.8.0 (D39)**.*
- **Planejar / A pagar** nos 3 jeitos: Balança (cartão do mês), Razão (o mês como um livro com as páginas "A pagar" e "Já pago") e Cofre e fluxo (cada conta a pagar como um cano que se esvazia). Setas de mês, agenda e botões de pagar iguais nos três.
- **Dinheiro / Contas** nos 3 jeitos: Balança (linhas), Razão (livro das contas com as páginas "Tenho" e "Devo") e Cofre e fluxo (um cofre por conta, o guardado em roxo). As abas Dívidas, Bens e Pessoas continuam iguais.
- Novo teste (524 verificações em 19 arquivos).

## [1.3.0-beta.1]: 6 de novembro de 2026 · três jeitos de usar
> *Histórico: esta versão tinha os jeitos Razão e Cofre e fluxo, **removidos na 1.8.0 (D39)**.*
- Novo em **Ajustes > Aparência > Jeito de usar**: **Balança** (padrão), **Razão** e **Cofre e fluxo**. Cada jeito organiza o app de um modo (veja [JEITOS-DE-USAR.md](docs/JEITOS-DE-USAR.md)); os dados são os mesmos.
- **Início nos 3 jeitos**: Balança (com botões Gastei e Recebi), Razão (livro do mês com páginas Entrou e Saiu) e Cofre e fluxo (um cofre por conta, cartões em vermelho).
- A barra de baixo muda por jeito (Livro, Contas, A pagar; ou Cofres sem o botão Dinheiro). A capa tem cor própria em cada jeito.
- Ainda falta dar a cara de cada jeito às outras telas (ver docs/JEITOS-DE-USAR.md, etapas J2 a J7).
- Novo teste dos jeitos (508 verificações em 18 arquivos).

## [1.2.0-beta.1]: 6 de novembro de 2026 · app reorganizado (cada coisa em um lugar)
Segue o [mapa do app](docs/MAPA-DO-APP.md). Nenhuma função foi removida; o que mudou foi **onde cada coisa mora**:
- **Início enxuto**: balança com 3 linhas (o que eu tenho, o que eu devo, é meu de verdade), resumo do mês, **uma linha** "Falta pagar em ..." que leva ao Planejar, avisos, e só as 3 últimas anotações.
- **Planejar é a casa do "falta pagar"**: cartão do mês com setas e a agenda. Contas fixas virou só cadastro. **Metas do mês** ganhou tela própria.
- **Dinheiro em 4 abas**: Contas, Dívidas, Bens e Pessoas.
- **Relatórios sem repetição**: só "para onde foi", "de onde veio" e evolução.
- **Ajustes em 3 grupos**: Aparência, Dados e Ajuda (com "Como ler a balança").
- Cada tela abre com uma frase que diz para que serve. O botão "Usar o dinheiro guardado" passou para a tela Caixinhas.
- Novo teste do mapa (17); testes antigos ajustados aos novos lugares (490 verificações em 17 arquivos).

## [1.1.0-beta.1]: 6 de novembro de 2026 · primeira versão para testadores
- **Desfazer ao apagar**: ao apagar anotação, conta, bem, pessoa, conta fixa, caixinha ou categoria aparece o botão **Desfazer** por 8 segundos, e tudo volta como estava.
- **Lembrete de cópia mais cedo**: aparece no Início com 3 anotações e depois de 7 dias sem cópia (antes: 5 anotações e 30 dias).
- **Selo "beta"** na capa e novo cartão **"Ajude a melhorar"** em Ajustes: um toque abre o compartilhar do celular com um texto pronto (versão e aparelho) para a pessoa contar um problema ou ideia.
- **Caixinhas como no banco**: o dinheiro guardado continua na conta e continua sendo seu (o total não muda); só sai de "Dinheiro para usar agora". Em todas as telas a palavra "livre" virou "para usar" e os textos explicam isso.
- Novo teste de desfazer (476 verificações no total).

## [1.0.0]: 6 de novembro de 2026 · primeira versão completa e estável
Consolida tudo o que foi construído (marcos abaixo) e organiza o projeto:
- **Projeto organizado**: app em `app/`, testes em `tests/` (agora dentro do repositório), ferramentas em `tools/`, documentação em `docs/`, regras em `CLAUDE.md`.
- **Publicação automática com testes**: o GitHub só publica se todos os testes passarem.
- **Versão visível** em Ajustes ("Caderneta · versão 1.0.0") e dentro do arquivo de cópia dos dados.
- **Novo teste de segurança**: textos maliciosos em nomes e backups não conseguem injetar nada em nenhuma tela.
- Medição de desempenho (até 10.000 anotações) e de espaço de armazenamento registradas na avaliação.
- Sem mudança de comportamento para quem já usa o app. Os dados continuam compatíveis.

## Marcos de desenvolvimento (antes da 1.0.0)

**Marco 16 · Anotações com busca e filtros.** Tela de Anotações com busca, ordem por data, valor ou nome, filtros por tipo, período, conta e categoria, e "mostrar mais" de 15 em 15. A mesma lista aparece em Relatórios.

**Marco 15 · Cofres, setas de mês e conta do guardado.** Caixinhas aparecem no Início como cofres animados (moeda caindo, brilho). O cartão "O que pagar" ganha setas para ver os meses seguintes. Ao guardar numa caixinha, escolhe-se de qual conta sai o dinheiro; ao tirar, de qual conta liberar.

**Marco 14 · Guardado sai do "dinheiro que eu tenho".** O dinheiro guardado nas caixinhas deixa de contar como dinheiro livre (moedas roxas na balança) e volta ao tirar, com botão rápido no Início.

**Marco 13 · Caixinhas só com dinheiro real.** Caixinhas passam a olhar só o dinheiro que existe nas contas (sem dívidas) e saem da contabilidade. Corrigido: tela Planejar não abria com dívida sem data.

**Marco 12 · Quanto falta pagar no mês.** Cartão com o total do mês (cartão, contas fixas, dívidas com pessoas), já pago e lista, no Início, em Planejar e em Relatórios.

**Marco 11 · Bens sempre visíveis.** Bens sem valor ou vendidos continuam na lista para ajustar ou apagar.

**Marco 10 · Palavras comuns.** "Gaveta" vira "conta"; "Mudei de lugar" vira "Transferi entre contas"; "projeção" vira "previsão"; e outros. Apagar conta com anotações passa a ser permitido (com aviso).

**Marco 9 · Apagar bem e pessoa com anotações.**

**Marco 8 · Bem que ainda estou pagando.** Cadastro do saldo e das parcelas cria o bem e a dívida juntos.

**Marco 7 · Juros ao pagar dívida.** Só os juros viram gasto; o resto abate a dívida.

**Marco 6 · Meus bens.** Carro, casa, TV: compra de bem não reduz o "é meu"; valorização e desvalorização; venda com ganho ou perda; balança com moedas azuis.

**Marco 5 · Balança explicada.** Legenda e "Como ler a balança" corrigidos: o app conta dinheiro e bens, não objetos consumidos.

**Marco 4 · Planejamento.** Pessoas (emprestei / devo), contas fixas, caixinhas e metas, simulador "e se eu comprar", balança viva de latão, frases de autores reais na capa, gráfico com previsão de 6 meses, "R$" em todos os campos de valor, botão Salvar no fim do formulário.

**Marco 3 · Visual "livro-razão vivo".** Capa verde de livro-caixa, tela Anotar em duas colunas com fio dourado e carimbo, números que rolam, página virando nos relatórios, tema escuro "lamparina", opção "Movimento: Vivo ou Parado".

**Marco 2 · Dívida por vencimento.** Informar "190 vence este mês e 15 no próximo" em vez de um valor único.

**Marco 1 · Primeira versão.** Primeiros passos, anotar gasto/ganho/transferência, contas e cartão com fatura e parcelas, contas a pagar, relatórios, cópia dos dados, instalável e sem internet.

[1.0.0]: https://github.com/grluans09-source/caderneta/tree/v1.0.0
