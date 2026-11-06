# Publicação, versões, backup e recuperação

## 1. Como a publicação funciona hoje

```
você (ou Claude) envia o código para o GitHub (branch main)
        │
        ▼
GitHub Actions (.github/workflows/publicar.yml)
   1) roda `npm ci` e `npm test`      ← se algum teste falhar, PARA aqui (nada é publicado)
   2) publica a pasta `app/` no GitHub Pages
        │
        ▼
https://grluans09-source.github.io/caderneta/    (o app no ar)
```

- Quem já instalou o app recebe a versão nova **na segunda vez que abrir** (o app abre do cache e atualiza em segundo plano).
- Acompanhe cada publicação na aba **Actions** do repositório (https://github.com/grluans09-source/caderneta/actions). Verde = no ar.

## 2. Fazer uma mudança e publicar (passo a passo)

```bash
git pull                       # garante que está com a versão mais nova
# ... fazer a mudança em app/index.html ...
npm test                       # tem que terminar com "TUDO CERTO"
npm start                      # conferir no navegador (http://localhost:8765), em tamanho de celular

# documentar e versionar (veja a seção 3), depois:
git add -A
git commit -m "Descrição curta do que mudou"
git push                       # o GitHub testa e publica sozinho
```

## 3. Versão e checklist de lançamento

Versão `MAJOR.MINOR.PATCH`:
- **PATCH** (1.0.1): correção de erro, sem função nova.
- **MINOR** (1.1.0): função nova compatível com os dados que já existem.
- **MAJOR** (2.0.0): muda o formato dos dados de forma incompatível (exige migração).

**A versão fica em 3 lugares, que sobem juntos:**
1. `package.json` → `"version"`
2. `app/index.html` → `var VERSAO_APP="..."` (aparece em Ajustes e dentro do arquivo de backup)
3. `app/sw.js` → `const VERSAO = "caderneta-<versão>"` ⚠ **se esquecer este, os celulares não atualizam**

Checklist:
- [ ] `npm test` verde
- [ ] Conferido no navegador em 375×812 (e letra "Enorme" / tema escuro se mexeu em layout)
- [ ] Versão subida nos 3 lugares
- [ ] `CHANGELOG.md` com a nova versão (o que mudou, em palavras simples)
- [ ] `docs/` atualizados (arquitetura, decisões, roteiro) se for o caso
- [ ] `git commit` e `git push`
- [ ] Aba **Actions** verde e app conferido no ar
- [ ] Marcar a versão: `git tag -a vX.Y.Z -m "Versão X.Y.Z"` e `git push --tags`

## 4. Voltar atrás (se uma versão der problema)

```bash
git log --oneline              # ache o commit que causou o problema
git revert <código-do-commit>  # cria um commit que desfaz aquela mudança
git push                       # o GitHub testa e publica a versão anterior
```
Para voltar o **código inteiro** a uma versão marcada: `git checkout vX.Y.Z` (só para olhar) ou crie uma ramificação a partir dela. O histórico nunca é apagado.

## 5. Guardar tudo e recuperar o projeto (computador perdido, roubado ou quebrado)

### O que está seguro no GitHub
Tudo do **projeto**: código do app, testes, ferramentas, documentação, regras (`CLAUDE.md`), histórico completo de cada mudança e as versões marcadas (tags). O computador pode sumir: nada disso se perde.

### O que NÃO está no GitHub (e por quê)
- **Os dados financeiros das pessoas**: ficam só no celular de cada uma, de propósito (privacidade). A proteção deles é o botão **Ajustes → Guardar uma cópia**. Oriente cada usuário a guardar a cópia fora do celular (e-mail, nuvem pessoal).
- **Senhas, tokens e chaves**: nunca vão para o repositório. O acesso é pela sua conta do GitHub.

### Como voltar a trabalhar em um computador novo
1. Instale **Git** (https://git-scm.com) e **Node.js 20 ou mais novo** (https://nodejs.org).
2. Entre no GitHub com a conta **grluans09-source** (`gh auth login`, se usar o GitHub CLI, ou pelo navegador).
3. Baixe o projeto e confira que está tudo certo:
   ```bash
   git clone https://github.com/grluans09-source/caderneta.git
   cd caderneta
   npm install
   npm test        # deve terminar com "TUDO CERTO"
   npm start       # abre o app em http://localhost:8765
   ```
4. Para continuar com o **Claude Code**: abra a pasta `caderneta` e peça que ele **leia o `CLAUDE.md`, o `docs/CONTEXTO.md`, o `docs/AVALIACAO.md` e o `docs/ROTEIRO.md`** antes de começar. Todo o contexto, as regras e o jeito de falar com você estão lá.

### Cuidados com a sua conta do GitHub (a "chave" de tudo)
- Ative a **verificação em duas etapas** e **guarde os códigos de recuperação** fora do computador (papel em lugar seguro ou gerenciador de senhas).
- Mantenha um **e-mail de recuperação** que você acessa de qualquer aparelho.
- Opcional, mas recomendado: **uma cópia extra** do repositório em outro lugar (por exemplo, `git clone --mirror` em um HD externo de vez em quando, ou um segundo repositório privado).

## 6. Plano: hospedagem definitiva (Cloudflare Pages) e GitHub privado

**Modelo de negócio decidido: venda única** (sem assinatura, sem login). Combina com um app sem servidor.

### Qual hospedagem
Conferido em novembro de 2026 em sites de comparação (**confirme nos sites oficiais antes de contratar**):

| | Cloudflare Pages | Netlify | GitHub Pages (hoje) |
|---|---|---|---|
| Plano gratuito | Tráfego **ilimitado**; ~500 publicações por mês | Funciona por **créditos** (cerca de 300 por mês): cada publicação e cada GB gasta crédito; **se acabar, o site pausa** | Gratuito, mas **só repositório público** |
| Uso comercial (venda) | Permitido segundo as fontes | Permitido segundo as fontes | **Não recomendado**: as regras não permitem uso para negócio |
| Repositório privado | Sim | Sim | Só em plano pago |
| Se um dia precisar de um servidor pequeno (chave de licença) | Mesmo painel (Workers) | Precisa de outro serviço | Não |
| Custo-benefício para este app | **Melhor** | Bom, mas com risco de pausar por créditos | Só para a fase de teste |

**Recomendação: Cloudflare Pages.** O app tem ~200 KB, então qualquer um aguenta o tráfego; o que pesa é **não ter limite que pause o site no meio das vendas** e **ter caminho para crescer** (licenças) no mesmo lugar. O Netlify é uma alternativa boa (arquivo `netlify.toml` mais abaixo).

### Endereço: o que decide tudo
O app guarda os dados **por endereço**. Trocar de endereço = os dados dos usuários **ficam para trás** (precisam de "Guardar uma cópia" e "Recuperar"). Opções:
- **A (100% gratuita):** testar no endereço gratuito (`github.io` hoje, depois `*.pages.dev`). Cada testador faz **uma** troca guardando e recuperando a cópia. Vale porque são poucas pessoas.
- **B (cerca de R$ 40 a R$ 60 por ano):** registrar o **domínio próprio** antes de vender e usá-lo daqui em diante. **Nunca mais muda**, mesmo que a hospedagem mude. **Obrigatório antes de vender**, para nenhum cliente perder dados.

### Passo a passo (Cloudflare Pages)
1. **Criar a conta** gratuita em https://dash.cloudflare.com (e-mail pessoal). *(Só o dono faz: criar conta e autorizar o GitHub.)*
2. **Workers & Pages → Create → Pages → Connect to Git** → autorizar o GitHub → escolher o repositório `caderneta` (pode ser privado).
3. Configurar: **Production branch** `main` · **Build command** vazio · **Build output directory** `app` → Save and Deploy.
4. Endereço gratuito: `<nome>.pages.dev`. Testar no celular (instalar, usar sem internet).
5. Se o painel oferecer só "Workers": escolher a opção de **arquivos estáticos (static assets)** apontando para a pasta `app`.
6. **Aviso de mudança de endereço** na versão antiga (faixa "Mudamos de endereço" + botão Guardar cópia + link novo); cada pessoa recupera a cópia no novo.
7. Só depois de todos migrarem: tornar o repositório **privado** (GitHub → Settings → Danger zone → *Change repository visibility*). ⚠ O endereço `github.io` **para de funcionar**. Desligue o workflow do Pages do GitHub.
8. Com domínio comprado: Cloudflare → *Custom domains* → adicionar. (Depois dos primeiros testadores, é mais uma troca de endereço com cópia.)
9. Atualizar `README.md`, `CLAUDE.md`, `docs/GUIA-TESTADORES.md` e este documento com o endereço novo.

O arquivo `app/_headers` (já no repositório) faz o celular buscar o `sw.js` e o HTML sempre atualizados no Cloudflare.

### Alternativa: Netlify
Mesmos passos (Add new site → Import from Git → pasta `app`). Arquivo `netlify.toml` na raiz:
```toml
[build]
  publish = "app"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache"

[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "no-cache"

[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"
```
Atenção ao consumo de créditos do plano gratuito (publicar muitas vezes por mês gasta crédito).

### Antes de vender (checklist)
- [ ] Teste de campo feito e problemas graves corrigidos (`GUIA-TESTADORES.md`)
- [ ] Domínio próprio registrado e apontado para a hospedagem
- [ ] Backup mais fácil e "desfazer" ao apagar (roteiro)
- [ ] Termos de Uso e Política de Privacidade **revisados por advogado**
- [ ] Aviso claro de que o app **não é consultoria financeira**
- [ ] CNPJ/MEI e emissão de nota (converse com um contador)
- [ ] Nome conferido (pesquisa no INPI)
- [ ] Meio de pagamento e entrega (venda única): Hotmart, Kiwify, Mercado Pago ou similar
- [ ] Canal de suporte (WhatsApp ou e-mail) e política de reembolso (7 dias no comércio online)
- [ ] Repositório privado e licença proprietária (`LICENSE`)

## 7. Problemas comuns

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| Celular não mostra a versão nova | `VERSAO` do `sw.js` não foi alterada | Subir o nome do cache e publicar de novo; no celular, fechar e abrir o app 2 vezes |
| Actions vermelho | Algum teste falhou | Abra o log da execução, corrija e envie de novo. Nada foi publicado |
| Actions verde, mas o app não mudou | Cache do navegador/service worker | Janela anônima ou desregistrar o service worker |
| `npm test` falha só no computador novo | Node antigo (< 20) ou `npm install` não rodou | Atualize o Node e rode `npm install` |
| Página 404 depois de mudar a estrutura | Pages ainda aponta para a pasta errada | Settings → Pages → Source: **GitHub Actions** |
