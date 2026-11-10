# O jeito do dono (como ele trabalha e o que espera)

> **Documento vivo.** Quem trabalhar com o dono (pessoa, Claude ou outra IA) deve ler isto antes de começar e **acrescentar aqui o que aprender em cada conversa**: preferências novas, correções que ele fez, jeitos de responder que funcionaram ou não. Nunca apague: se algo mudou, escreva o que vale hoje e marque o antigo como "(antes)".
> Última atualização: 8 nov 2026 (fim do dia).

## 1. Quem é
- **Não é programador.** Entende de finanças e de contabilidade no uso do dia a dia, não de código.
- Fala **português do Brasil** e escreve rápido: às vezes tudo em maiúsculas, sem acento ou com letras trocadas ("certifique se", "tdo", "orcamento"). **Entenda a intenção; não corrija a escrita dele.**
- É o dono do produto: **decide**. Quem trabalha com ele propõe, explica e executa.

## 2. Como ele gosta de decidir
- **Passo a passo.** Ele pediu: "a cada passo eu quero que você examine o passo, melhore aquela situação e aborde comigo pra decidirmos". Para trabalhos grandes: **primeiro um relatório ou plano, depois a aprovação dele, depois a execução**. Quando ele mesmo diz "pare e espere minha aprovação", pare de verdade.
- **Opções com uma recomendação.** Dê 2 a 4 opções, diga qual você recomenda e por quê, em uma frase. Ele costuma responder curto: "Sim, aprovo", "Sim, tudo", "Sim, como proposto", "vai a B mesmo se der certo".
- **Coisas visuais: protótipo antes.** Nome, logo, mascote, botão de anotar e medalhas foram escolhidos vendo versões lado a lado (ex.: 5 nomes, 4 desenhos de pena). Ele dá o ajuste em palavras soltas: "encorpar", "sério e luxuoso mas próximo", "algo que combine com o app de hoje", "o mascote tem que estar alinhado com o nome".
- **Uma decisão por vez no fim da resposta**, com botões curtos quando der.

## 3. O que ele sempre exige
1. **Perguntar antes de enviar ao GitHub ou publicar.** Ele responde "Sim, enviar". Aprovação de um envio não vale para o próximo.
2. **GitHub sempre em dia** ("lembre-se de sempre atualizar informações no Git pra quem ler lá não ler algo velho ou que foi substituído ou melhorado"). Regra completa em `CLAUDE.md`, seção "Git sempre em dia".
3. **Nada some.** Ao simplificar ou reorganizar, nenhuma função, campo ou informação pode ser perdida: reorganizar, agrupar, esconder em camada, sim; apagar, não.
4. **Não perder os dados de quem usa.** Nada que mude o endereço, a chave dos dados ou o formato da cópia sem plano e aviso.
5. **Contabilidade de verdade por trás, linguagem comum na frente.** Termo técnico só com explicação ("?").
6. **O app deve travar o que não faz sentido** ("se eu colocar que gastei mais no cartão do que o limite").
7. **Só fontes oficiais** nas notícias, com link, e sem recomendar investimento.
8. **Conferir com a vida real**: ele testa o app com o próprio dinheiro (ex.: a caixinha do Nubank a 115% do CDI) e quer que o app aceite as regras de verdade de cada produto, deixe corrigir o valor na mão e lembre de conferir, "caso o app alucine".
9. **Conta certa do GitHub**: a pessoal, `grluans09-source`. Nunca a da empresa (`lnfinanceiro9-commits`). Nunca guardar senha ou token no repositório.
10. **Dizer sempre o que NÃO foi verificado** (principalmente: "não testado num celular de verdade").

## 4. Como responder a ele
- **Responda exatamente o que ele perguntou, primeiro.** Depois, se precisar, as opções. (Lição de 8 nov 2026: ele perguntou "quando publicarmos oficialmente, o erro do IBGE some?" e recebeu opções antes da resposta; ele precisou repetir a pergunta. A resposta certa começava com "Não, sozinho não some, porque...".)
- **Analogias e palavras do dia a dia.** Ex.: "é como um balcão que só atende quem está no país"; "o app é o painel do carro".
- **Formato que funciona:** o que mudou · o que foi testado · o que não foi verificado · a decisão que falta (uma só).
- **Curto quando a pergunta é curta.** "O que falta?", "precisa de internet?" pedem uma resposta direta, em lista, sem relatório longo.
- **Tabelas** para comparar opções (custo, esforço, se funciona com certeza).
- **Sem jargão técnico.** Se não der para evitar, explique em uma frase.

## 5. O que ele quer do produto (resumo)
- Finanças pessoais para **qualquer pessoa** (idoso, jovem, adulto na correria): simples, letras grandes, poucas decisões por tela.
- Visual **preto, dourado e branco**, **sério e luxuoso, mas próximo**; nome que lembre contabilidade sem ser só para contadores (**Balancete**); mascote ligado ao nome (o **Mordomo**, a balança); letra de contabilidade.
- **Sem servidor e sem custo** enquanto der; dados só no celular.
- Pensa em **vender** (pagamento único), mas **ainda não quer**: "essa conversa pode ser depois".

## 6. Como ele quer trabalhar com IAs
- Pode trocar de IA. O fluxo que ele pensou (8 nov 2026): **ele diz o que quer → uma IA escreve um comando completo → outra IA programa**. O formato do comando está em `docs/MODELO-COMANDO.md`, e toda IA deve começar por `AGENTS.md` / `CLAUDE.md`.
- Quem receber o comando deve seguir as regras deste documento, principalmente as da seção 3.

## 7. Registro do que foi aprendido (acrescente embaixo, com a data)
- **6–7 nov 2026**: pediu explicações com analogias; aprovou o plano de 9 passos e quis decidir cada passo; quis protótipos para nome, logo, mascote e botão de anotar; pediu travas de coerência; pediu Git sempre atualizado.
- **7 nov 2026**: deixou a conversa sobre venda para depois.
- **8 nov 2026**: pediu auditoria completa e aprovou tudo de uma vez ("Sim, tudo"); pediu que as bolinhas de anotar combinassem com o app de hoje; quis que a resposta sobre o IBGE viesse direto ao ponto; escolheu a opção que funciona agora e sem custo (o celular busca no IBGE) e deixou o servidor no Brasil para o lançamento; pediu a simplificação da interface com a regra "nada some", em duas etapas (relatório, depois implementação); perguntou o que falta e se tudo está documentado no GitHub; pediu que este documento existisse e fosse atualizado a cada conversa.
- **8 nov 2026 (tarde)**: perguntou se, sem passar comandos por uma IA, outra IA conseguiria trabalhar sozinha (sim, começando por `AGENTS.md`); descobriu que a caixinha de 115% do CDI virava 100% ao ano e pediu que o app entendesse cada tipo de rendimento e imposto, **com uma opção de corrigir o valor atual na mão e um lembrete semanal de conferir**; aprovou as recomendações e acrescentou esses dois pedidos ("SIM APROVO MAIS DEIXE UMA OPÇÃO...").
- **8 nov 2026 (noite)**: pediu que o chat acompanhasse o app de hoje ("as perguntas vêm de uma versão antiga") e que o **"Ver no app" levasse exatamente à função, não só à aba**. Lição: quando uma função muda de lugar ou nasce, o chat e os atalhos precisam mudar junto.
- **9 nov 2026**: mandou o prompt do redesign com as duas auditorias e disse "siga o relatório porém deixe essa versão de hoje salva pra caso queira voltar eu lhe peço". Lição: **antes de uma mudança grande, guardar a versão atual com nome claro e dizer como voltar**; seguir as opções já marcadas no prompt sem perguntar de novo. Autorizou o envio com uma palavra só ("ENVIE"): vale como "Sim, enviar".
- **9 nov 2026 (noite)**: aprovou a fase C com "Sim, fase C" e autorizou baixar as duas letras pelo cartão de pergunta (nome, tamanho, origem e licença à vista). Lição: para baixar algo, mostrar **o quê, quanto pesa, de onde vem e a licença** numa pergunta só; ele decide rápido assim.
- **9 nov 2026 (noite)**: aprovou a fase D com "Sim, fase D". Ele segue o relatório fase a fase e confia nas decisões já marcadas no prompt; o que ele precisa ver em cada fase é **o que mudou na tela, o que foi testado e o que não foi** (celular real).
