# Balancete

> Antes chamado **Caderneta**. O endereço e os dados continuam os mesmos.

**Finanças pessoais simples de usar, com a contabilidade de verdade trabalhando por trás.**
App de celular (instalável, funciona sem internet), em português, pensado para qualquer pessoa: do idoso ao jovem e ao adulto na correria.

- **App no ar:** https://grluans09-source.github.io/caderneta/
- **Versão atual:** 1.32.0-beta.1 (beta para testadores; redesign "Tinta & Latão" concluído: celular e computador, atalhos de teclado, validação final em `docs/redesign/RELATORIO_TESTES.md`) (veja o [CHANGELOG](CHANGELOG.md))
- **Seus dados ficam só no celular de cada pessoa.** Não existe servidor, conta nem banco de dados.

> Em uma frase: a pessoa anota o que gasta e recebe, e o app mostra **quanto é dela de verdade**, para onde o dinheiro está indo e o que vem pela frente. A partida dobrada fica escondida no "motor"; a tela fala como a gente fala.

## O que o app faz

| Parte | Para que serve |
|---|---|
| **Início** | Por urgência (1.27.0): o cartão **"É meu de verdade"** (com a variação do mês e a barra Tenho × Devo; o **Mordomo**, a balança-personagem, mora no **"Como ler?"**), **"Precisa de você"** (até 3 avisos: atrasadas juntas num só, próximo vencimento, limite, lembrete de conferir, cópia; e a linha "Falta pagar"), o mês (quanto dá para gastar por dia, entrou, saiu, sobrou), as 3 últimas anotações, "Hoje no Brasil" e "Seus objetivos" (que abrem) e a frase do dia no rodapé |
| **Notícias** | "Hoje no Brasil" no Início e tela própria: dólar, Selic, CDI, inflação, o que ficou mais caro, combustíveis, previsões do Focus e notícias do IBGE, **só de fontes oficiais** com link, selo CERTEZA ou POSSIBILIDADE e o efeito na sua vida. Atualiza ao meio-dia O celular busca as notícias do IBGE direto no site do IBGE, sem enviar nenhum dado seu |
| **Perguntar (chat)** | O rostinho do Mordomo, **no alto de toda tela**: 63 perguntas prontas em linguagem comum, muitas respondidas com os seus próprios números, com busca e um "Ver no app" que leva direto ao lugar exato. Sem internet e sem IA |
| **Travas de coerência** | Antes de salvar, o app confere a anotação: **não deixa** passar do limite do cartão nem a carteira ficar negativa, e **pergunta** quando algo é estranho (banco negativo, pagar a mais, data distante, valor muito acima do costume) |
| **Anotar** | O botão **Anotar, no centro da barra de baixo** (tinta com "+" dourado): **um toque abre a folha já no Gastei** (valor em foco, com vírgula: "50" = R$ 50,00; conta e categoria já escolhidas; Salvar sempre à vista), e **segurar** abre **4 medalhas douradas, cada uma com o centro na cor do tipo** (Gastei, Recebi, Transferi entre contas, Comprei um bem): um toque gera, outro escolhe. Na folha, um botão redondo fixo no mesmo canto troca o tipo (o atual fica apagado). As listas são curtas (Dinheiro + 3 contas favoritas, 5 categorias favoritas); tocar na busca abre a lista com tudo. A conta **Dinheiro** é a carteira (não se apaga, e quem já usava o app ganha ela sozinha) e conta cédulas |
| **Dinheiro** | Cinco abas: Contas (com o guardado, o "para usar" e **Conferir com o banco**), Investimentos (veja abaixo), Dívidas (cartões e empréstimos), Bens e Pessoas (emprestei / devo); e **Todas as anotações** (buscar e ordenar por data, valor ou nome) |
| **Dinheiro > Investimentos** (até a 1.26.0, a aba Investir) | Poupança, caixinhas, CDB, Tesouro e fundos, cada um do seu jeito: **% do CDI** (ex.: 115% do CDI), taxa fixa ao ano, IPCA + taxa, poupança (regra oficial) ou "varia". O app calcula o rendimento a cada dia útil com o CDI, a Selic e a inflação oficiais, mostra quanto você receberia se resgatasse hoje (já sem o Imposto de Renda), deixa atualizar o valor com o do banco e lembra toda semana de conferir. Caixinhas também podem render |
| **Planejar** | Ferramentas no topo (Metas do mês, Caixinhas, Contas fixas com **Contas do ano**, Simulador), **Acerto de contas do mês** (em linha, na própria tela: o mês, quanto falta, "x de y pagas", cada conta com o prazo em palavras e Pagar, Paguei ou Pular este mês) e a agenda do que vence |
| **Saúde** | Antes eram as abas Gráficos e Relatórios. Mostra o **panorama** e os 4 indicadores principais (o que é seu de verdade, folga para 30 dias, reserva de emergência, taxa de poupança); os outros 6 (peso das dívidas, renda já reservada, **custo fixo de vida**, para onde vai o dinheiro, composição do patrimônio, custo dos juros) ficam em "Ver mais indicadores". Também o **Mês a mês** e um **relatório por indicador**, explicado como um consultor: o que é, como você está, para comparar, o que quer dizer e por onde começar |
| **Ajustes** (a engrenagem no alto de toda tela; até a 1.26.0 ficava na aba Mais, que saiu) | Letra, cores, movimento, modo contador, categorias, cópia dos dados, instalar e ajuda |

## Para quem vai mexer no projeto

**Pessoa ou IA: comece por [`AGENTS.md`](AGENTS.md)** (o que ler primeiro e as regras que não podem ser esquecidas). Tarefas passadas de uma IA para outra seguem [`docs/MODELO-COMANDO.md`](docs/MODELO-COMANDO.md); o jeito de trabalhar com o dono está em [`docs/JEITO-DO-DONO.md`](docs/JEITO-DO-DONO.md).

Precisa só de **Git** e **Node.js 20 ou mais novo**.

```bash
git clone https://github.com/grluans09-source/caderneta.git
cd caderneta
npm install
npm test        # roda todos os testes (leva menos de 1 minuto)
npm start       # abre o app em http://localhost:8765
```

### Mapa das pastas

```
caderneta/
├── app/            O APP (é esta pasta que vai para o ar)
│   ├── index.html    O app inteiro: HTML + CSS + JavaScript, sem dependências
│   ├── sw.js         Faz o app abrir sem internet (cache)
│   ├── manifest.webmanifest, icon-*.png, icon.svg   Instalação na tela inicial
├── tests/          Testes automáticos: 1174 verificações que simulam uma pessoa usando o app
├── tools/          Ferramentas: servidor local e gerador de ícones
├── docs/           Documentação (leia a partir de docs/README.md)
├── .github/workflows/publicar.yml   Testa e publica sozinho a cada envio para o GitHub
├── CLAUDE.md       Regras e contexto para quem trabalha no projeto (inclusive o Claude)
├── CHANGELOG.md    Histórico de versões
└── package.json    Versão e comandos (npm test, npm start)
```

### Como andar com o projeto (resumo)
1. Leia o [CLAUDE.md](CLAUDE.md) (regras e jeito de trabalhar) e o [docs/CONTEXTO.md](docs/CONTEXTO.md) (por que o app é assim).
2. Faça a mudança em `app/index.html`.
3. Rode `npm test`. Se algo falhar, corrija antes de continuar.
4. Teste no navegador em tamanho de celular (`npm start`).
5. Atualize a documentação e o [CHANGELOG](CHANGELOG.md), suba a versão e envie para o GitHub. Os testes rodam de novo lá e, se passarem, o app é publicado sozinho.

Detalhes do passo a passo, da publicação e da recuperação em caso de perda do computador: [docs/PUBLICACAO.md](docs/PUBLICACAO.md).

## Documentação

| Documento | Conteúdo |
|---|---|
| [docs/CONTEXTO.md](docs/CONTEXTO.md) | Objetivo, público, princípios, o que o dono pediu e por quê, glossário (palavra da tela ↔ termo contábil) |
| [docs/ARQUITETURA.md](docs/ARQUITETURA.md) | Como o código funciona: dados, motor contábil, telas, mapa das funções, testes |
| [docs/AVALIACAO.md](docs/AVALIACAO.md) | Avaliação honesta do estado atual: números, pontos fortes, riscos e dívidas |
| [docs/ROTEIRO.md](docs/ROTEIRO.md) | O que vem a seguir, em ordem de prioridade |
| [docs/DECISOES.md](docs/DECISOES.md) | Decisões importantes e o motivo de cada uma |
| [docs/PUBLICACAO.md](docs/PUBLICACAO.md) | Como publicar, versionar, fazer backup e migrar de hospedagem |
| [docs/MAPA-DO-APP.md](docs/MAPA-DO-APP.md) | Onde mora cada assunto, o mapa de cores e o fluxo de uso (**vale para o app de hoje**) |
| [docs/GUIA-TESTADORES.md](docs/GUIA-TESTADORES.md) | Mensagem pronta, tarefas e ficha para os testadores |
| [docs/AUDITORIA-FUNCOES.md](docs/AUDITORIA-FUNCOES.md) e [docs/PLANO-BETA.md](docs/PLANO-BETA.md) | **Históricos**: como se chegou ao mapa atual |

## Privacidade

- Nenhum dado financeiro sai do aparelho. Não há cadastro, login, análise de uso nem anúncios.
- O repositório contém **só o código e a documentação**, nunca dados de usuários.
- Cada pessoa deve usar **Ajustes → Guardar uma cópia** de vez em quando: é o único backup dos dados dela.
