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
