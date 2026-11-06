# Roteiro

Onde estamos: **versão 1.0.0**, funcionalmente completa para o que foi pedido, **ainda sem uso real por outras pessoas**.
Este documento diz **o que fazer a seguir, em que ordem e por quê**. Atualize-o a cada versão.

## Como priorizar
1. **Prova no mundo real vem antes de função nova.** Um problema de uso real vale mais que dez ideias.
2. Primeiro o que **protege os dados** das pessoas; depois o que **reduz confusão**; só então o que **acrescenta função**.
3. Cada item só está "pronto" quando passa na **definição de pronto** (no fim deste documento).

## Fase 0: agora (versão 1.0.x)
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
| Alta | **Desfazer / lixeira** ao apagar (alguns segundos para voltar atrás) | Apagar é definitivo hoje | Médio |
| Alta | **Backup mais fácil**: lembrete mais presente e botão "Guardar cópia" no Início quando fizer tempo; compartilhar direto por WhatsApp/e-mail | Perda de dados é o maior risco | Médio |
| Alta | **Migração de hospedagem** para Netlify, com **aviso de mudança de endereço** e botão de cópia no endereço antigo | Plano em `PUBLICACAO.md` | Médio |
| Média | **Modo simples**: Início mostra só o essencial (quanto é meu, o que falta pagar, últimas anotações) e o resto fica em "Ver mais" | Tela longa para idosos e apressados | Médio |
| Média | **Tour curto e dicas na primeira visita** de cada área (caixinhas, bens, pessoas) | Muitos conceitos para iniciantes | Médio |
| Média | **Lembretes no calendário**: exportar vencimentos (arquivo `.ics`) para o calendário do celular | Resolve "sem notificação" sem servidor | Pequeno |
| Média | **Receitas que se repetem** (salário fixo) | Hoje só gastos fixos | Médio |
| Baixa | **PIN/bloqueio** opcional | Privacidade se o celular estiver desbloqueado | Médio |
| Baixa | **Política de segurança de conteúdo (CSP)** no HTML | Proteção extra barata | Pequeno |
| Baixa | **Exportar para planilha (CSV)** | Quem quer analisar fora do app | Pequeno |

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
