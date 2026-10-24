# Backend

The planned backend is a Node.js and Express API written in **TypeScript**. It will handle
application operations, business rules, access control, and communication with MySQL and the Python
services.

> This guide covers backend status and conventions. See the [database guide](../database/README.md)
> for database plans and [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution and review workflow.
> Repository-owner settings are documented in [docs/repository-settings.md](../docs/repository-settings.md).

## Responsibilities

- Authenticate users and enforce role-based permissions.
- Validate requests and process sales and inventory operations.
- Read and update database records consistently.
- Coordinate forecasting and chatbot requests through internal service APIs.
- Record application audit events.

## Planned directory layout

Only `src/` exists so far. Create additional folders with the code that needs them.

| Path               | Planned purpose                                                     |
| ------------------ | ------------------------------------------------------------------- |
| `src/`             | Backend TypeScript source and eventual entry point.                 |
| `src/routes/`      | Endpoint definitions using RESTful resource paths.                  |
| `src/controllers/` | Request handlers that call services and return API responses.       |
| `src/services/`    | Business logic, database access, and Python service calls.          |
| `src/middleware/`  | Shared authentication, role checks, validation, and error handling. |
| `src/types/`       | Shared request, response, and domain types.                         |

## Current status

The backend API, Express runtime, dependencies, tests, and backend `tsconfig.json` are not
implemented. The root TypeScript project references only `tsconfig.app.json` and
`tsconfig.node.json`; its `typecheck` command currently covers the frontend and Vite config, not
backend code.

## Working repository checks (available now)

Run these from the repository root:

| Command                | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `npm run lint`         | Run ESLint.                                          |
| `npm run format:check` | Check formatting with Prettier.                      |
| `npm run typecheck`    | Run `tsc -b` for the configured TypeScript projects. |

When a backend `tsconfig.json` is added, strict mode is a requirement for that configuration, and
the root `typecheck` script must be extended to include it.

## Planned (not yet available): Environment and database setup

There is no `backend/.env.example` yet. Do not try to copy one. Real `.env` files must remain
untracked, and any future example file must contain placeholders only.

The following database provisioning and variables are plans, not setup steps to run today. Once
the database and backend are implemented, provision MySQL 8 with a dedicated least-privilege user
(not `root`) and add working setup instructions:

```sql
CREATE DATABASE pharmasense CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pharmasense_user'@'localhost' IDENTIFIED BY '<choose-a-strong-password>';
GRANT ALL PRIVILEGES ON pharmasense.* TO 'pharmasense_user'@'localhost';
```

Potential variable names (the actual environment contract is not defined yet):

| Variable               | Planned description                    |
| ---------------------- | -------------------------------------- |
| `PORT`                 | API port.                              |
| `DB_HOST`              | MySQL host.                            |
| `DB_PORT`              | MySQL port (default `3306`).           |
| `DB_NAME`              | Database name.                         |
| `DB_USER`              | Database user.                         |
| `DB_PASSWORD`          | Database password.                     |
| `JWT_SECRET`           | Long, random token-signing secret.     |
| `JWT_EXPIRES_IN`       | Token lifetime (for example `1h`).     |
| `FORECAST_SERVICE_URL` | URL of the Python forecasting service. |

Environment variables must never be hard-coded in source files.

## Planned tests

Vitest and Supertest are candidates for API tests, with tests colocated with the related code (for
example, `inventoryController.test.ts`). Tests should use synthetic data and a separate test
database or mocks, never development or production records. Prioritize POS totals, FEFO batch
selection, expiry and low-stock alerts, role permissions, and forecast calculations.

## Coding conventions

These naming and implementation conventions are guidance for manual review. ESLint and Prettier
are configured at the repository root, but they do not automatically enforce the naming rules.

- Route and controller files use lowerCamelCase with a `.ts` extension (for example,
  `inventoryController.ts` and `posRoutes.ts`).
- Functions and variables use lowerCamelCase; types and interfaces use UpperCamelCase without an
  `I` prefix. Constants use UPPER_SNAKE_CASE.
- Use kebab-case plural resource paths and RESTful HTTP methods, such as `GET /api/products`.
- Use parameterized queries; never build SQL by string concatenation.
- Add `strict` mode alongside the backend `tsconfig.json` when backend TypeScript is introduced.
- Use double quotes for TypeScript strings, matching the current Prettier configuration.
- Use `unknown` and narrow it rather than using `any`. Avoid non-null assertions and `@ts-ignore`.

## Planned API contract

Responses with a body will use this envelope:

```ts
interface ApiResponse<T> {
  status: "success" | "error";
  data: T | null;
  message: string;
}
```

Successful deletes may use HTTP `204`, which has no body. Clients and tests must handle `204`
without expecting or parsing the envelope.

The backend should validate request inputs, centralize error handling, and never send stack traces,
SQL errors, or file paths to clients. Enforce authorization in backend middleware; hiding a control
in the frontend is not security.

## Planned API documentation

When endpoints exist, document them with a version-controlled Postman collection and an environment
template containing placeholders only. Neither file exists yet, and there is no implemented login
endpoint or token-saving request. Update the documentation alongside future endpoint changes.

## Security and data handling

- Hash passwords and keep authentication secrets out of source control.
- Never log passwords, tokens, environment values, face images, or biometric templates.
- Use synthetic data for development and tests. Never commit real pharmacy records.
- Keep employee photos, biometric material, and trained models out of Git and on a restricted host.
- Record sensitive business actions in an audit log once that functionality exists.
