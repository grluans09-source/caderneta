# Roteiro

Onde estamos: **versão 1.16.0-beta.1** (a 1.15.0 está publicada para testadores). App reorganizado (`MAPA-DO-APP.md`), com anotar em dois toques, conta Dinheiro com cédulas e paleta nova. **Ainda sem uso real por outras pessoas**: o que falta é pôr o app na mão de 3 a 5 pessoas (`GUIA-TESTADORES.md`).
Este documento diz **o que fazer a seguir, em que ordem e por quê**. Atualize-o a cada versão.

## Como priorizar
1. **Prova no mundo real vem antes de função nova.** Um problema de uso real vale mais que dez ideias.
2. Primeiro o que **protege os dados** das pessoas; depois o que **reduz confusão**; só então o que **acrescenta função**.
3. Cada item só está "pronto" quando passa na **definição de pronto** (no fim deste documento).

## Fase 0: agora (beta 1.9.x)
**Objetivo: descobrir o que as pessoas realmente sentem ao usar.**

| # | Tarefa | Como saber que acabou |
|---|---|---|
| 0.1 | **Teste de campo**: 3 a 5 pessoas (um idoso, um jovem, alguém na correria) usam por 1 a 2 semanas, em **Android e iPhone** | Lista de problemas observados, escrita em `docs/` (ex.: `TESTE-DE-CAMPO.md`) |
| 0.2 | Conferir **instalação na tela inicial** e **uso sem internet** nos dois sistemas | Passo a passo confirmado; problemas registrados |
| 0.3 | Conferir **guardar e recuperar cópia** em celular real (compartilhar arquivo, restaurar em outro aparelho) | Funciona nos dois sistemas |
| 0.4 | Roteiro de observação: pedir que cada pessoa faça 6 tarefas sem ajuda (anotar gasto, anotar cartão parcelado, ver quanto falta pagar, guardar numa caixinha, cadastrar um bem, achar uma anotação antiga) e anotar onde trava | Tempo e travas por tarefa |

## Fase 1: depois do teste de campo (1.1 a 1.x)
**Objetivo: proteger dados e reduzir confusão.** A ordem exata depende do que o teste mostrar.

| Prioridade | Item | Por quê | Esforço |
|---|---|---|---|
| ✅ 1.1.0-beta.1 | **Desfazer** ao apagar (8 segundos) | Feito; falta só `Zerar tudo` | Feito |
| Parcial | **Backup mais fácil**: lembrete a cada 7 dias (feito); falta botão "Guardar cópia" no Início quando fizer tempo; compartilhar direto por WhatsApp/e-mail | Perda de dados é o maior risco | Médio |
| Alta | **Migração de hospedagem** para o **Cloudflare Pages** (D33), com domínio próprio (D34), **aviso de mudança de endereço** e botão de cópia no endereço antigo. Só antes de vender | Plano em `PUBLICACAO.md` | Médio |
| ✅ 1.2.0 | **Início enxuto** (balança, resumo, uma linha "Falta pagar", avisos, 3 últimas anotações) | Feito; falta só confirmar com testadores se basta | Feito |
| ✅ 1.15.0 | **Passo 3 do plano (1ª parte)**: nome **Balancete**, o **Brasão** como logo e ícone, a abertura em que ele ganha vida e a **letra de contabilidade** com números alinhados (D54) | Feito; ver no celular se o ícone e o nome novos aparecem e se a abertura não incomoda | Feito |
| ✅ 1.16.0 | **Passo 3, 2ª parte**: o **Mordomo** é a balança do Início (sempre em equilíbrio, a cara mostra a situação, olhos que acompanham, reverência) e os **mascotes dos momentos** (Moedinha, Selo "PAGO", Pesinho, Pesão) | Feito; ver no celular se os mascotes agradam e não cansam | Feito |
| **Próximo (passo 4)** | Novo botão de anotar (algo que lembre anotação, sem a palavra ao lado) e o lugar da pílula "Perguntar" do chat | Decidir com o dono | Alta |
| ✅ 1.14.0 | **Passo 2 do plano**: análise contábil (`ANALISE-CONTABIL.md`) e as 4 funções escolhidas: conferir com o banco, contas do ano, mês a mês e custo fixo de vida | Feito; ver com testadores se "Conferir com o banco" é achado e entendido | Feito |
| **Depois (D53)** | Fluxo de caixa do mês ("sobrou 500 mas o banco caiu"), relatório para o Imposto de Renda (perto da declaração), etiquetas por projeto | Escolhidas para depois na análise contábil | Média |
| ✅ 1.13.1 | **Passo 1 do plano novo**: acerto de contas em janela preta e dourada, atrasada igual na agenda e no acerto, dica de instalar, + exatamente no canto | Feito; ver em celular real se a janela abre e fecha bem com o botão voltar | Feito |
| **Plano combinado (7 nov 2026)** | ~~2) análise contábil e sugestões~~ (feito na 1.14.0); ~~3) identidade~~ (feito na 1.15.0 e 1.16.0) nome, logo, mascote e venda sem custo; 4) novo botão de anotar e lugar do mascote; 5) chat do mascote com ~50 perguntas; 6) Investimentos (D50); 7) notícias de fontes oficiais; 8) auditoria completa | Cada passo é examinado e decidido com o dono antes de fazer | Em andamento |
| ✅ 1.13.0 | **Botão + no canto direito**, bolinhas em quarto de círculo, Relatórios fora do Mais, **conta Dinheiro criada para quem já usava o app** | Feito; conferir em celular real se o botão não atrapalha o polegar nem tapa conteúdo | Feito |
| ✅ 1.12.0 | **Visual vivo** (ícones cheios, formas redondas, abertura e animações), bolinhas em círculo, seletor de tipo na folha, busca com lista completa, 5 categorias favoritas | Feito; ver se as pessoas gostam do visual e se o Movimento Parado basta para quem prefere calma | Feito |
| **Próximo (desenho decidido, D50)** | **Investimentos**: caixinha presa a uma conta e rendendo (taxa anual, cálculo por dia útil, ajuste manual); **nova aba Investimentos** (poupança, CDB, Tesouro, fundos); pergunta dos Primeiros passos trocada por "Você tem dinheiro guardado ou investido?" | Hoje caixinha não rende e poupança é uma conta comum. O espaço na barra já foi liberado (D51); falta o resto do desenho | Alta |
| ✅ 1.11.0 | **Gráficos e Relatórios de consultor** (9 indicadores), paleta preto/dourado/branco, acerto de contas no Planejar | Feito; testar se os textos fazem sentido para as pessoas | Feito |
| ✅ 1.10.0 | **Anotar em dois toques**: o + gera 4 bolinhas; folha curta (Dinheiro + 3 favoritas, 5 categorias, busca); conta Dinheiro com cédulas e sugestão de reais inteiros | Feito; testar se as pessoas percebem as bolinhas e usam as favoritas | Feito |
| Média | **Tour curto e dicas na primeira visita** de cada área (caixinhas, bens, pessoas) | Muitos conceitos para iniciantes | Médio |
| Média | **Lembretes no calendário**: exportar vencimentos (arquivo `.ics`) para o calendário do celular | Resolve "sem notificação" sem servidor | Pequeno |
| Média | **Receitas que se repetem** (salário fixo) | Hoje só gastos fixos | Médio |
| Baixa | **PIN/bloqueio** opcional | Privacidade se o celular estiver desbloqueado | Médio |
| Baixa | **Política de segurança de conteúdo (CSP)** no HTML | Proteção extra barata | Pequeno |
| Baixa | **Exportar para planilha (CSV)** | Quem quer analisar fora do app | Pequeno |

## Fase comercial: venda única (depois da Fase 0 e das correções de maior risco)
**Objetivo: poder cobrar com segurança.** Detalhes e checklist em `PUBLICACAO.md` (seção 6).

| Item | Observação |
|---|---|
| Migrar para o Cloudflare Pages e deixar o GitHub privado | Só o dono cria a conta; passos em `PUBLICACAO.md` |
| **Domínio próprio** | Antes da primeira venda; nunca mais mudar |
| Termos de Uso, Política de Privacidade, aviso "não é consultoria" | Rascunho do Claude, **revisão de advogado** |
| CNPJ/MEI, nota fiscal, nome (INPI) | Com contador |
| Página de venda, pagamento único e entrega do link | Hotmart, Kiwify, Mercado Pago ou similar |
| Suporte e reembolso (7 dias) | Canal definido antes de vender |
| Pré-venda ou lista de espera com os testadores | Descobrir se pagam e quanto, antes de investir mais |
| (Depois) Chave de licença com servidor mínimo; app nas lojas | Só se o uso real pedir |

## Fase 2: crescer com segurança
- **Dividir o código em módulos** quando passar de ~3.500 linhas ou quando mais de uma pessoa mexer: pasta `src/` + script que gera o `app/index.html` único. Os testes continuam iguais.
- **Passo de migração de dados** (`migrar(dados)` por versão do formato) antes da primeira mudança incompatível de formato.
- **Testes em navegador real** (Playwright) para layout, toque e animações, além do jsdom.
- **Auditoria de acessibilidade** com TalkBack e VoiceOver.
- **Relatórios melhores**: comparação mês a mês, rosca por categoria, relatório do ano.
- **Financiamento com tabela** (SAC/Price) para sugerir os juros de cada parcela (opcional).

## Fase 3: só se o uso real pedir
- **Sincronizar entre aparelhos** (exige login e banco de dados: foge da restrição atual "sem servidor"). Decisão do dono: **só depois de uso real**.
- **Notificações de verdade** (exige servidor).
- **Compartilhar com a família** (conta conjunta).

## Ideias coletadas e ainda não decididas
- Frases da capa: aumentar a lista e conferir fontes (hoje são 16).
- Gráfico de rosca por categoria no Início.
- Envelopes com limite que "bloqueia" (hoje a meta é só uma anotação, de propósito).
- Escolher em quais contas cada caixinha pode guardar.
- Modo "demonstração" com dados de exemplo para quem quer só conhecer o app.

## Definição de pronto (vale para toda tarefa)
- [ ] Funciona em tamanho de celular (375×812), com letra "Enorme" e tema escuro quando mexe em layout.
- [ ] `npm test` passa, com teste novo/ajustado para o comportamento novo.
- [ ] Vocabulário comum na tela (o teste de vocabulário passa).
- [ ] Documentação atualizada (`ARQUITETURA.md` se mudou regra/modelo; `DECISOES.md` se foi decisão; este roteiro).
- [ ] `CHANGELOG.md` e versão subidas nos 3 lugares (ver `PUBLICACAO.md`).
- [ ] Enviado ao GitHub e conferido no ar.
- [ ] Relato ao dono diz claramente o que **não** foi verificado.
