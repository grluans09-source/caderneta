# Histórico de versões

Formato: versão semântica (`MAIOR.MENOR.CORREÇÃO`). Cada versão diz **o que mudou para a pessoa que usa**.
Antes da 1.0.0 as versões eram numeradas só pelo nome do cache do app (v1 a v16); estão aqui como marcos de desenvolvimento.

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
