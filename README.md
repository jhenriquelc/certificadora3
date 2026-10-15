# Certificadora 3

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim aeque doleamus animo, cum corpore dolemus, fieri tamen permagna accessio potest, si aliquod aeternum et infinitum.

## Developing

Requisitos: Node 20.19+ (ou 22+), Docker e pnpm (`corepack enable pnpm`).

```sh
pnpm install
cp .env.example .env   # preencha BETTER_AUTH_SECRET (ex.: openssl rand -base64 32)
```

### Opção 1: banco no Docker, app local

```sh
docker compose up -d db   # Postgres em localhost:5434 (mude com DB_PORT)
pnpm run db:push          # cria as tabelas
pnpm run dev
```

### Opção 2: tudo no Docker

```sh
docker compose --profile app up --build
```

O app fica em http://localhost:5173 (mude com APP_PORT) com hot reload; o schema é aplicado automaticamente ao subir.

## Building

To create a production version of your app:

```sh
pnpm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
