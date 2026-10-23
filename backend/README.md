# Backend

The backend contains the Node.js and Express API for PharmaSense, written in **TypeScript**. It handles application operations, business rules, access control, and communication with MySQL and the Python services.

> This guide covers backend setup, commands, and standards. Git workflow, branch protection, and team rules are in the [root README](../README.md). Database schema details are in the [database guide](../database/README.md).

## Responsibilities

- Authenticate users and enforce role-based permissions.
- Validate requests and process sales and inventory operations.
- Read and update database records consistently.
- Coordinate forecasting and chatbot requests through internal service APIs.
- Record application audit events.

## Directory layout

Application source belongs in `src/`. As the API grows, use `routes/` for endpoints, `services/` for business logic, and `middleware/` for shared request handling.

| Path               | Purpose                                                                 |
| ------------------ | ----------------------------------------------------------------------- |
| `src/`             | Backend source code (TypeScript). Holds the entry point once it exists. |
| `src/routes/`      | Endpoint definitions (kebab-case, plural nouns).                        |
| `src/controllers/` | Request handlers that call services and return the API response.        |
| `src/services/`    | Business logic: sales, inventory, FEFO batches, forecasting calls.      |
| `src/middleware/`  | Shared request handling: auth, role checks, validation, errors.         |
| `src/types/`       | Shared request, response, and domain types.                             |

Only `src/` exists so far. The subfolders are the planned layout and are created together with the code that needs them.

Keep credentials in local environment files. Database schema changes belong in the repository's `database/migrations/` directory, not ad hoc production edits.

## Current status

Done:

- Repository tooling: ESLint (including `typescript-eslint` rules for `.ts` files in `backend/`), Prettier, and commit-message checks run from the repository root.
- Coding standards, error-handling rules, and security rules for the backend are documented below.

Not done yet:

- The API entry point and runtime setup (Express and the TypeScript build).
- A `tsconfig.json` for `backend/`. The root `typecheck` script covers only the frontend until one is added.
- Backend dependencies (Express, a MySQL client, and so on), tests, and `backend/.env.example`.
- The database schema and migrations (see the [database guide](../database/README.md)).
- The Postman collection files in `docs/api/`.

The commands in the next section are planned and will be added to `package.json` as the code is written.

## Run commands

Run from the repository root.

| Command                 | Purpose                                              | Status  |
| ----------------------- | ---------------------------------------------------- | ------- |
| `npm run dev:backend`   | Start the Express API in watch mode.                 | Planned |
| `npm run build:backend` | Compile the backend TypeScript to `backend/dist/`.   | Planned |
| `npm test`              | Run the frontend and backend tests.                  | Planned |
| `npm run migrate`       | Apply pending MySQL migrations.                      | Planned |
| `npm run seed`          | Load synthetic seed data into the development DB.    | Planned |
| `npm run lint`          | Check TypeScript with ESLint.                        | Ready   |
| `npm run format:check`  | Check formatting with Prettier.                      | Ready   |
| `npm run typecheck`     | Run the TypeScript compiler without producing files. | Ready   |

Run `npm run lint`, `npm run format:check`, and `npm run typecheck` before every commit. A dedicated `tsconfig` for `backend/` will be added together with the first backend code, and `typecheck` should be extended to cover it.

## Environment setup

Real `.env` files are never committed. Copy the example and fill in the values:

```sh
cp backend/.env.example backend/.env
```

Install **MySQL 8** locally and create an empty database and a dedicated user (do not use `root` in `.env`):

```sql
CREATE DATABASE pharmasense CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pharmasense_user'@'localhost' IDENTIFIED BY '<choose-a-strong-password>';
GRANT ALL PRIVILEGES ON pharmasense.* TO 'pharmasense_user'@'localhost';
```

Then run `npm run migrate` and `npm run seed` once those commands exist.

Expected variables (UPPER_SNAKE_CASE; the final list lives in `.env.example`):

| Variable               | Description                                 |
| ---------------------- | ------------------------------------------- |
| `PORT`                 | API port.                                   |
| `DB_HOST`              | MySQL host.                                 |
| `DB_PORT`              | MySQL port (default `3306`).                |
| `DB_NAME`              | Database name.                              |
| `DB_USER`              | Database user.                              |
| `DB_PASSWORD`          | Database password.                          |
| `JWT_SECRET`           | Secret for signing tokens. Long and random. |
| `JWT_EXPIRES_IN`       | Token lifetime (for example `1h`).          |
| `FORECAST_SERVICE_URL` | URL of the Python forecasting service.      |

Environment variables are never hard-coded in source files.

## Testing

| Tooling (planned)                | Location and file name                          |
| -------------------------------- | ----------------------------------------------- |
| Vitest and Supertest (endpoints) | Next to the file: `inventoryController.test.ts` |

- New features and bug fixes include tests. A bug fix starts with a test that reproduces the bug.
- Test names describe behavior: `it('rejects a batch with a past expiry date')`.
- Tests use synthetic data only and never touch the development or production database. Use a separate test database or mocks.
- All tests must pass locally before you open a pull request.
- Prioritize business-critical logic: POS totals and discounts, FEFO batch selection, expiry and low-stock alerts, role permissions, and forecast calculations.

## Coding standards

ESLint and Prettier enforce these rules automatically, so run them before every commit.

### Naming conventions

#### Node.js / Express

- Route and controller files use lowerCamelCase with a `.ts` extension (for example `inventoryController.ts`, `posRoutes.ts`).
- Functions and variables use lowerCamelCase. Function names are verbs or verb phrases (`calculateDiscount`, `fetchSalesHistory`).
- Types and interfaces use UpperCamelCase without an `I` prefix. Request and response types are named after what they carry: `CreateProductRequest`, `ProductResponse`.
- Constants use UPPER_SNAKE_CASE (`VAT_RATE`, `MAX_LOGIN_ATTEMPTS`).
- Boolean variables are prefixed with `is`, `has`, or `can` (`isNearExpiry`, `canOverrideStock`).
- API endpoints use kebab-case, plural nouns, and RESTful HTTP verbs instead of verbs in the path: `GET /api/products`, `POST /api/cheque-tracker`, not `/getProducts`.
- Middleware is named for what it enforces: `verifyAdminRole`, `validateBatchInput`.
- Environment variable keys use UPPER_SNAKE_CASE (`DB_HOST`, `JWT_SECRET`, `OLLAMA_ENDPOINT`).
- Avoid names that differ only in case or by one character, and vague names such as `data`, `temp`, or `handleStuff`.

#### MySQL

- Tables: lowercase, plural, snake_case (`products`, `stock_batches`, `cheque_tracker`).
- Columns: snake_case (`expiry_date`, `reorder_level`, `created_at`).
- Primary key is `id`; foreign keys are `<singular_table>_id` (`product_id`, `employee_id`).
- SQL keywords are uppercase in queries (`SELECT`, `FROM`, `WHERE`, `JOIN`).

### TypeScript usage rules

- `strict` mode is enabled in the backend `tsconfig.json`. Do not turn it off.
- Do not use `any`. Use a specific type, a generic, or `unknown` and narrow it.
- Type all function parameters and return values of exported functions.
- Share API request and response types in one place so the frontend and backend agree on the same shapes.
- Prefer `interface` for object shapes and `type` for unions and aliases.
- Avoid non-null assertions (`!`) and `@ts-ignore`. If one is unavoidable, add a comment explaining why.

### Formatting

- **Indentation:** 2 spaces.
- **Semicolons:** required.
- **Line length:** 100 characters maximum. Wrap long expressions and SQL queries.
- **Quotes:** single quotes for strings per the team standard. Prettier currently uses its default double quotes unless `"singleQuote": true` is added to `.prettierrc.json`, so let `npm run format` decide.
- **Blank lines:** one blank line between functions and classes.
- **Braces:** always use braces with `if`, `else`, `for`, `do`, and `while`, even for one-line bodies. Use K&R style (opening brace on the same line, closing brace on its own line).
- **One statement per line.**

### Comments and documentation

- Every exported function and Express route handler has a short header comment describing its purpose, parameters, and return value.
- Use TSDoc/JSDoc (`/** ... */`). In multi-line blocks, each line starts with an aligned `*`.
- Inline comments (`//`) are used sparingly, only for non-obvious logic.
- Never commit commented-out code. Delete it; Git history keeps it.

```ts
/**
 * Returns all stock batches for a product, earliest expiry first (FEFO).
 *
 * @param productId - ID of the product.
 * @returns The product's batches ordered by expiry date.
 */
export async function getBatchesByProduct(productId: number): Promise<StockBatch[]> {
  const [rows] = await pool.query(
    "SELECT * FROM stock_batches WHERE product_id = ? ORDER BY expiry_date ASC",
    [productId],
  );
  return rows as StockBatch[];
}
```

### Recommended practices

- Use **parameterized queries** (or the query builder's placeholder syntax) for all database access. Never build SQL by string concatenation.
- Use `async` / `await` with `try` / `catch` for MySQL queries and calls to the Python services. Unhandled promise rejections are not allowed.
- Every API response uses the same JSON shape: `{ status, data, message }`.
- Store secrets in `.env`, which is ignored by Git. Commit only `.env.example` with placeholders.
- Align names, values, and trailing comments within a block where it improves readability.

## Error handling and logging

### API response shape

Every endpoint returns the same JSON shape:

```ts
interface ApiResponse<T> {
  status: "success" | "error";
  data: T | null;
  message: string;
}
```

```json
{ "status": "error", "data": null, "message": "Product not found" }
```

### HTTP status codes

| Code  | Use for                                               |
| ----- | ----------------------------------------------------- |
| `200` | Successful read or update.                            |
| `201` | Resource created.                                     |
| `204` | Successful delete with no body.                       |
| `400` | Invalid input (failed validation).                    |
| `401` | Not logged in, or token missing, invalid, or expired. |
| `403` | Logged in but not allowed (wrong role).               |
| `404` | Resource not found.                                   |
| `409` | Conflict (for example a duplicate SKU).               |
| `500` | Unexpected server error.                              |

### Backend errors

- Throw typed errors (for example an `AppError` class with a status code and a message) from controllers and services.
- Handle them in **one central Express error-handling middleware** that formats the `ApiResponse` and picks the status code.
- Wrap async route handlers so rejected promises reach the error middleware.
- Validate all request bodies, params, and queries before using them.
- Never send stack traces, SQL errors, or file paths to the client. Return a safe, generic message for `500` errors.

### Logging

- Use a logging library (such as `pino` or `winston`), not `console.log`.
- Levels: `error` (something failed), `warn` (unexpected but handled), `info` (important events), `debug` (development only).
- Log enough to debug: timestamp, level, module, request ID, and user ID.
- **Never log** passwords, tokens, `.env` values, full face images or templates, or other sensitive personal data.
- Business actions that need accountability (stock adjustments, price changes, voids, role changes, logins) go to the **audit log table**, not just the console.

## Security

- **Passwords:** hash with `bcrypt` or `argon2`. Never store or log plain-text passwords.
- **Authentication:** JWT with a short expiry (`JWT_EXPIRES_IN`). `JWT_SECRET` is long, random, and only in `.env`.
- **Authorization:** enforce roles on the backend with middleware such as `verifyAdminRole`. Hiding a button in the UI is not security.
- **Login protection:** lock or slow down an account after `MAX_LOGIN_ATTEMPTS` failed logins, and rate-limit auth endpoints.
- **SQL injection:** parameterized queries only. Never build SQL with string concatenation.
- **Input validation:** validate and sanitize every input on the backend, even if the frontend already checks it.
- **HTTP hardening:** use `helmet`, restrict CORS to the known frontend origin, and serve over HTTPS where possible, even on the local network.
- **Least privilege:** the database user has access only to the PharmaSense database. Do not run the app as `root`.
- **Audit logs:** record who did what and when for sensitive actions. Audit log entries cannot be edited or deleted through the app.
- **Dependencies:** review Dependabot PRs, run `npm audit`, and avoid unmaintained packages.
- **Secrets:** if a secret is ever committed, treat it as leaked. Rotate it immediately, even after deleting it from the repo.
- **Backups:** back up the database regularly, store backups in `backups/` (ignored by Git), and restrict access to them.

## API documentation

The API is documented with **Postman**. The shared collection is exported to `docs/api/pharmasense.postman_collection.json` and committed, so it is reviewed in pull requests. The environment file with placeholder values is `docs/api/pharmasense.postman_environment.json`.

### Setup

1. Install [Postman](https://www.postman.com/downloads/).
2. Import both files from `docs/api/` (File > Import).
3. Select the **PharmaSense Local** environment and set its variables:

   | Variable  | Example                    | Description                         |
   | --------- | -------------------------- | ----------------------------------- |
   | `baseUrl` | `http://localhost:3000`    | Where the backend is running.       |
   | `token`   | (set by the login request) | JWT used by authenticated requests. |

4. Run the login request first. It saves the token to the `token` variable automatically.

### Collection structure

- One **folder per module** (`Auth`, `Products`, `Inventory`, `POS`, `Analytics`, `Chatbot`, `Attendance`, `Accounts`).
- Request names are `<METHOD> <purpose>`, for example `GET list products` or `POST create stock batch`.
- Authenticated folders use **Bearer Token** auth set to `{{token}}`. Never paste a real token into a request.
- Use `{{baseUrl}}` in every URL. Never hard-code `localhost`.

### What every request documents

- A short description: purpose, required role, and any business rules.
- Example request body and params, using synthetic data only.
- At least one saved **example response** for success, plus one for each common error (`400`, `401`, `403`, `404`).
- Basic test scripts that check the status code and the `{ status, data, message }` response shape.

Example login test script that stores the token:

```js
pm.test("status is 200", () => {
  pm.response.to.have.status(200);
});

const body = pm.response.json();
pm.test("response has the standard shape", () => {
  pm.expect(body).to.have.all.keys("status", "data", "message");
});

pm.environment.set("token", body.data.token);
```

### Rules

- Any PR that adds or changes an endpoint also updates the Postman collection and re-exports it to `docs/api/`.
- Never commit real tokens, passwords, or real records. Clear secret values from the environment before exporting.
- Keep the exported JSON up to date. If the collection and the code disagree, fix the collection in the same PR.

## Contributing

Follow the Git workflow, branch naming, commit convention, and PR template in the [root README](../README.md#git-workflow). Quick reference:

- **Branch:** `<type>/<short-description>`, for example `feat/inventory-batches`.
- **Commit and PR title:** `type(scope): short description`, in the imperative mood, with no final period and at most 100 characters. Example: `fix(auth): reject expired tokens`.
- **Never commit:** commented-out code, debug `console.log` / `print` statements, test credentials, `.env` files, or real pharmacy, employee, or biometric data.
- **Review:** non-trivial changes go through a pull request reviewed by another team member before merging into `main`.