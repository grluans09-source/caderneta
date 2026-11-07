# Balancete

> Antes chamado **Caderneta**. O endereço e os dados continuam os mesmos.

**Finanças pessoais simples de usar, com a contabilidade de verdade trabalhando por trás.**
App de celular (instalável, funciona sem internet), em português, pensado para qualquer pessoa: do idoso ao jovem e ao adulto na correria.

- **App no ar:** https://grluans09-source.github.io/caderneta/
- **Versão atual:** 1.17.0-beta.1 (beta para testadores) (veja o [CHANGELOG](CHANGELOG.md))
- **Seus dados ficam só no celular de cada pessoa.** Não existe servidor, conta nem banco de dados.

> Em uma frase: a pessoa anota o que gasta e recebe, e o app mostra **quanto é dela de verdade**, para onde o dinheiro está indo e o que vem pela frente. A partida dobrada fica escondida no "motor"; a tela fala como a gente fala.

## O que o app faz

| Parte | Para que serve |
|---|---|
| **Início** | O **Mordomo**, a balança-personagem que mostra "o que eu tenho = o que eu devo + o que é meu" e muda a cara conforme a situação, resumo do mês, "o mês passado fechou" (nos 10 primeiros dias), uma linha "Falta pagar" (leva ao Planejar), avisos urgentes, caixinhas e metas (se existirem) e as 3 últimas anotações |
| **Anotar** | O botão da **pena dourada**, no **canto direito de baixo**, **gera 4 bolinhas em quarto de círculo, com animação** (Gastei, Recebi, Transferi entre contas, Comprei um bem): um toque gera, outro escolhe. Na folha, um botão redondo fixo no mesmo canto troca o tipo (o atual fica apagado). As listas são curtas (Dinheiro + 3 contas favoritas, 5 categorias favoritas); tocar na busca abre a lista com tudo. A conta **Dinheiro** é a carteira (não se apaga, e quem já usava o app ganha ela sozinha) e conta cédulas |
| **Dinheiro** | Quatro abas: Contas (com o guardado, o "para usar" e **Conferir com o banco**), Dívidas (cartões e empréstimos), Bens e Pessoas (emprestei / devo) |
| **Planejar** | Ferramentas no topo (Metas do mês, Caixinhas, Contas fixas com **Contas do ano**, Simulador), **Acerto de contas do mês** (abre numa janela preta e dourada por cima da tela, com todas as dívidas, o prazo de cada uma em palavras e o botão Pagar) e a agenda do que vence |
| **Gráficos** | Cartão **Mês a mês** (um mês comparado com o anterior) e 10 indicadores de finanças pessoais em imagem (patrimônio, folga de caixa, reserva de emergência, taxa de poupança, peso das dívidas, renda já reservada, **custo fixo de vida**, para onde vai o dinheiro, composição do patrimônio, custo dos juros), cada um com selo Saudável/Atenção/Alerta |
| **Relatórios** | Um relatório por indicador, explicado como um consultor: o que é, como você está, para comparar, o que quer dizer e por onde começar. Abre com um panorama |
| **Mais** | Anotações (buscar e ordenar por data, valor ou nome) e Ajustes (letra, cores, movimento, categorias, cópia dos dados, ajuda) |

## Para quem vai mexer no projeto

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
├── tests/          Testes automáticos: 688 verificações que simulam uma pessoa usando o app
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
