## Class Manager

API simples para gerenciar cursos (criar, listar, buscar por id, atualizar e deletar).

Projeto escrito em TypeScript usando Fastify e Drizzle ORM com PostgreSQL.

## Índice

- Descrição
- Requisitos
- Instalação
- Variáveis de ambiente
- Scripts úteis
- Executando em desenvolvimento
- Banco de dados / Migrações
- Endpoints da API
- Observações

## Descrição

Essa aplicação fornece uma API REST mínima para gerenciar cursos. Ela expõe endpoints para criar, listar, buscar por id, atualizar e deletar cursos.

O servidor principal está em `server.ts` e as rotas estão em `src/routes/`.

## Requisitos

- Node.js (recomenda-se v18+)
- PostgreSQL (ou outro banco compatível configurado via connection string)
- `npm` ou `pnpm`/`yarn` para instalar dependências

## Tecnologias

- Fastify 5
- TypeScript
- Drizzle ORM + PostgreSQL
- Zod (validação)
- Swagger/OpenAPI + Scalar API Reference (em `/docs` quando `NODE_ENV=development`)

## Instalação

No diretório do projeto, instale as dependências:

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz com as variáveis necessárias (exemplo mínimo):

```
DATABASE_URL=postgres://user:password@localhost:5432/classmanager
NODE_ENV=development
```

Adapte a `DATABASE_URL` conforme seu ambiente.

## Scripts úteis (conforme `package.json`)

- `npm run dev` — executa o servidor em modo de desenvolvimento (usa `server.ts` com watch e carregamento das variáveis do `.env`).
- `npm run db:generate` — gera artefatos do Drizzle (`drizzle-kit generate`).
- `npm run db:migrate` — aplica migrações com Drizzle (`drizzle-kit migrate`).
- `npm run db:studio` — inicia o Drizzle Studio (`drizzle-kit studio`).

## Executando em desenvolvimento

Com as variáveis de ambiente configuradas, rode:

```bash
npm run dev
```

Isso levantará o servidor em `http://localhost:3000` (conforme `server.ts`). Quando `NODE_ENV=development`, a API e a documentação estarão disponíveis:

- OpenAPI/Swagger (registrado via `@fastify/swagger`).
- UI adicional em `/docs` (registrado via `@scalar/fastify-api-reference`) — apenas em desenvolvimento.

## Banco de dados / Migrações

O projeto usa Drizzle ORM. As migrações e o schema estão no diretório `drizzle/` e os snapshots em `drizzle/meta/`.

Com o `DATABASE_URL` configurado, rode:

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

## Endpoints da API

Base: `http://localhost:3000`

- GET /courses

  - Descrição: Lista todos os cursos
  - Response 200:
    ```json
    {
      "courses": [
        { "id": "uuid", "title": "Título", "description": "Descrição" }
      ]
    }
    ```

- GET /courses/:id

  - Descrição: Retorna um curso pelo ID
  - Params: `id` (UUID)
  - Response 200:
    ```json
    {
      "course": { "id": "uuid", "title": "Título", "description": "Descrição" }
    }
    ```
  - Response 404: sem conteúdo (curso não encontrado)

- POST /courses

  - Descrição: Cria um novo curso
  - Body (JSON):
    ```json
    {
      "title": "Nome do curso",
      "description": "Descrição do curso"
    }
    ```
  - Response 201:
    ```json
    { "courseId": "uuid" }
    ```

- PATCH /courses/:id

  - Descrição: Atualiza um curso (título e/ou descrição)
  - Params: `id` (UUID)
  - Body esperado: o código atual passa `title` e `description` via parâmetros, porém a intenção comum é enviar via body. Veja Observações.
  - Response 200:
    ```json
    {
      "course": {
        "id": "uuid",
        "title": "Novo título",
        "description": "Nova descrição"
      }
    }
    ```
  - Response 400: entrada inválida

- DELETE /courses/:id
  - Descrição: Deleta um curso pelo ID
  - Params: `id` (UUID)
  - Response 201:
    ```json
    { "message": "Course deleted" }
    ```
  - Response 404:
    ```json
    { "message": "Course not foun" }
    ```

## Fluxo principal (Diagrama)

![Diagrama de fluxo](./assets/diagram.svg)

<details>
<summary>Diagrama Mermaid (fonte)</summary>

```mermaid
sequenceDiagram
  participant C as Client
  participant S as Fastify Server
  participant V as Zod Validator
  participant DB as Drizzle + PostgreSQL

  C->>S: POST /courses {title}
  S->>V: Validar body
  V-->>S: OK ou Erro 400
  alt válido
    S->>DB: INSERT INTO courses (title)
    DB-->>S: {id}
    S-->>C: 201 {courseId}
  else inválido
    S-->>C: 400
  end

  C->>S: GET /courses
  S->>DB: SELECT id,title FROM courses
  DB-->>S: lista
  S-->>C: 200 {courses: [...]}

  C->>S: GET /courses/:id
  S->>V: Validar param id (uuid)
  V-->>S: OK ou Erro 400
  alt encontrado
    S->>DB: SELECT * FROM courses WHERE id=...
    DB-->>S: course
    S-->>C: 200 {course}
  else não encontrado
    S-->>C: 404
  end
```

</details>

## Scripts

- `npm run dev`: inicia o servidor com reload e carrega variáveis de `.env`
- `npm run db:generate`: gera artefatos do Drizzle a partir do schema
- `npm run db:migrate`: aplica migrações no banco
- `npm run db:studio`: abre o Drizzle Studio

## Dicas e solução de problemas

- Conexão recusada ao Postgres: confirme `docker compose up -d` e que a porta `5432` não está em uso.
- Variável `DATABASE_URL` ausente: verifique seu `.env`. O Drizzle exige essa variável para `db:generate`, `db:migrate` e `db:studio`.
- Docs não aparecem em `/docs`: garanta `NODE_ENV=development` no `.env` e reinicie o servidor.

## Licença

ISC (ver `package.json`).
