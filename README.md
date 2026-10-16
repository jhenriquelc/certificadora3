# Certificadora 3

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim aeque doleamus animo, cum corpore dolemus, fieri tamen permagna accessio potest, si aliquod aeternum et infinitum.

Stack: SvelteKit 2 + Svelte 5, TypeScript, Tailwind CSS v4 + Flowbite-Svelte, Drizzle ORM + PostgreSQL, Better Auth, Vitest e Storybook.

## Desenvolvimento

Requisitos: Node 20.19+ (ou 22+), Docker e pnpm (`corepack enable pnpm`).

```sh
pnpm install
cp .env.example .env   # preencha BETTER_AUTH_SECRET (ex.: openssl rand -base64 32)
```

### Opção 1: banco no Docker, app local

```sh
docker compose up -d db   # Postgres em localhost:5434 (mude com DB_PORT)
pnpm run db:push          # cria as tabelas
pnpm run db:seed          # cria o primeiro admin (preencha ADMIN_EMAIL e ADMIN_PASSWORD no .env)
pnpm run dev
```

### Opção 2: tudo no Docker

```sh
docker compose --profile app up --build
```

O app fica em http://localhost:5173 (mude com APP_PORT) com hot reload. O schema é aplicado automaticamente quando o container sobe.

### Alterações no banco de dados

Use `pnpm db:push` durante o desenvolvimento local quando quiser sincronizar diretamente o
PostgreSQL com `src/lib/server/db/schema.ts`. Esse comando não cria um histórico de migrações e
é adequado para bancos locais e descartáveis. Leia as operações exibidas antes de confirmar:
renomes ambíguos e remoções de tabelas ou colunas podem exigir uma escolha interativa e causar
perda de dados. Não use `db:push --force` sem revisar o impacto.

Use migrações versionadas quando a alteração precisar ser reproduzida de forma controlada em um
banco compartilhado, homologação ou produção:

```sh
pnpm db:generate   # gera os arquivos SQL a partir das mudanças em schema.ts
# revise os arquivos SQL gerados e inclua-os no controle de versão
pnpm db:migrate    # aplica no banco as migrações ainda pendentes
```

`db:migrate` apenas aplica migrações que já foram geradas; ele não compara automaticamente o
banco com `schema.ts`. Antes de aplicá-las fora do ambiente local, faça backup do banco, revise o
SQL e teste a migração em um ambiente equivalente. Não misture `db:push` e migrações versionadas
no mesmo ambiente compartilhado, pois alterações feitas por `push` não ficam registradas no
histórico de migrações.

## Qualidade

```sh
pnpm lint       # Prettier + ESLint
pnpm format     # formata o código
pnpm check      # checagem de tipos (svelte-check)
pnpm test       # testes (Vitest: client, server e storybook)
pnpm storybook  # catálogo de componentes em http://localhost:6006
```

O CI (`.github/workflows/quality.yml`) roda `pnpm lint` e `pnpm check` em todo pull request.

## Build

Para gerar a versão de produção:

```sh
pnpm run build
```

Para pré-visualizar o build, use `pnpm run preview`.

> Para fazer deploy, pode ser preciso instalar um [adapter](https://svelte.dev/docs/kit/adapters) para o ambiente de destino.
