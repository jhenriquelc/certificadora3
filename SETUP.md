# Roteiro de Execução e Testes — Meninas Digitais UTFPR-CP

Este roteiro explica como baixar, compilar, executar e testar o site do projeto de extensão Meninas Digitais UTFPR-CP, no estado da branch `entrega-parcial` do repositório [jhenriquelc/certificadora3](https://github.com/jhenriquelc/certificadora3).

Vídeo de instrução: https://drive.google.com/file/d/1bqB-61Olcce1XYSx546IvtNTOz7woQwj/

## Equipe e objetivo do sistema

**Equipe:** Equipe 2. Integrantes que aparecem no histórico do repositório:

- João Henrique L. Corrêa ([@jhenriquelc](https://github.com/jhenriquelc))
- Juliano Moreto Massoca ([@JulianoMXM](https://github.com/JulianoMXM))
- Pedro Henrique Sauné
- José Augusto de Barros Ardenghi 

**Objetivo:** dar ao projeto de extensão Meninas Digitais UTFPR-CP um site para divulgar seus eventos e receber inscrições. Visitantes se inscrevem sem criar conta (nome, e-mail e RA). Membros da equipe organizadora, com login, criam e gerenciam os eventos e veem os inscritos. Um administrador cadastra e inativa as contas da equipe.

| Papel         | Como existe              | Pode                                                      |
| ------------- | ------------------------ | --------------------------------------------------------- |
| Visitante     | Sem conta                | Ver eventos publicados e se inscrever                     |
| Usuário       | Conta com `role = user`  | Criar, editar e cancelar eventos e ver os inscritos       |
| Administrador | Conta com `role = admin` | Tudo do usuário + cadastrar, inativar e reativar usuários |

## Funcionalidades desenvolvidas

Nesta entrega parcial, o login da equipe e a base de dados estão prontos. As telas de eventos e de gestão de usuários ainda não existem.

| Funcionalidade                                                                                           | Onde                                     | Estado                      |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------------------- |
| Página inicial com o cabeçalho da marca (logo e menu responsivo)                                         | `/`                                      | Pronta, conteúdo provisório |
| Login da equipe com e-mail e senha e mensagens de erro em português                                      | `/admin/login`                           | Pronta                      |
| Área restrita: saudação ao usuário logado e botão de sair. Quem não está logado é redirecionado ao login | `/admin`                                 | Pronta, tela provisória     |
| Papéis `user` e `admin`, que o cliente não consegue alterar                                              | Servidor                                 | Pronta                      |
| Cadastro público desligado: só o administrador cria contas                                               | Servidor                                 | Pronta                      |
| Inativação de contas sem apagá-las. Conta inativa não consegue entrar e tem as sessões encerradas        | Servidor (`src/lib/server/users.ts`)     | Pronta, sem tela            |
| Criação do primeiro administrador por script                                                             | `pnpm db:seed`                           | Pronta                      |
| Tabelas de eventos (`event`) e inscrições (`event_registration`, RA único por evento)                    | Banco de dados                           | Pronta, sem tela            |
| Telas de eventos, inscrição, painel e gestão de usuários                                                 | `/eventos`, `/painel`, `/admin/usuarios` | Pendente                    |
| Eventos passados                                                                                         | `/arquivo` (já linkada no menu)          | Pendente (dá 404)           |

## Ferramentas para codificar, compilar e executar

As versões abaixo são as mínimas exigidas ou as que estão instaladas pelo `pnpm-lock.yaml` da branch.

| Ferramenta         | Versão                             | Para quê                                                                | Link                                                    |
| ------------------ | ---------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------- |
| Git                | qualquer versão recente            | Baixar o código                                                         | [git-scm.com](https://git-scm.com/)                     |
| Node.js            | 20.19+ ou 22+ (22 recomendado)     | Executar o app e os scripts                                             | [nodejs.org](https://nodejs.org/)                       |
| pnpm               | 10+ (via Corepack)                 | Instalar as dependências e rodar os scripts                             | [pnpm.io](https://pnpm.io/)                             |
| TypeScript         | 6.0.3                              | Linguagem do projeto (modo `strict`)                                    | [typescriptlang.org](https://www.typescriptlang.org/)   |
| Svelte             | 5.57                               | Componentes da interface (modo runes)                                   | [svelte.dev](https://svelte.dev/)                       |
| SvelteKit          | 2.70                               | Framework web (rotas, servidor, build)                                  | [svelte.dev/docs/kit](https://svelte.dev/docs/kit)      |
| Vite               | 8.3                                | Servidor de desenvolvimento e build                                     | [vite.dev](https://vite.dev/)                           |
| Visual Studio Code | qualquer versão recente (opcional) | Editor usado pela equipe; o repositório traz configuração em `.vscode/` | [code.visualstudio.com](https://code.visualstudio.com/) |

O Node 22+ é obrigatório apenas para `pnpm auth:schema`, que a equipe só usa ao mudar a autenticação.

## Ferramentas para criar e hospedar o banco de dados

O banco roda localmente em um container Docker. Não é preciso instalar o PostgreSQL na máquina.

| Ferramenta                                             | Versão                    | Para quê                                                                | Link                                                                             |
| ------------------------------------------------------ | ------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| PostgreSQL                                             | 18 (imagem `postgres:18`) | Banco de dados relacional                                               | [postgresql.org](https://www.postgresql.org/)                                    |
| Docker Engine ou Docker Desktop, com Docker Compose v2 | qualquer versão recente   | Hospedar o banco (e, opcionalmente, o app)                              | [docs.docker.com/get-docker](https://docs.docker.com/get-docker/)                |
| Drizzle ORM                                            | 0.45.3                    | Acesso ao banco pelo código TypeScript                                  | [orm.drizzle.team](https://orm.drizzle.team/)                                    |
| Drizzle Kit                                            | 0.31.11                   | Criar as tabelas (`db:push`), gerar e aplicar migrações, Drizzle Studio | [orm.drizzle.team/docs/kit-overview](https://orm.drizzle.team/docs/kit-overview) |
| postgres (Postgres.js)                                 | 3.4.9                     | Driver de conexão usado pelo Drizzle e pelo script de seed              | [github.com/porsager/postgres](https://github.com/porsager/postgres)             |

O container `db` (arquivo `compose.yaml`) expõe o banco em `localhost:5434`, com usuário `root`, senha `mysecretpassword` e banco `local`. Os dados ficam no volume `pgdata`.

## Bibliotecas e ferramentas complementares

Todas são instaladas automaticamente pelo `pnpm install`. Nenhuma precisa ser instalada à parte, exceto o Chromium do Playwright para os testes de navegador.

| Biblioteca             | Versão  | Para quê                                                      | Link                                                                            |
| ---------------------- | ------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Better Auth            | 1.7.5   | Autenticação por e-mail e senha, sessões e cookies            | [better-auth.com](https://www.better-auth.com/)                                 |
| Tailwind CSS           | 4.3.3   | Estilos (com os plugins `forms` e `typography`)               | [tailwindcss.com](https://tailwindcss.com/)                                     |
| Flowbite               | 4.0.2   | Tema e plugin de componentes para o Tailwind                  | [flowbite.com](https://flowbite.com/)                                           |
| Flowbite Svelte        | 1.33.1  | Componentes de interface (navbar, botões, formulários)        | [flowbite-svelte.com](https://flowbite-svelte.com/)                             |
| Flowbite Svelte Blocks | 2.1.0   | Blocos de layout (`Section`, `Content`)                       | [flowbite-svelte-blocks.vercel.app](https://flowbite-svelte-blocks.vercel.app/) |
| @sveltejs/adapter-auto | 7.0.1   | Adaptador de deploy do SvelteKit                              | [svelte.dev/docs/kit/adapters](https://svelte.dev/docs/kit/adapters)            |
| Vitest                 | 4.1.11  | Testes automatizados (cliente, servidor e Storybook)          | [vitest.dev](https://vitest.dev/)                                               |
| Playwright             | 1.63.0  | Navegador Chromium para os testes de componentes              | [playwright.dev](https://playwright.dev/)                                       |
| Storybook              | 10.6.0  | Catálogo de componentes isolados, com addon de acessibilidade | [storybook.js.org](https://storybook.js.org/)                                   |
| ESLint                 | 10.11.0 | Análise estática do código                                    | [eslint.org](https://eslint.org/)                                               |
| Prettier               | 3.9.8   | Formatação do código                                          | [prettier.io](https://prettier.io/)                                             |
| svelte-check           | 4.6     | Checagem de tipos dos arquivos Svelte                         | [npmjs.com/package/svelte-check](https://www.npmjs.com/package/svelte-check)    |

## Roteiro: criar e executar o banco de dados

Antes, faça os passos 1 a 4 da seção seguinte (baixar o código, instalar as dependências e criar o `.env`). Os comandos de banco usam o `DATABASE_URL` e as variáveis `ADMIN_*` desse arquivo.

1. Suba o container do PostgreSQL e espere ele ficar saudável:

   ```sh
   docker compose up -d db
   docker compose ps          # o serviço db deve aparecer como "healthy"
   ```

2. Crie as tabelas a partir de `src/lib/server/db/schema.ts`. O comando cria as tabelas de autenticação (`user`, `session`, `account`, `verification`) e as da aplicação (`event`, `event_registration`):

   ```sh
   pnpm db:push
   ```

3. Crie o primeiro administrador com os dados de `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` (mínimo de 8 caracteres) do `.env`:

   ```sh
   pnpm db:seed               # imprime "Created admin <e-mail>."
   ```

4. (Opcional) Abra o Drizzle Studio para ver as tabelas e os dados no navegador:

   ```sh
   pnpm db:studio
   ```

Para parar o banco, use `docker compose stop db`. Para apagar tudo e recomeçar do zero, use `docker compose down -v`, que remove o volume com os dados. O `db:seed` pode ser rodado de novo sem problema: se o admin já existe, ele reativa a conta e redefine a senha para o `ADMIN_PASSWORD` atual do `.env`. Se o login der "E-mail ou senha incorretos" depois de mudar o `.env`, rode o seed de novo.

## Roteiro: baixar o código, compilar e executar a aplicação

1. Baixe o código e entre na branch desta entrega:

   ```sh
   git clone https://github.com/jhenriquelc/certificadora3.git
   cd certificadora3
   git checkout entrega-parcial
   ```

2. Ative o pnpm (vem com o Node pelo Corepack) e instale as dependências:

   ```sh
   corepack enable pnpm
   pnpm install
   ```

3. Crie o arquivo de configuração a partir do exemplo:

   ```sh
   cp .env.example .env
   ```

4. Edite o `.env` e preencha:
   - `BETTER_AUTH_SECRET`: uma chave aleatória, gerada com `openssl rand -base64 32`.
   - `ADMIN_EMAIL` e `ADMIN_PASSWORD`: o login do primeiro administrador (senha com 8 caracteres ou mais).
   - `DATABASE_URL` e `ORIGIN` já vêm prontos para o ambiente local.
5. Crie o banco e o administrador seguindo a seção anterior (`docker compose up -d db`, `pnpm db:push`, `pnpm db:seed`).
6. Execute o servidor de desenvolvimento e abra <http://localhost:5173>:

   ```sh
   pnpm dev
   ```

7. (Opcional) Compile a versão de produção e pré-visualize-a:

   ```sh
   pnpm build
   pnpm preview               # http://localhost:4173
   ```

   O login usa o `ORIGIN` do `.env`. Para entrar pelo `preview`, troque o `ORIGIN` para `http://localhost:4173` antes do build.

**Alternativa, tudo no Docker:** depois dos passos 1, 3 e 4, rode `docker compose --profile app up --build`. O container do app instala as dependências, cria as tabelas e sobe em <http://localhost:5173> com recarregamento automático. Em outro terminal, crie o admin com `docker compose exec app pnpm db:seed`.

## Roteiro de testes

O administrador precisa existir antes de qualquer outro teste, porque o cadastro público está desligado e só ele cria contas. Por isso, rode o `pnpm db:seed` antes de começar. Quando as telas de eventos existirem, a ordem será: admin → contas da equipe → eventos → inscrições de visitantes.

### Testes manuais no navegador

1. **Página inicial.** Abra <http://localhost:5173>. O cabeçalho mostra o logo do Meninas Digitais e o link "Eventos Passados". Reduza a janela para cerca de 375 px: o menu vira um botão hambúrguer.
2. **Rota protegida.** Sem estar logado, abra <http://localhost:5173/admin>. Você deve ser redirecionado para `/admin/login`.
3. **Login com senha errada.** Use o e-mail do admin com uma senha qualquer. A tela mostra "E-mail ou senha incorretos".
4. **Login correto.** Use `ADMIN_EMAIL` e `ADMIN_PASSWORD` do `.env`. Você vai para `/admin`, que mostra o nome e o ID do usuário (texto provisório, em inglês).
5. **Sessão ativa.** Ainda logado, abra `/admin/login`. Você deve voltar direto para `/admin`.
6. **Sair.** Clique em "Sign out". Você volta para a tela de login, e `/admin` volta a redirecionar.
7. **Conta inativa.** Ainda não há tela para isso, então inative o admin pelo banco:

   ```sh
   docker compose exec db psql -U root -d local -c "update \"user\" set deactivated_at = now() where email = '<ADMIN_EMAIL>'"
   ```

   Tente entrar de novo: a tela mostra "Não foi possível entrar" e o login é recusado. Rode `pnpm db:seed` para reativar a conta e confirme que o login volta a funcionar.

8. **Dados no banco.** Com `pnpm db:studio`, confira as tabelas `user` (coluna `role = admin`), `session` (uma linha por login) e `account` (senha guardada como hash).

### Testes automatizados

```sh
pnpm exec playwright install chromium   # uma vez, para os testes de navegador
pnpm test                               # Vitest: projetos client, server e storybook
pnpm lint                               # Prettier + ESLint
pnpm check                              # checagem de tipos
pnpm storybook                          # catálogo de componentes em http://localhost:6006
```

Nesta entrega, os testes automatizados ainda são os exemplos do template (`src/lib/vitest-examples` e `src/stories`). O CI do GitHub roda `pnpm lint` e `pnpm check` em todo pull request.

## Contas de acesso padrão

O sistema não traz nenhuma senha fixa no código. A conta inicial é a do administrador criada pelo `pnpm db:seed`, com os dados que você colocou no `.env`.

| Conta                       | Login                                                            | Senha                                              | Onde se define                             |
| --------------------------- | ---------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------ |
| Administrador do site       | valor de `ADMIN_EMAIL` (sugestão: `admin@meninasdigitais.local`) | valor de `ADMIN_PASSWORD` (sugestão: `admin12345`) | `.env`, aplicado por `pnpm db:seed`        |
| Banco de dados (PostgreSQL) | `root`                                                           | `mysecretpassword`                                 | `compose.yaml` (banco `local`, porta 5434) |

As sugestões servem só para testes locais. Em qualquer ambiente compartilhado, use outra senha e um `BETTER_AUTH_SECRET` próprio. Contas com papel `user` ainda não podem ser criadas pela interface, apenas pela função `createUser` em `src/lib/server/users.ts`.
