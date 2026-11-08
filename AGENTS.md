# Para qualquer IA que for trabalhar neste projeto (Balancete)

Leia **antes de mexer em qualquer coisa**, nesta ordem:
1. **`CLAUDE.md`**: as regras do projeto e o jeito de trabalhar. Vale para qualquer IA, não só para o Claude.
2. **`docs/JEITO-DO-DONO.md`**: como o dono decide, o que ele sempre exige e como responder a ele. **Acrescente lá o que aprender em cada conversa.**
3. Se você recebeu uma tarefa num comando: ele segue o formato de **`docs/MODELO-COMANDO.md`**. Se algo no comando contrariar as regras, pare e pergunte ao dono.

## As regras que mais causam estrago se esquecidas
- **Nunca renomeie** o que é "caderneta" por dentro: a chave dos dados `caderneta:v2`, o formato da cópia `app:"caderneta"`, o nome do cache do service worker e o endereço `/caderneta/`. **As pessoas perderiam os dados.**
- **Não envie ao GitHub nem publique sem o dono confirmar** ("Sim, enviar"). Cada envio é uma confirmação nova.
- **GitHub certo**: a conta pessoal `grluans09-source`. Nunca a `lnfinanceiro9-commits` (empresa). Nunca guarde senha, token ou chave no repositório.
- **O app é um arquivo só** (`app/index.html`): HTML, CSS e JS sem framework e sem dependência externa. Dinheiro sempre em **centavos inteiros**.
- **Rode `npm test`** antes de dizer que terminou (tem que dar "TUDO CERTO"). Mudou comportamento? Escreva ou ajuste um teste.
- **Documentos no mesmo envio** (regra "Git sempre em dia" do `CLAUDE.md`): ninguém pode ler informação velha no repositório.
- **Nada some da interface** (D64): reorganize, agrupe ou esconda em camada, mas não remova função.
- Fale com o dono em **português do Brasil, sem jargão**, dizendo sempre o que **não** foi verificado.
