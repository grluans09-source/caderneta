# Contexto do projeto

Este documento guarda **o porquê**: o objetivo, para quem é, o que o dono pediu e as razões por trás do app. Quem pegar o projeto em outro dia (ou outro computador) deve ler isto antes de mexer.

## 1. Objetivo real

> Qualquer pessoa, em menos de 10 segundos de olhada, saber se está no caminho certo com o dinheiro.

Analogia usada com o dono: o app é o **painel de um carro**. Não é preciso saber como o motor funciona para saber se tem combustível, se está rápido demais e se tem luz de alerta acesa.

| No carro | No app | Pergunta que responde |
|---|---|---|
| Combustível | **Quanto é meu de verdade** | Se eu pagasse tudo o que devo com o que tenho, quanto sobraria? |
| Velocímetro | **Para onde meu dinheiro está indo** | Este mês gastei demais? Com o quê? |
| Luz de alerta | **O que vem pela frente** | O que vence, o que falta pagar, vai dar? |

A contabilidade (partida dobrada) é **o mecânico debaixo do capô**: trabalha o tempo todo, mas a pessoa não precisa vê-la. Quem quiser espiar liga o "Modo contador".

## 2. Para quem é
- **Pessoa física** (não é para empresa/CNPJ).
- Do **idoso** ao **jovem** sem conhecimento financeiro, e o **adulto na correria**.
- Por isso: palavras comuns, letra grande, poucas decisões por tela, avisos claros, nada que exija saber contabilidade.

## 3. Restrições definidas pelo dono
- **Sem servidor e sem banco de dados.** Cada pessoa guarda os dados no próprio celular.
- Distribuição por **link** (instalar na tela inicial), não por loja de aplicativos.
- **Um arquivo só** para o app (simples de copiar, publicar e guardar).
- Funciona **sem internet** depois de aberto uma vez.
- Idioma: **português do Brasil** (interface e conversa).
- Estilo de conversa com o dono: **analogias**, **linguagem comum**, resposta direta e honesta sobre o que foi ou não verificado. O jeito completo dele (como decide, o que exige) está em `JEITO-DO-DONO.md`, atualizado a cada conversa.

## 4. O que o dono pediu (em ordem) e como virou código

1. **Projeto novo do zero**, aproveitando só as lições de um protótipo anterior (que tinha falhas: sem editar anotação, sem saldo inicial, compra à vista no cartão fora da fatura, balancete que "sempre fecha", etc.).
2. **Dívida do cartão por vencimento**: "devo 205, mas 190 vence este mês e 15 no próximo" ⇒ dívida inicial separada por datas (`abertas`).
3. **Visual vivo, "exótico" mas simples**, passando "ar contábil" até inconscientemente ⇒ identidade *livro-razão vivo* (conta em T, balança, carimbo, papel, sublinhado duplo, animações).
4. **Pessoas**: dinheiro emprestado e a pagar, com data de cobrança.
5. **Contas fixas** (assinatura, plano, seguro): avisam e o dono **confirma** o pagamento (não lança sozinho).
6. **Caixinhas** (envelopes): metas do mês (balde) e caixinhas de guardar (cofre). Só organização pessoal.
7. **Simulador** "se eu comprar X, quanto compromete".
8. **Correções de uso**: botão Salvar no fim do formulário; "R$" em todo campo de valor; gráfico de 6 meses **à frente**; frases filosóficas na capa no lugar do "Boa noite".
9. **Balança**: "não entendi o que representa e achei simples" ⇒ balança de latão com moedas e legenda; depois corrigida: **"se a dívida é de comida, eu não tenho comida"** ⇒ o app conta **dinheiro e bens**, não objetos consumidos.
10. **Bens**: carro/casa/TV, com valorização/desvalorização, venda com ganho/perda, bem já quitado ou ainda sendo pago.
11. **Juros** ao pagar dívida: só os juros viram gasto.
12. **Apagar** bem, pessoa e conta mesmo com anotações (com aviso).
13. **Vocabulário comum**: trocar "gaveta" e outros termos técnicos por palavras que todo mundo usa.
14. **"Quanto falta pagar no mês"** em destaque, com setas para os meses seguintes.
15. **Caixinhas só com dinheiro real** (sem dívidas); o guardado **continua sendo seu e continua na conta** (o total não muda, como numa caixinha de banco), só sai de "Dinheiro para usar agora" e **volta** ao tirar; escolher **de qual conta** o guardado sai.
16. **Filtros** para listas não ficarem enormes: busca e ordem por **data, valor, nome**, 15 por vez.
17. **Organizar o projeto e guardar tudo no GitHub** (este documento faz parte disso).

## 5. Princípios de produto
1. **Um assunto por tela**; ações grandes; o caminho mais comum primeiro.
2. **Nada some**: tudo o que entra tem origem e destino (por isso a partida dobrada).
3. **O app não decide pela pessoa**: metas e caixinhas são sugestões; avisos não bloqueiam.
4. **Explicar na hora**, em frase curta, o efeito do que a pessoa está fazendo (a "prévia" da tela Anotar).
5. **Dados seguros por padrão**: validar tudo que entra, nunca apagar sem aviso, nunca sobrescrever dado ilegível sem guardar cópia.
6. **Honestidade**: simulador e semáforo são "referência para pensar", **não** recomendação financeira.

## 6. Glossário: palavra da tela ↔ termo contábil

| Na tela | Por baixo (contabilidade) |
|---|---|
| Conta (carteira, banco, poupança) | Ativo disponível |
| Cartão, empréstimo, "devo" | Passivo |
| Dinheiro para usar agora | Ativo disponível (livre de caixinhas) |
| Meus bens | Ativo imobilizado |
| Dívidas (o que eu devo) | Passivo |
| **É meu de verdade / Sobra** | **Patrimônio líquido** = ativo − passivo |
| Gastei | Despesa: D categoria / C conta |
| Recebi | Receita: D conta / C categoria |
| Transferi entre contas | Permuta patrimonial: D destino / C origem |
| Comprei um bem | D bem / C conta (não é despesa) |
| Perdeu valor / Ganhou valor | Depreciação / valorização |
| Pagar fatura | Transferência banco → cartão (não é gasto novo) |
| Juros e multas | Despesa financeira |
| Balança | Equação patrimonial: Ativo = Passivo + PL |
| Caixinha, meta | Organização pessoal, **fora** do razão (como um orçamento) |
| Contas fixas | Compromisso futuro (vira despesa só ao pagar) |
| "Gasto anotado." (aviso depois de salvar; até a 1.27.0 era o carimbo ANOTADO) | Lançamento no livro |
| Previsão | Projeção |

## 7. O que NÃO é (por enquanto)
- Não é conciliação bancária nem lê extrato.
- Não sincroniza entre aparelhos (sem login/servidor).
- Não calcula imposto de renda, investimentos complexos nem câmbio.
- Não envia notificações com o app fechado (exigiria servidor).
