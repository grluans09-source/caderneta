# Avaliação do projeto

**Data:** 6 de novembro de 2026 · **Versão avaliada:** 1.0.0 · **Situação:** beta fechado, pronto para teste com pessoas reais. *(Avaliação histórica da 1.0.0: os números abaixo são daquela versão; a 1.8.0-beta.1 tem 17 arquivos de teste e 490 verificações, e as telas foram reorganizadas conforme o MAPA-DO-APP.)*

## 1. Resumo em poucas linhas

- **O núcleo é sólido e bem testado.** O motor contábil fecha (débito = crédito em todo lançamento, ativo − passivo = PL, dinheiro = livre + guardado) e isso é conferido por teste automático.
- **O maior risco não está no código: está no uso real.** O app nunca foi usado por outra pessoa num celular de verdade. Todos os testes rodam em computador (jsdom).
- **O segundo risco são os dados.** Ficam só no navegador de cada aparelho; o único backup é manual.
- **Recomendação:** antes de qualquer função nova, fazer um **teste de campo** com 3 a 5 pessoas (um idoso, um jovem, alguém na correria) por 1 a 2 semanas. Veja `ROTEIRO.md`.

## 2. Números (medidos, não estimados)

| Item | Valor |
|---|---|
| Tamanho do app | 175 KB em **1 arquivo** (`app/index.html`) |
| Linhas | 2.409 no total: **~308 de CSS** e **~2.065 de JavaScript** |
| Funções | 172 · ações de tela: ~89 |
| Dependências do app | **0** (nada de internet para funcionar) |
| Testes automáticos | **15 arquivos, 470 verificações**, rodam em menos de 1 minuto (`npm test`) |
| Versões publicadas até aqui | 16 (todas viram a **1.0.0** consolidada) |
| Desempenho (computador, 10.000 anotações) | telas abrem em **30 a 80 ms**; busca digitando: **~9 ms**; salvar uma anotação: **~50 ms** |
| Espaço de dados | ~150 bytes por anotação simples ⇒ **10.000 anotações ≈ 1,4 MB**; limite típico do navegador ~5 MB ⇒ **~34 mil anotações**. Quem anota 10 por dia gasta ~0,5 MB por ano (**~9 anos de folga**) |

> No celular, espere de 3 a 6 vezes mais tempo que no computador: mesmo assim, folgado (menos de meio segundo no pior caso medido). Para repetir a medição: `node tools/medir-desempenho.js`.

## 3. O que está pronto e o que falta

Legenda: ✅ completo · ◐ parcial · ❌ não existe

| Área | Situação | Observação |
|---|---|---|
| Anotar gasto, ganho, transferência e compra de bem | ✅ | Duas colunas (de onde saiu / para onde foi) e prévia em frase simples |
| Editar e apagar anotação | ✅ | **Sem "desfazer"**: apagar é definitivo (com aviso) |
| Contas, cartão (fecha/vence/limite), parcelas e fatura | ✅ | Ciclo do cartão testado nos casos difíceis (virada de ano, fevereiro, etc.) |
| Pagar dívida com juros | ✅ | O valor dos juros é **informado pela pessoa** (o app não calcula) |
| Dinheiro com pessoas (emprestei / devo) | ✅ | Data de cobrança; perdoar vira gasto |
| Contas fixas (assinatura, plano, seguro) | ✅ | Confirmadas pela pessoa; **sem notificação** com o app fechado |
| Caixinhas e metas do mês | ✅ | Só organização pessoal; dinheiro real, por conta |
| Bens (carro, casa, TV) | ✅ | Valorização/desvalorização por **estimativa** da pessoa |
| Simulador "e se eu comprar" | ✅ | Modelo simples (renda média × compromissos); é referência, não conselho |
| O que pagar no mês (com setas) | ✅ | |
| Anotações com busca, ordem e filtros | ✅ | 15 por vez |
| Relatórios | ◐ | Só por mês; sem comparação entre meses/ano, sem rosca por categoria |
| Backup e restauração | ✅ | **Manual** (arquivo `.json`); há lembrete após 30 dias |
| Exportar para planilha/PDF | ❌ | |
| Notificações e lembretes | ❌ | Exige servidor; alternativa estudada: exportar vencimentos para o calendário do celular |
| Sincronizar entre aparelhos | ❌ | Exige login e servidor (decisão adiada: só depois de uso real) |
| Bloqueio por senha/PIN | ❌ | Quem abre o app no celular desbloqueado vê tudo |
| Receitas que se repetem (salário fixo) | ❌ | Hoje só gastos fixos |
| Ajuda embutida / tour guiado | ◐ | Só os "primeiros passos" (contas e cartão); "Como ler a balança" |
| Acessibilidade | ◐ | Letra grande/enorme, contraste, tema escuro, "Movimento: Parado", rótulos nos botões. **Sem auditoria com leitor de tela** |
| Instalável e sem internet (PWA) | ✅ | Falta conferir no iPhone e no Android reais |

## 4. Qualidade do código

### Pontos fortes
- **Regras importantes protegidas por teste**: invariantes contábeis, ciclo do cartão, FIFO de pagamento, caixinhas por conta, bens e juros.
- **Entrada de dados desconfiada**: `higienizar()` valida tudo que vem do armazenamento e de backups; item inválido é descartado e uma cópia do original é guardada.
- **Segurança de texto**: o teste `15-seguranca-textos-maliciosos` coloca HTML malicioso em nomes de contas, categorias, bens, pessoas, caixinhas, contas fixas, descrições e em um backup adulterado, e percorre todas as telas e janelas: **nada foi injetado nem executado**.
- **Sem dependências**: nada para atualizar, nada que quebre sozinho, nada que vaze dado para terceiros.
- **Vocabulário protegido por teste**: uma varredura procura jargão ("gaveta", "lançamento", "projeção"…) em todas as telas.

### Dívidas técnicas (por ordem de importância)
1. **Arquivo único de 2.400 linhas** (na época desta avaliação; hoje ~3.300). Funciona e é simples de publicar, mas está perto do ponto em que mexer fica lento. *Gatilho para dividir:* passar de ~3.500 linhas ou entrar mais gente no projeto. *Como:* pasta `src/` em módulos + um script que gera o `app/index.html` único (os testes continuam iguais).
2. **Telas como texto HTML + estado global.** Cada tela é uma função que monta uma string e `desenhar()` refaz tudo. É simples e rápido o suficiente, mas qualquer ajuste de foco/animação exige cuidado (já houve casos: busca perdendo o foco, animação da balança repetindo).
3. **Nomes internos antigos** (`modalGaveta`, `data-a="gaveta"`): na tela já é "conta". Renomear só com os testes rodando.
4. **Funções longas** (`desenharFolha`, `telaInicio`, `pagarNoMes`) e **estilos inline repetidos**. Não causam erro, só dificultam mudanças.
5. **Cálculos refeitos a cada desenho** (saldos varrem todas as anotações). Medido como folgado até 10 mil anotações; pode virar cache se algum dia passar disso.
6. **Sem migração formal de dados.** Mudanças no formato dependem de `higienizar()` ser tolerante. Se um dia o formato mudar de forma incompatível, é preciso criar um passo de migração (ver `ROTEIRO.md`).
7. **Sem política de segurança de conteúdo (CSP)** no HTML. Como o app não carrega nada de fora, o risco é baixo, mas é uma proteção extra barata (ver roteiro).

## 5. Avaliação contábil

**Correto e protegido por teste**
- Partida dobrada em todos os tipos de lançamento (gasto, ganho, transferência, bem, ajuste de valor).
- Pagar fatura **não** é gasto novo; pagar dívida com juros separa principal e juros.
- Comprar bem **não** reduz o patrimônio; a perda de valor é registrada à parte e **não** entra em "Saiu".
- Caixinhas ficam **fora** do razão (só organização), então não distorcem patrimônio nem balancete.
- Balancete do modo contador fecha com bens e ajustes.

**Limitações assumidas (são decisões, não erros)**
- Só **competência** (a despesa nasce na data da compra); o regime de caixa foi retirado por confundir.
- **Juros** de financiamentos são informados pela pessoa a cada pagamento (cada banco calcula de um jeito).
- **Valorização/desvalorização** é estimativa por taxa anual escolhida; a pessoa pode corrigir o valor quando quiser.
- Sem moedas estrangeiras, sem investimentos complexos, sem imposto.
- Sem fechamento de mês: editar uma anotação antiga recalcula tudo (é o desejado para uso pessoal).

**Pontos de atenção**
- **Apagar com cascata é irreversível** (conta, bem e pessoa apagam também as anotações ligadas). O aviso é claro, mas não existe "desfazer".
- Anotação de **estorno/devolução** no cartão funciona (entra na conta de dívida como pagamento), mas não tem tela própria: a pessoa precisa saber anotar como "Recebi" na conta do cartão.

## 6. Avaliação de uso (UX)

**Fortes:** um assunto por tela; botões grandes; prévia que explica o efeito em frase simples; balança com legenda e "Como ler"; letra grande; vocabulário comum; avisos claros antes de apagar.

**Preocupações**
- **A tela Início é longa** (frase, balança, legenda, resumo, o que pagar, avisos, cofres, metas, últimas anotações). Para o público mais velho ou mais apressado pode ser demais. *Ideia:* "Modo simples" que mostra só o essencial (ver roteiro).
- **Muitos conceitos para quem está começando**: contas, bens, pessoas, caixinhas, metas, contas fixas. O primeiro uso ensina só contas e cartão. *Ideia:* tour curto e dicas na primeira visita de cada área.
- **Caixinha × meta**: duas coisas parecidas (cofre × balde). Os nomes e visuais ajudam, mas precisa ser observado em uso real.
- **Nunca visto num celular real**: alvos de toque, teclado numérico, rolagem e fluidez das animações em aparelhos simples ainda são hipóteses.

## 7. Segurança e privacidade

| Tema | Situação |
|---|---|
| Dados saem do aparelho? | **Não.** Sem servidor, login, análise de uso ou anúncios |
| Texto malicioso (XSS) | Testado em todas as telas; **nada foi executado** |
| Backup adulterado | Itens inválidos são descartados; ids perigosos rejeitados |
| Dados em repouso | `localStorage` **sem criptografia** e sem senha. Quem usa o celular desbloqueado vê tudo |
| Por endereço | Os dados pertencem ao **endereço do app**. Trocar de endereço (ex.: ir para o Cloudflare Pages) **começa vazio**: é preciso guardar e recuperar uma cópia |
| iPhone/Safari | O Safari pode **apagar dados de sites** que ficam muito tempo sem uso quando o app **não foi instalado** na tela inicial. O app pede armazenamento persistente (`storage.persist()`), mas isso não é garantido. *Mitigação:* orientar a instalar na tela inicial e guardar cópias |
| Repositório | Público hoje. Contém só código e documentação (nunca dados). Pode virar privado quando migrar a hospedagem (ver `PUBLICACAO.md`) |

## 8. Confiabilidade e processo

- ✅ Testes automáticos agora **dentro do repositório** e rodando também no GitHub (bloqueiam a publicação se falharem).
- ❌ Não há teste em navegador real, em celular, em Safari, nem **teste visual** (animações, layout, toque).
- ❌ Sem auditoria de acessibilidade com leitor de tela (TalkBack/VoiceOver).
- ✅ Publicação reversível: voltar para uma versão anterior é um `git revert` (ver `PUBLICACAO.md`).
- ⚠ Antes de hoje, os testes existiam **só no computador de trabalho** (fora do Git). Isso foi corrigido nesta organização.

## 9. Riscos priorizados

| # | Risco | Chance | Impacto | O que fazer |
|---|---|---|---|---|
| 1 | Problemas só aparecem no celular real (toque, teclado, desempenho, instalação no iPhone) | Alta | Alto | Teste de campo com 3 a 5 pessoas e 2 aparelhos (Android e iPhone) |
| 2 | Perda de dados (limpar navegador, trocar de celular, Safari apagar) | Média | Alto | Reforçar o lembrete de backup; orientar instalar na tela inicial; considerar backup automático por compartilhamento |
| 3 | Pessoa não entende algum conceito (caixinha × meta, bens) | Média | Médio | Tour curto, dicas na primeira visita, "Modo simples" |
| 4 | Apagar por engano sem "desfazer" | Média | Médio | Lixeira ou "desfazer" por alguns segundos |
| 5 | Arquivo único cresce demais | Baixa agora | Médio | Dividir em módulos quando passar de ~3.500 linhas |
| 6 | Mudança de endereço apaga dados dos usuários | Certa (se migrar) | Alto | Plano de migração com aviso e botão de cópia (ver `PUBLICACAO.md`) |
| 7 | Ninguém consegue abrir o app sem internet na primeira vez | Baixa | Baixo | Já abre sem internet depois da primeira visita; documentar |

## 10. Veredito

O app está **funcionalmente completo para o que foi pedido** e o motor de contas é **confiável** (provado por testes, desempenho e segurança medidos). O que falta para chamá-lo de "pronto para todo mundo" não é código novo: é **prova no mundo real**. O próximo passo certo é distribuir a 1.0.0 para um grupo pequeno, observar, e só então priorizar o que construir (veja `ROTEIRO.md`).
