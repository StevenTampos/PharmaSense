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

Done for Sprint 1:

- Express application and server runtime in TypeScript (`src/app.ts`, `src/server.ts`).
- Authentication endpoints (`POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`).
- Account management endpoints (`GET /api/users`, `POST /api/users`, `PATCH /api/users/:id/status`).
- Audit logging service and endpoints (`GET /api/audit-logs`).
- Role-based access control middleware (`Administrator`, `Cashier/Pharmacist`, `Inventory Manager`).
- MySQL 8 connection pool integration (`src/config/database.ts`).
- Environment variable configuration with `backend/.env.example`.
- Strict mode TypeScript configuration (`tsconfig.backend.json`) checked by root `npm run typecheck`.
- Automated test suite with Vitest (`npm run test:backend`).

Planned for future sprints:

- Sprint 2: Point-of-Sale (POS) and inventory management endpoints.
- Sprint 3: Analytics dashboard and Python ETS forecasting service integration.
- Sprint 4: Chatbot, expenses, and facial recognition attendance endpoints.

## Working repository checks (available now)

Run these from the repository root:

| Command                | Purpose                                                      |
| ---------------------- | ------------------------------------------------------------ |
| `npm run lint`         | Run ESLint across all TypeScript and JavaScript files.       |
| `npm run format:check` | Check formatting with Prettier.                              |
| `npm run typecheck`    | Run `tsc -b` across frontend, node, and backend.             |
| `npm run test`         | Run full test suite with Vitest.                             |
| `npm run test:backend` | Run backend automated test suite with Vitest.                |
| `npm run dev:backend`  | Start backend development server with hot-reload.            |
| `npm run dev:all`      | Start frontend and backend development servers concurrently. |
| `npm run db:setup`     | Automatically create and seed local MySQL database.          |

## Environment and database setup

A placeholder environment template is available in `backend/.env.example`. To run the backend locally with XAMPP MySQL, copy it to `backend/.env`:

```sh
cp backend/.env.example backend/.env
```

Ensure MySQL is running in XAMPP, then automatically initialize the database, tables, and test accounts:

```sh
npm run db:setup
```

Real `.env` files are ignored and must never be committed.

### Default test credentials

- **Administrator:** `admin` (or `admin@pharmasense.local`) | Password: `admin123`
- **Pharmacist:** `pharmacist@pharmasense.local` | Password: `PharmacistPassword123!`
- **Inventory Manager:** `inventory@pharmasense.local` | Password: `InventoryPassword123!`

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
