# AGENTS.md

Regras do repositório **certificadora3**: o site do projeto de extensão **Meninas Digitais UTFPR-CP**. Este arquivo é a fonte única das regras para agentes de IA (Claude Code, Copilot, Codex etc.). O Claude Code o carrega via `.claude/CLAUDE.md`.

## 1. Idioma

| O quê                                                                              | Idioma                                                                                                                                    |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Código: identificadores, nomes de arquivos/componentes, tabelas e colunas do banco | **Inglês**                                                                                                                                |
| Comentários no código                                                              | Inglês                                                                                                                                    |
| Textos visíveis ao usuário (UI, `alt`, `<title>`, mensagens de erro exibidas)      | **Português (pt-BR)**                                                                                                                     |
| Slugs de rotas visíveis (ex.: `/arquivo`)                                          | Português, sem acento, em kebab-case                                                                                                      |
| Documentação, README, AGENTS.md, descrições de PR                                  | **Português (pt-BR)**                                                                                                                     |
| Conversa com o agente                                                              | **Português (pt-BR)**                                                                                                                     |
| Mensagens de commit                                                                | Conventional Commits: `tipo(escopo): descrição`; tipo/escopo em inglês e descrição em pt-BR (ex.: `feat(nav): adicionar link de eventos`) |

## 2. Stack

- **Gerenciador de pacotes:** `pnpm` (nunca `npm`/`yarn`). Node 20.19+ ou 22+ (`engine-strict=true`).
- **Framework:** SvelteKit 2 + **Svelte 5 em modo runes forçado** (`vite.config.ts`). Nada de sintaxe do Svelte 4 (`export let`, `on:click`, `<slot>`, `$:`).
- **Linguagem:** TypeScript em modo `strict`.
- **Estilo:** Tailwind CSS v4 (configurado via CSS em `src/routes/layout.css`, não existe `tailwind.config`) + plugins `forms`, `typography` e `flowbite/plugin`.
- **Componentes de UI:** `flowbite-svelte` e `flowbite-svelte-blocks`.
- **Banco:** PostgreSQL 18 (Docker) + Drizzle ORM (`postgres-js`) + `drizzle-kit`.
- **Autenticação:** Better Auth (e-mail e senha) com o adapter do Drizzle e o plugin `sveltekitCookies`.
- **Testes:** Vitest 4 em três projetos (ver §6) + Playwright (Chromium) para testes no navegador.
- **Componentes isolados:** Storybook 10 (`@storybook/sveltekit`, CSF em Svelte, addon a11y).
- **Qualidade:** ESLint 10 (flat config) + Prettier (tabs, aspas simples, sem trailing comma, largura 100, ordenação de classes Tailwind).
- **Adapter:** `@sveltejs/adapter-auto` (o destino de deploy ainda não foi definido).
- **CI:** `.github/workflows/quality.yml` roda `pnpm lint` e `pnpm check` em todo PR. O Dependabot atualiza npm e Actions semanalmente.

Todas as dependências ficam em `devDependencies` (convenção do template do SvelteKit, já que o app é empacotado). Para adicionar uma: `pnpm add -D <pacote>`.

## 3. Arquitetura

```
src/
  app.d.ts               # App.Locals: user?, session? (Better Auth)
  app.html
  hooks.server.ts        # Carrega a sessão em event.locals e delega ao svelteKitHandler
  lib/
    assets/              # Assets importados pelo código (favicon)
    components/          # Componentes reutilizáveis (ex.: MDHeader.svelte)
    server/              # SOMENTE servidor; não pode ser importado no cliente
      auth.ts            # Instância do Better Auth (campo extra `role`, cadastro público desligado)
      users.ts           # Cadastro e gestão de usuários (usado pelo admin)
      db/
        index.ts         # Cliente do Drizzle
        schema.ts        # Tabelas da aplicação (event, event_registration) + re-export de auth.schema
        auth.schema.ts   # GERADO por `pnpm auth:schema`; não editar à mão
  routes/                # Rotas (file-based routing)
    layout.css           # Tema do Tailwind/Flowbite (cores, fontes)
    demo/                # Exemplo do template (Better Auth); será removido
  stories/               # Exemplos do Storybook gerados pelo template
static/img/              # Imagens servidas como estão (logos)
scripts/seed-admin.js    # `pnpm db:seed`: cria o primeiro admin a partir do .env
```

Regras:

1. **Separação servidor/cliente.** Acesso a banco, segredos e Better Auth ficam só em `$lib/server/**`, `+page.server.ts`, `+layout.server.ts`, `+server.ts` e `hooks.server.ts`.
2. **Carregamento de dados** com funções `load` em `+page.server.ts`/`+layout.server.ts`. **Mutações** com _form actions_ + `use:enhance`. Retorne erros de validação com `fail(status, { message })`.
3. **Autenticação:** leia o usuário em `event.locals.user`. Proteja as rotas na função `load` com `redirect(302, ...)`. Se várias rotas compartilharem a mesma proteção, use um `+layout.server.ts` no grupo de rotas.
4. **Variáveis de ambiente** via `$env/dynamic/private` (ou `static`) e nunca `process.env` no código do app. Variável nova deve entrar no `.env.example` com um comentário.
5. **Links internos** com `resolve()` de `$app/paths` (regra `svelte/no-navigation-without-resolve`).
6. **Estado reativo** com runes: `$state`, `$derived` para valores calculados (não `$effect`), `$props`, `$bindable`. Use snippets e `{@render}` no lugar de slots, e sempre passe uma chave nos blocos `{#each}`.
7. **Banco:** declare as tabelas em `src/lib/server/db/schema.ts` com nomes em inglês, colunas em `snake_case` no banco e `camelCase` no TS. As tabelas de auth vêm só de `pnpm auth:schema`.
8. **Código de exemplo do template** (`src/routes/demo`, `src/lib/vitest-examples`, `src/stories`) pode ser substituído ou removido. Não use esse código como base de funcionalidades reais sem adaptá-lo (as telas de demo não usam Flowbite e têm texto em inglês).

### Modelo de dados e papéis

| Papel             | Como existe                                                                      | Pode                                                                                                   |
| ----------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Visitante**     | Sem conta. Cada inscrição é uma linha em `event_registration` (nome, e-mail, RA) | Ver eventos publicados e se inscrever                                                                  |
| **Usuário**       | `user.role = 'user'`                                                             | Tudo do visitante + criar, editar e cancelar **qualquer** evento e ver os inscritos de qualquer evento |
| **Administrador** | `user.role = 'admin'`                                                            | Tudo do usuário + cadastrar, inativar e reativar usuários (única diferença)                            |

- **`user`** (Better Auth): `role` é um `additionalField` com `input: false`, então o cliente não consegue defini-lo. A coluna `image` existe porque faz parte do núcleo do Better Auth e não pode ser removida, mas fica sem uso. Não use o plugin `admin` do Better Auth, porque ele adiciona campos de banimento que o projeto não quer.
- **Inativação (soft delete):** contas nunca são apagadas. `deactivateUser` preenche `user.deactivatedAt` e encerra as sessões abertas; `reactivateUser` limpa o campo. Conta inativa não consegue fazer login (hook `session.create.before` em `auth.ts`) e é ignorada em `hooks.server.ts`. Para listar só contas ativas, filtre por `isNull(user.deactivatedAt)`. O `pnpm db:seed` reativa o admin se ele estiver inativo.
- **Cadastro de usuários:** o cadastro público está desligado (`disableSignUp`). Contas são criadas por `createUser` em `$lib/server/users.ts`, que não abre sessão (o admin continua logado). O primeiro admin vem de `pnpm db:seed`.
- **`event`**: `title`, `slug` (único), `description`, `location`, `startsAt`, `endsAt`, `capacity` (vazio = sem limite), `status` (`draft | published | cancelled`) e `createdById`, que continua apontando para o autor mesmo se a conta dele for inativada.
- **`event_registration`**: `eventId` (apagada junto com o evento), `name`, `email` e `ra`. O RA é `text` e é único por evento. O formato do RA e o limite de vagas são validados na form action.
- **Permissões** são verificadas no servidor (`load` e actions) com `locals.user?.role`.

## 4. Telas e UI

Telas atuais:

| Rota                                                    | Descrição                                 | Estado                  |
| ------------------------------------------------------- | ----------------------------------------- | ----------------------- |
| `/`                                                     | Home: `MDHeader` + conteúdo provisório    | Provisória              |
| `/arquivo`                                              | "Eventos Passados" (já linkada na navbar) | **Ainda não existe**    |
| `/demo`, `/demo/better-auth`, `/demo/better-auth/login` | Demo do template para login e cadastro    | Para remover/substituir |

Regras de tela:

- **Componentes Flowbite antes de HTML próprio** (`Navbar`, `Heading`, `P`, `A`, `Button`, `Input`, `Label`, `Section`, `Content`...). Componente próprio só quando o Flowbite não atende.
- **Cores só pelos tokens do tema** em `layout.css`: `primary-50…950` (roxo da marca), `brand-purple`, `brand-coral` e `brand-gold`. Não use hex soltos no markup. Cor nova vira token em `@theme`.
- **Tipografia:** títulos (`h1`–`h6`) usam `--font-display` (Candara/Merriweather Sans) e o corpo usa Lato. O tamanho base já é maior (`text-base` = 1.2rem). Não sobrescreva sem motivo.
- **Cabeçalho:** toda página pública mostra o `MDHeader`. Hoje ele é importado em cada página. Se ele virar global, mova-o para `+layout.svelte`.
- Toda página define `<svelte:head><title>… | Meninas Digitais UTFPR-CP</title></svelte:head>`.
- **Responsividade:** mobile-first, e a navbar usa `NavHamburger`. Teste em ~375px e em desktop.
- **Acessibilidade:** `alt` descritivo em pt-BR, labels em todos os inputs, contraste adequado com a paleta e HTML semântico. O addon a11y do Storybook está em modo `todo` (aponta problemas sem falhar).
- O dark mode existe via classe (`@custom-variant dark`) mas ainda não é usado. Não implemente sem pedido.
- Componentes reutilizáveis vão em `src/lib/components/` com nome em PascalCase. O prefixo `MD` indica componentes com a identidade do Meninas Digitais.

## 5. Comandos

```sh
pnpm install
cp .env.example .env            # preencher BETTER_AUTH_SECRET
docker compose up -d db         # Postgres em localhost:5434
pnpm db:push                    # aplica o schema (dev)
pnpm db:seed                    # cria o primeiro admin (ADMIN_* no .env)
pnpm dev                        # http://localhost:5173

pnpm lint        # prettier --check + eslint
pnpm format      # prettier --write
pnpm check       # svelte-kit sync + svelte-check (tipos)
pnpm test        # vitest --run (client, server, storybook)
pnpm storybook   # http://localhost:6006
pnpm auth:schema # regenera src/lib/server/db/auth.schema.ts (exige Node 22+)
pnpm db:generate / db:migrate / db:studio
```

Alternativa: `docker compose --profile app up --build` sobe banco + app com hot reload.

## 6. Testes

O Vitest separa três projetos (`vite.config.ts`). Todo teste precisa de pelo menos um `expect` (`requireAssertions`).

- `*.svelte.spec.ts` → **client**: roda no Chromium via `vitest-browser-svelte` e serve para componentes.
- `*.spec.ts` → **server**: roda em Node e serve para lógica pura, `load` e `actions`.
- `*.stories.svelte` → **storybook**: cada story vira um teste de renderização.

Os testes ficam ao lado do arquivo testado. Para rodar os testes de navegador, o Playwright precisa do Chromium (`pnpm exec playwright install chromium`).

## 7. Regras de comportamento do agente

1. Responda e escreva documentação em **pt-BR**. Escreva código em **inglês** (ver §1).
2. **Svelte:** antes de escrever ou editar `.svelte`/`.svelte.ts`, consulte a documentação oficial pelo MCP do Svelte (`list-sections` → `get-documentation`) ou pelo plugin `svelte@svelte` (habilitado em `.claude/settings.json`). Depois de editar, rode o `svelte-autofixer` até não sobrar nenhum problema. Sem o MCP, use `npx @sveltejs/mcp@latest -y --help`. Os detalhes estão em `.github/agents/svelte-file-editor.agent.md` e `.github/skills/`.
3. Use **sempre `pnpm`**. Não troque o gerenciador nem apague o `pnpm-lock.yaml`.
4. **Peça confirmação antes de** adicionar ou remover dependências, mudar o schema do banco, rodar `db:push --force`/`db:migrate`, apagar arquivos, fazer commit, push ou abrir PR.
5. **Não edite arquivos gerados:** `.svelte-kit/`, `src/lib/server/db/auth.schema.ts` (use `pnpm auth:schema`) e `pnpm-lock.yaml` (só via pnpm).
6. **Segredos:** nunca leia, imprima ou commite valores do `.env`. Configuração nova vai para o `.env.example`.
7. Siga o padrão do código ao redor e não adicione abstrações, dependências ou "melhorias" além do que foi pedido.
8. Rode o checklist da §8 antes de dar uma tarefa como concluída e informe o resultado com fidelidade. Se algo falhou ou não foi executado, diga isso.
9. Ao mudar setup, scripts, variáveis de ambiente ou rotas, atualize o `README.md` e este arquivo.

## 8. Critérios de pronto (Definition of Done)

Uma tarefa só está **pronta** quando:

- [ ] `pnpm lint` passa sem erros (rode `pnpm format` antes).
- [ ] `pnpm check` passa sem erros nem warnings novos.
- [ ] `pnpm test` passa. Funcionalidade nova ou bug corrigido tem teste (lógica → `*.spec.ts`; componente → `*.svelte.spec.ts` ou story).
- [ ] Os arquivos Svelte alterados passaram no `svelte-autofixer` sem pendências.
- [ ] O idioma segue a §1: código em inglês, e UI e documentação em pt-BR.
- [ ] Telas novas ou alteradas seguem a §4 (Flowbite, tokens do tema, `<title>`, responsivas, acessíveis) e foram verificadas no navegador com `pnpm dev`.
- [ ] Componente reutilizável novo em `src/lib/components/` tem story no Storybook.
- [ ] Mudança de schema: `schema.ts` atualizado e `pnpm db:push` (ou `db:generate`) executado localmente sem erro.
- [ ] Nenhum segredo, `console.log` de depuração ou código comentado esquecido.
- [ ] README/AGENTS.md/`.env.example` atualizados se o setup mudou.
- [ ] Commit no padrão Conventional Commits (§1), e o PR passa no workflow **Quality**.

## 9. Pendências conhecidas

- O `pnpm auth:schema` falha no Node 20 (`Object.groupBy`). Use Node 22+. O arquivo gerado sai com aspas duplas, então rode `pnpm format` depois.
- O `drizzle-kit push` pede confirmação interativa quando uma tabela some e outra aparece (ex.: `task` → `event`). Isso também quebra o `db:push --force` do container `app`. Nesses casos, apague a tabela antiga antes ou rode o push num terminal interativo.
- As telas de `/demo/better-auth` ainda têm o botão "Register", que agora falha porque o cadastro público está desligado.
- As telas de eventos (`/eventos`, `/painel`) e de administração (`/admin/usuarios`) ainda não existem.
- A rota `/arquivo` está linkada no `MDHeader`, mas não existe (dá 404). O `NavLi` usa `href` sem `resolve()`.
- A descrição do projeto no README ainda é _lorem ipsum_.

## 10. Ferramentas do MCP do Svelte

O MCP do Svelte (`.vscode/mcp.json` e o plugin `svelte@svelte` em `.claude/settings.json`) dá acesso à documentação do Svelte 5 e do SvelteKit e a uma análise de código:

1. **`list-sections`**: lista as seções de documentação disponíveis (título, `use_cases` e caminho). Use-a **primeiro** em qualquer tarefa sobre Svelte ou SvelteKit.
2. **`get-documentation`**: busca o conteúdo de uma ou mais seções. Depois do `list-sections`, analise os `use_cases` e busque **todas** as seções relevantes para a tarefa.
3. **`svelte-autofixer`**: analisa código Svelte e aponta problemas e sugestões. É **obrigatório** sempre que você escrever código Svelte. Repita até não sobrar nenhum problema.
4. **`playground-link`**: gera um link do Svelte Playground. Só ofereça quando o código não foi gravado em arquivos do projeto, e só gere depois que o usuário confirmar.
