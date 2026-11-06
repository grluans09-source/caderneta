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

## 6. Plano: migrar para o Netlify e deixar o GitHub privado

**Por quê:** o GitHub Pages gratuito só publica de repositório **público**. O Netlify publica a partir de repositório **privado**, de graça, com endereço mais bonito e controle de cache.

**Atenção (dados):** o app guarda os dados **por endereço**. No endereço novo, o app começa **vazio**. Por isso a troca precisa de **aviso e cópia** (passo 4). Se hoje só o dono usa, é só guardar e recuperar uma cópia.

Ordem certa (não pule etapas):
1. **Criar a conta no Netlify** (gratuita) com o e-mail pessoal. *(Só o dono pode fazer: criar conta e autorizar o GitHub.)*
2. **Conectar o repositório:** "Add new site" → "Import an existing project" → GitHub → repositório `caderneta`. Configuração: pasta de publicação `app`, sem comando de build. (Ou usar o arquivo `netlify.toml` abaixo.)
3. **Testar o endereço novo** no celular: abrir, instalar na tela inicial, usar sem internet.
4. **Aviso no endereço antigo** (versão 1.x): uma faixa "Mudamos de endereço" com botão **Guardar uma cópia** e o link do novo. Cada pessoa guarda a cópia, abre o novo e usa **Recuperar de uma cópia**.
5. Passar os dados do dono.
6. Só **depois** de todos estarem no endereço novo: tornar o repositório **privado** (GitHub → Settings → Danger zone → *Change repository visibility*). ⚠ O endereço `github.io` **para de funcionar** nesse momento. Desligue também o workflow do Pages (ou deixe falhar sem problema).
7. Atualizar `README.md` (link do app), `CLAUDE.md` e este documento com o endereço novo.

`netlify.toml` (colocar na raiz do repositório quando for migrar):
```toml
[build]
  publish = "app"

# o celular precisa buscar o sw.js e o HTML sempre atualizados
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

Depois da migração, o fluxo continua o mesmo: `git push` publica sozinho (o Netlify roda o deploy). Se quiser manter os testes bloqueando a publicação, mantenha o workflow de testes do GitHub (sem a parte do Pages) e configure o Netlify para só publicar quando o check passar.

**Domínio próprio (opcional):** no Netlify → Domain management. Se mudar de endereço de novo, o problema dos dados por endereço volta: só mude com aviso e cópia.

## 7. Problemas comuns

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| Celular não mostra a versão nova | `VERSAO` do `sw.js` não foi alterada | Subir o nome do cache e publicar de novo; no celular, fechar e abrir o app 2 vezes |
| Actions vermelho | Algum teste falhou | Abra o log da execução, corrija e envie de novo. Nada foi publicado |
| Actions verde, mas o app não mudou | Cache do navegador/service worker | Janela anônima ou desregistrar o service worker |
| `npm test` falha só no computador novo | Node antigo (< 20) ou `npm install` não rodou | Atualize o Node e rode `npm install` |
| Página 404 depois de mudar a estrutura | Pages ainda aponta para a pasta errada | Settings → Pages → Source: **GitHub Actions** |
