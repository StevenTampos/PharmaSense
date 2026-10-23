# PharmaSense

PharmaSense is a capstone project for a browser-based pharmacy management system designed to run on a local network. Its goal is to bring sales, inventory, analytics, and decision support into one application.

## Planned capabilities

- Point-of-sale processing and sales records.
- Inventory management with batch tracking, expiry monitoring, and stock alerts.
- Demand forecasting and business analytics.
- A business chatbot for operational questions.
- Employee attendance (facial recognition), role-based access, and audit logs.

**Development status:** The repository structure and development tools are in place. Application implementation has not started.

## Technology stack

| Area                 | Planned technologies                                                         |
| -------------------- | ---------------------------------------------------------------------------- |
| Frontend             | React with **TypeScript** (`.tsx` / `.ts`) and Tailwind CSS                  |
| Backend              | Node.js and Express with **TypeScript** (`.ts`)                              |
| Database             | MySQL                                                                        |
| Specialized services | Python (statsmodels for ETS forecasting; OpenCV / face_recognition for LBPH) |

> The frontend and backend are written in **TypeScript, not plain JavaScript**. Do not add `.js` or `.jsx` files under `frontend/src/` or `backend/src/`. Only the Python services use a different language.

## Project structure

```text
index.html          Vite entry HTML (loads frontend/app/main.tsx)
vite.config.ts      Vite configuration (React plugin, @ alias, public and env folders)
tsconfig*.json      TypeScript configuration (app code and Vite config)
eslint.config.mjs   ESLint configuration (JavaScript, TypeScript, React)
frontend/
  app/              Application entry: main.tsx, App.tsx, global styles
  src/
    assets/         Images and other files imported by components
    components/     Reusable components (ui/ for base UI, modal/ for dialogs)
    hooks/          Custom React hooks
    lib/            Helpers and utilities
  public/           Static assets served as-is (for example vite.svg)
  tests/            Frontend tests
  docs/             Frontend documentation
backend/
  src/              Express API and business logic (TypeScript)
python/
  forecasting/      Demand forecasting service
  chatbot/          Business-chatbot service
database/
  migrations/       Versioned MySQL schema changes
  seeds/            Synthetic development/test records
docs/               Project and team documentation
scripts/            Repository development tools
```

See the directory guides for [frontend](frontend/README.md), [backend](backend/README.md), [Python services](python/README.md), and [database](database/README.md) responsibilities.

Empty source folders contain `.gitkeep` placeholders so they are included in Git. Remove a placeholder when real files are added to that folder.

## Development setup

Install [Node.js 24 LTS](https://nodejs.org/) and Git, then run these commands from the repository root:

```sh
npm ci
npm run lint
npm run format:check
npm run typecheck
```

`npm ci` installs all dependencies (React, Vite, TypeScript, and the development tools) from `package-lock.json`, plus the local commit-message hook. Use `npm ci` instead of `npm install` on a fresh clone so everyone gets identical versions.

To start the frontend:

```sh
npm run dev
```

Then open the URL printed in the terminal (by default `http://localhost:5173`).

| Command                                                     | Purpose                                              |
| ----------------------------------------------------------- | ---------------------------------------------------- |
| `npm run dev`                                               | Start the Vite dev server with hot reload.           |
| `npm run build`                                             | Type-check, then build the frontend into `dist/`.    |
| `npm run preview`                                           | Serve the built `dist/` folder locally.              |
| `npm run typecheck`                                         | Run the TypeScript compiler without producing files. |
| `npm run lint`                                              | Check TypeScript and React code with ESLint.         |
| `npm run format`                                            | Apply Prettier formatting.                           |
| `npm run format:check`                                      | Check formatting without changing files.             |
| `npm run commitlint -- --edit <message-file>`               | Validate a commit-message file.                      |
| `npm run pr-title -- "fix(inventory): correct stock count"` | Validate a proposed PR title locally.                |

CI checks lint, formatting, and PR titles. Reviewdog annotates lint findings, and Dependabot proposes dependency updates. Application tests and Python checks will be added alongside the relevant source code.

## Frontend setup

The frontend is a **React + TypeScript** app built with **Vite**. It follows the default React template layout, adapted to this repository's folder structure.

### Troubleshooting: red errors in the editor

If VS Code shows errors such as "Cannot find module" on `react`, `vite`, `@/assets/react.svg`, `./index.css`, or `node:url`, the packages are usually not installed yet:

1. Run `npm ci` from the repository root (not inside `frontend/`).
2. In VS Code, open the command palette and run **TypeScript: Select TypeScript Version** and choose **Use Workspace Version**.
3. Run **TypeScript: Restart TS Server** (or **Developer: Reload Window**).

Open the **repository root** as the VS Code workspace so the editor finds `tsconfig.json` and `node_modules`.

### Entry points

| File                     | Role                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------- |
| `index.html` (root)      | The single HTML page. It contains `<div id="root">` and loads `frontend/app/main.tsx`. |
| `frontend/app/main.tsx`  | Mounts the React app into `#root` inside `StrictMode`.                                 |
| `frontend/app/App.tsx`   | Root component. Add routing and layout here.                                           |
| `frontend/app/index.css` | Global styles. Starts with `@import "tailwindcss";` to enable Tailwind CSS.            |

`index.html` stays at the repository root because Vite treats the folder containing it as the project root.

### Configuration files

| File                 | Purpose                                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `vite.config.ts`     | Enables the React and Tailwind plugins, serves static files from `frontend/public`, loads env files from `frontend/`, and defines the `@` alias. |
| `tsconfig.json`      | Entry config that references the two files below.                                                                                                |
| `tsconfig.app.json`  | Strict TypeScript settings for `frontend/app`, `frontend/src`, and `frontend/tests`.                                                             |
| `tsconfig.node.json` | TypeScript settings for `vite.config.ts`.                                                                                                        |
| `eslint.config.mjs`  | Lints `.ts` and `.tsx` with `typescript-eslint`, React hooks rules, and a ban on `any`.                                                          |

### Import alias

`@` points to `frontend/src`, so imports do not need long relative paths:

```tsx
import reactLogo from "@/assets/react.svg";
import { formatCurrency } from "@/lib/formatCurrency";
```

The alias is defined in two places that must stay in sync: `vite.config.ts` (`resolve.alias`) and `tsconfig.app.json` (`paths`).

### Tailwind CSS

Tailwind CSS v4 is installed and runs through its Vite plugin, so there is **no `tailwind.config` file** and no PostCSS setup.

- `vite.config.ts` registers the plugin (`tailwindcss()`).
- `frontend/app/index.css` starts with `@import "tailwindcss";`, which turns Tailwind on for the whole app. `main.tsx` imports that file.
- Style components with utility classes directly in the JSX (for example `className="flex items-center gap-4 p-4"`). Tailwind picks up the classes used in your source files automatically.
- Use `dark:` variants for dark mode. They follow the user's system setting by default.
- Prefer utility classes. Add custom CSS only when utilities are not enough, put it in `frontend/app/index.css` (inside `@layer base` or `@layer components`), and name custom classes in kebab-case (for example `pos-summary-card`).
- Do not build class names from strings (`` `bg-${color}-500` ``). Tailwind cannot detect them, so write the full class names.

### How the dependencies were installed

Already done and saved in `package.json` and `package-lock.json`. These commands are only for reference (for example, when adding a new library):

```sh
npm install react react-dom tailwindcss @tailwindcss/vite
npm install -D vite @vitejs/plugin-react typescript typescript-eslint @types/react @types/react-dom @types/node
```

Add runtime libraries with `npm install <package>` and development-only tools with `npm install -D <package>`. Always commit both `package.json` and `package-lock.json`.

## Run commands

### Available now

Run these from the repository root.

| Command             | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `npm run dev`       | Start the React dev server (Vite) with hot reload.             |
| `npm run build`     | Type-check and build the frontend for production into `dist/`. |
| `npm run preview`   | Preview the production build locally.                          |
| `npm run typecheck` | Run `tsc -b` to catch TypeScript errors.                       |
| `npm run lint`      | Run ESLint.                                                    |
| `npm run format`    | Fix formatting with Prettier.                                  |

Run `npm run lint`, `npm run format:check`, and `npm run typecheck` before every commit.

### Planned (added with the backend and database)

> These script names are proposals. They are added to `package.json` when the matching code exists.

| Command                 | Purpose                                            |
| ----------------------- | -------------------------------------------------- |
| `npm run dev:backend`   | Start the Express API in watch mode.               |
| `npm run build:backend` | Compile the backend TypeScript to `backend/dist/`. |
| `npm test`              | Run the frontend and backend tests.                |
| `npm run migrate`       | Apply pending MySQL migrations.                    |
| `npm run seed`          | Load synthetic seed data into the development DB.  |

Python services are started separately. See [Python setup](#python-setup).

## Environment setup

Real `.env` files are never committed. Each service has an `.env.example` with placeholder values. The frontend reads its `.env` from the `frontend/` folder (Vite is configured with `envDir: "frontend"`).

1. Copy the example files:

   ```sh
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   cp python/.env.example python/.env
   ```

2. Install **MySQL 8** locally and create an empty database and a dedicated user (do not use `root` in `.env`):

   ```sql
   CREATE DATABASE pharmasense CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'pharmasense_user'@'localhost' IDENTIFIED BY '<choose-a-strong-password>';
   GRANT ALL PRIVILEGES ON pharmasense.* TO 'pharmasense_user'@'localhost';
   ```

3. Fill in the values in each `.env`, then run `npm run migrate` and `npm run seed`.

Expected variables (names use UPPER_SNAKE_CASE; the final list lives in each `.env.example`):

| Variable               | Used by  | Description                                     |
| ---------------------- | -------- | ----------------------------------------------- |
| `PORT`                 | backend  | API port.                                       |
| `DB_HOST`              | backend  | MySQL host.                                     |
| `DB_PORT`              | backend  | MySQL port (default `3306`).                    |
| `DB_NAME`              | backend  | Database name.                                  |
| `DB_USER`              | backend  | Database user.                                  |
| `DB_PASSWORD`          | backend  | Database password.                              |
| `JWT_SECRET`           | backend  | Secret for signing tokens. Long and random.     |
| `JWT_EXPIRES_IN`       | backend  | Token lifetime (for example `1h`).              |
| `FORECAST_SERVICE_URL` | backend  | URL of the Python forecasting service.          |
| `OLLAMA_ENDPOINT`      | python   | URL of the local Ollama server for the chatbot. |
| `VITE_API_BASE_URL`    | frontend | Base URL of the backend API.                    |

Only variables prefixed with `VITE_` are exposed to the browser. Never put a secret in one.

## Python setup

The Python services (`python/forecasting`, `python/chatbot`, and facial recognition) use a virtual environment.

Requirements: **Python 3.11 or newer** and `pip`.

Each service has its **own virtual environment and its own `requirements.txt`**. Example for the forecasting service:

```sh
cd python/forecasting
python -m venv .venv
source .venv/bin/activate # Windows (PowerShell): .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Run the style checks (configured to match the coding standards):

```sh
flake8 .
black --check .
```

Use `black .` to apply formatting.

Run these from the service folder with its virtual environment active. Two settings differ from the tools' defaults, so add them with the first service: flake8 needs `max-line-length = 100` (and ignores `E203` and `W503` for black), and black needs `line-length = 100` and `skip-string-normalization = true` (it defaults to 88 characters and double quotes). See the [Python guide](python/README.md#lint-and-format-configuration).

Rules:

- Keep `.venv/` out of Git.
- Add every new dependency to **that service's** `requirements.txt` with a pinned version.
- `face_recognition` needs `dlib`, which requires CMake and a C++ compiler on some systems. Install those first if `pip install` fails.
- Never commit employee photos, face templates, or trained model files (see [Data handling](#data-handling)).

## Testing

| Layer           | Tooling (planned)                    | Test file location and name                                                              |
| --------------- | ------------------------------------ | ---------------------------------------------------------------------------------------- |
| Frontend        | Vitest and React Testing Library     | `frontend/tests/`, mirroring `src/`: `frontend/tests/components/InventoryTable.test.tsx` |
| Backend         | Vitest and Supertest (API endpoints) | Next to the file: `inventoryController.test.ts`                                          |
| Python services | pytest                               | `python/<service>/tests/test_<module>.py`                                                |

Rules:

- New features and bug fixes include tests. A bug fix starts with a test that reproduces the bug.
- Test names describe behavior: `it('rejects a batch with a past expiry date')`.
- Tests use synthetic data only and never touch the development or production database. Use a separate test database or mocks.
- All tests must pass locally before you open a pull request.
- Prioritize tests for business-critical logic: POS totals and discounts, FEFO batch selection, expiry and low-stock alerts, role permissions, and forecast calculations.

---

## Git workflow

Keep `main` stable. All work happens on short-lived branches that are merged into `main` through pull requests. There is no `develop` branch and no special release process. **Never commit or push directly to `main`.**

### Branch naming

Format: `<type>/<short-description>`

- All lowercase, words separated by hyphens (kebab-case).
- Keep it short and specific (2 to 5 words). Including the module helps (for example `inventory`, `pos`).
- One branch per task.

| Type       | Use for                                    | Example                          |
| ---------- | ------------------------------------------ | -------------------------------- |
| `feat`     | A new feature                              | `feat/inventory-batches`         |
| `fix`      | A bug fix                                  | `fix/pos-total`                  |
| `docs`     | Documentation only                         | `docs/setup`                     |
| `refactor` | Code change that is not a fix or a feature | `refactor/backend-error-handler` |
| `style`    | Formatting only, no logic change           | `style/frontend-prettier`        |
| `test`     | Adding or updating tests                   | `test/inventory-fefo`            |
| `chore`    | Tooling, configs, dependencies             | `chore/update-eslint-config`     |

The other allowed types are `build`, `ci`, `perf`, and `revert`.

### Commit message and PR title convention

Format (the same for commits and PR titles): `type(scope): short description`

- **Type** is one of `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.
- **Scope is required** and lowercase. It names the affected area, such as `inventory`, `pos`, `auth`, `analytics`, `chatbot`, `attendance`, `db`, `setup`, or `repo`. These are examples, not a fixed list.
- **Description** is short, in the imperative mood ("add", not "added" or "adds"), with no final period.
- The full header is at most **100 characters**.
- Put issue references in the PR body, for example `Closes #12`.

```text
feat(inventory): add batch expiry tracking
fix(pos): correct change calculation
docs(setup): explain local installation
chore(repo): update development tooling
```

After `npm ci`, a Git hook checks your commit messages locally. Check a PR title before opening the PR:

```sh
npm run pr-title -- "fix(inventory): correct stock count"
```

Local hooks can be bypassed. The GitHub `pr-title` check enforces the same rules on the PR.

Do not commit commented-out code, debug `console.log` / `print` statements, test credentials, or `.env` files.

### Step-by-step: from pull to push

**1. Start from an up-to-date `main`.**

```sh
git switch main
git pull --ff-only
```

**2. Create your branch.**

```sh
git switch -c feat/inventory-batches
```

**3. Do the work.** Commit small and often, one logical change per commit. Before each commit, check what changed:

```sh
git status
git diff
```

**4. Run the checks locally.**

```sh
npm run lint
npm run format:check
npm run typecheck
```

Fix any problems (`npm run format` fixes formatting automatically).

**5. Stage and commit.**

```sh
git add <file-1> <file-2>
git commit -m "feat(inventory): add batch expiry tracking"
```

Prefer staging specific files over `git add .` so you do not commit unrelated or ignored files by accident.

**6. Sync with `main` before pushing**, so your branch includes the latest changes from teammates.

```sh
git fetch origin
git rebase origin/main
```

If there are conflicts, resolve them in your editor, then run `git add <file>` followed by `git rebase --continue`. If you get stuck, run `git rebase --abort` and ask for help.

**7. Push your branch.**

```sh
git push -u origin feat/inventory-batches
```

If you rebased a branch that was already pushed, use `git push --force-with-lease` (never plain `--force`, and never on `main`).

**8. Open a pull request** to `main` on GitHub using the PR template. The PR title follows the commit convention. Explain what changed and why, link the task (`Closes #12`), describe how you tested it, and add screenshots for UI changes. Request review from `@StevenTampos`.

**9. Address review feedback.** Make the changes on the same branch, then commit and push again. Re-request review after changing reviewed code. Do not merge until you have approval and the checks are green.

**10. Merge and clean up.** Use **squash merge**, with the valid PR title as the squash commit title. After the PR is merged:

```sh
git switch main
git pull --ff-only
git branch -d feat/inventory-batches
```

## Branch protection

The repository is public on GitHub Free. Protection is available but **must be configured and activated by the repository owner** (see [docs/repository-settings.md](docs/repository-settings.md)). Until it is active and verified, these rules are a team agreement, not a technical guarantee.

Rules for `main` (set up as a branch ruleset named `protect-main`):

- Require a pull request before merging, with **one approval**.
- **Require review from Code Owners.** `.github/CODEOWNERS` names `@StevenTampos` as the sole code owner, so only that approval satisfies the review gate.
- Dismiss stale approvals when new commits change reviewed code.
- Require conversations to be resolved.
- Require the status checks **`quality`** (lint and formatting) and **`pr-title`** to pass.
- Restrict deletions and block force pushes.
- Allow **squash merging only**. Disable merge commits and rebase merging, and delete merged branches automatically.

Notes:

- GitHub does not allow authors to approve their own PRs. For PRs authored by the owner, the agreed exception is a manual owner bypass **after checks pass**. It must not be used to skip checks on teammates' changes.
- Teammates can submit reviews, but their approvals do not satisfy the code-owner requirement.
- Do not push directly to `main`, force-push `main`, or merge automatically.

## Pull request template

The repository already includes `.github/pull_request_template.md`, so every new PR starts with it:

```markdown
## Summary

<!-- What changed, and why? -->

## Linked task

<!-- Use Closes #123 when this PR completes an issue. -->

## How tested

<!-- List commands run and any manual checks. State what was not tested. -->

## Screenshots

<!-- Include screenshots for UI changes; otherwise remove this section. -->

## Checklist

- [ ] The PR title uses `type(scope): short description`.
- [ ] Lint and formatting checks pass.
- [ ] Relevant tests or manual verification are described above.
- [ ] No secrets, real pharmacy data, biometric records, or reference paper are included.
- [ ] Review has been requested from `@StevenTampos`.
```

Also run `npm run typecheck` before requesting review, and keep the Postman collection up to date when an endpoint changes.

## Team and roles

> Fill in the names and GitHub handles. Replace the placeholders marked `TBD`.

| Name | GitHub handle   | Role                | Primary modules |
| ---- | --------------- | ------------------- | --------------- |
| TBD  | `@StevenTampos` | Reviewer / approver | All             |
| TBD  | TBD             | TBD                 | TBD             |
| TBD  | TBD             | TBD                 | TBD             |
| TBD  | TBD             | TBD                 | TBD             |

Responsibilities:

- **Author:** keeps the PR small and focused, responds to feedback, and merges after approval.
- **Reviewer:** reviews within a reasonable time, checks correctness, standards, and security, and approves only when satisfied.
- **Module owner:** the go-to person for questions and design decisions in that module.

Nobody approves their own pull request.

---

## Coding standards

These conventions keep code consistent, readable, and easy to review across every module. ESLint and Prettier (TypeScript / React) and flake8 / black (Python) enforce them automatically, so run them before every commit.

### Naming conventions

#### TypeScript / React (frontend)

| Item                                     | Convention                                  | Example                                           |
| ---------------------------------------- | ------------------------------------------- | ------------------------------------------------- |
| Component and component file             | UpperCamelCase, `.tsx`                      | `InventoryTable.tsx`, `ChatbotWidget.tsx`         |
| Custom hook                              | `use` + lowerCamelCase                      | `useLowStockAlerts`, `useForecastData`            |
| Function / method                        | lowerCamelCase, verb or verb phrase         | `calculateDiscount`, `fetchSalesHistory`          |
| Variable / parameter                     | lowerCamelCase                              | `currentBatch`, `reorderLevel`                    |
| Constant (fixed config or enum-like)     | UPPER_SNAKE_CASE                            | `VAT_RATE`, `MAX_LOGIN_ATTEMPTS`                  |
| Boolean variable / prop                  | prefix `is`, `has`, or `can`                | `isNearExpiry`, `hasDiscount`, `canOverrideStock` |
| Interface / type alias                   | UpperCamelCase, no `I` prefix               | `StockBatch`, `ProductFormValues`                 |
| Props type                               | Component name + `Props`                    | `InventoryTableProps`                             |
| Enum                                     | UpperCamelCase name, UpperCamelCase members | `UserRole.Admin`                                  |
| Non-component file (utils, hooks, types) | lowerCamelCase                              | `formatCurrency.ts`, `useForecastData.ts`         |
| Custom CSS class (on top of Tailwind)    | kebab-case                                  | `pos-summary-card`                                |

Rules:

- React-defined constants and hook return values keep lowerCamelCase.
- Avoid names that differ only in case or by one character (do not use both `stock` and `Stock` in the same scope).
- Use descriptive names. Avoid vague ones such as `data`, `temp`, or `handleStuff`.
- Event handlers are named `handle<Event>` and the props that receive them `on<Event>` (for example `handleSubmit` passed as `onSubmit`).

#### TypeScript usage rules (frontend and backend)

- `strict` mode is enabled in every `tsconfig.json`. Do not turn it off.
- Do not use `any`. Use a specific type, a generic, or `unknown` and narrow it.
- Type all function parameters and return values of exported functions.
- Type component props with an `interface` or `type` named `<Component>Props`.
- Share API request and response types in one place so the frontend and backend agree on the same shapes.
- Prefer `interface` for object shapes and `type` for unions and aliases.
- Avoid non-null assertions (`!`) and `@ts-ignore`. If one is unavoidable, add a comment explaining why.

#### Node.js / Express (backend)

- Route and controller files use lowerCamelCase with a `.ts` extension (for example `inventoryController.ts`, `posRoutes.ts`).
- Request and response types are named after what they carry: `CreateProductRequest`, `ProductResponse`.
- API endpoints use kebab-case, plural nouns, and RESTful HTTP verbs instead of verbs in the path: `GET /api/products`, `POST /api/cheque-tracker`, not `/getProducts`.
- Middleware is named for what it enforces: `verifyAdminRole`, `validateBatchInput`.
- Environment variable keys use UPPER_SNAKE_CASE (`DB_HOST`, `JWT_SECRET`, `OLLAMA_ENDPOINT`) and are never hard-coded in source files.

#### MySQL (database)

- Tables: lowercase, plural, snake_case (`products`, `stock_batches`, `cheque_tracker`).
- Columns: snake_case (`expiry_date`, `reorder_level`, `created_at`).
- Primary key is `id`; foreign keys are `<singular_table>_id` (`product_id`, `employee_id`).
- SQL keywords are uppercase in queries (`SELECT`, `FROM`, `WHERE`, `JOIN`).

#### Python (forecasting, chatbot, facial recognition)

- Modules and files: snake_case (`demand_forecast.py`, `face_attendance.py`).
- Functions and variables: snake_case (`compute_ets_forecast`, `sales_history`).
- Classes: UpperCamelCase (`EtsForecaster`, `LbphRecognizer`).
- Constants: UPPER_SNAKE_CASE (`FORECAST_HORIZON_DAYS`, `LBPH_CONFIDENCE_THRESHOLD`).
- Avoid abbreviations and single-letter names outside short loop counters (`forecast_window`, not `fw`).

### Formatting

- **Indentation:** 2 spaces for TypeScript and TSX; 4 spaces for Python (PEP 8).
- **Semicolons:** required in TypeScript; omitted in Python.
- **Line length:** 100 characters maximum. Wrap long expressions, JSX attributes, and SQL queries.
- **Quotes:** single quotes for TypeScript strings (double quotes for JSX attribute values); single quotes in Python unless the string contains an apostrophe.
- **Blank lines:** one blank line between functions, methods, and classes/components.
- **Braces:** always use braces with `if`, `else`, `for`, `do`, and `while`, even for one-line bodies. Use K&R style (opening brace on the same line, closing brace on its own line).
- **One statement per line.**

```ts
if (isNearExpiry) {
  applyDiscount(currentBatch);
} else {
  restockShelf(currentBatch);
}
```

### Comments and documentation

- Every exported function, React component, Express route handler, and Python function/class has a short header comment describing its purpose, parameters, and return value.
- TypeScript uses TSDoc/JSDoc (`/** ... */`). In multi-line blocks, each line starts with an aligned `*`.
- Python uses triple-quoted docstrings directly below the `def` line (PEP 257).
- Inline comments (`//` or `#`) are used sparingly, only for non-obvious logic (for example ETS smoothing parameters or LBPH confidence thresholds). Do not restate what the code already says.
- Never commit commented-out code. Delete it; Git history keeps it.

```ts
/**
 * Calculates the discounted price of a product batch.
 *
 * @param price - Original unit price.
 * @param discountRate - Discount as a decimal (0.1 = 10%).
 * @returns The price after the discount is applied.
 */
export function calculateDiscount(price: number, discountRate: number): number {
  return price * (1 - discountRate);
}
```

### Recommended practices

- Use **functional components with hooks** (`useState`, `useEffect`, custom hooks). Do not write class components.
- Use **parameterized queries** (or the query builder's placeholder syntax) for all database access. Never build SQL by string concatenation.
- Use `async` / `await` with `try` / `catch` for API calls, MySQL queries, and calls to the Python services. Unhandled promise rejections are not allowed.
- Every API response uses the same JSON shape: `{ status, data, message }`.
- Store secrets (database passwords, JWT secret, model paths) in `.env`, which is ignored by Git. Commit only `.env.example` with placeholders.
- Align names, values, and trailing comments within a block where it improves readability.

---

## Error handling and logging

### API response shape

Every endpoint returns the same JSON shape so the frontend can handle results uniformly:

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
- Wrap async route handlers so rejected promises reach the error middleware. Unhandled promise rejections are not allowed.
- Validate all request bodies, params, and queries before using them.
- Never send stack traces, SQL errors, or file paths to the client. Return a safe, generic message for `500` errors.

### Frontend errors

- Every API call has `try` / `catch` and handles `isLoading`, success, and error states.
- Show the user a clear message from `message`. Never show raw error objects.
- Use a React error boundary around major pages so one crash does not blank the whole app.

### Logging

- Use a logging library (such as `pino` or `winston`), not `console.log`.
- Levels: `error` (something failed), `warn` (unexpected but handled), `info` (important events), `debug` (development only).
- Log enough to debug: timestamp, level, module, request ID, and user ID.
- **Never log** passwords, tokens, `.env` values, full face images or templates, or other sensitive personal data.
- Business actions that need accountability (stock adjustments, price changes, voids, role changes, logins) go to the **audit log table**, not just the console.

## Security

- **Passwords:** hash with `bcrypt` or `argon2`. Never store or log plain-text passwords.
- **Authentication:** JWT with a short expiry (`JWT_EXPIRES_IN`). `JWT_SECRET` is long, random, and only in `.env`.
- **Authorization:** enforce roles on the **backend** with middleware such as `verifyAdminRole`. Hiding a button in the UI is not security.
- **Login protection:** lock or slow down an account after `MAX_LOGIN_ATTEMPTS` failed logins, and rate-limit auth endpoints.
- **SQL injection:** parameterized queries only. Never build SQL with string concatenation.
- **Input validation:** validate and sanitize every input on the backend, even if the frontend already checks it.
- **XSS:** do not use `dangerouslySetInnerHTML` with user-provided content. Let React escape output.
- **HTTP hardening:** use `helmet`, restrict CORS to the known frontend origin, and serve over HTTPS where possible, even on the local network.
- **Least privilege:** the database user has access only to the PharmaSense database. Do not run the app as `root`.
- **Sensitive data:** employee photos, face templates, and model files stay out of Git and are stored only on the host machine with restricted access. Collect only what attendance needs.
- **Audit logs:** record who did what and when for sensitive actions. Audit log entries cannot be edited or deleted through the app.
- **Dependencies:** review Dependabot PRs, run `npm audit`, and avoid unmaintained packages.
- **Secrets:** if a secret is ever committed, treat it as leaked. Rotate it immediately, even after deleting it from the repo.
- **Backups:** back up the database regularly, store backups in `backups/` (ignored by Git), and restrict access to them.

## API documentation

The API is documented with **Postman**. The shared Postman collection is exported to `docs/api/pharmasense.postman_collection.json` and committed to the repository, so it is reviewed in pull requests like any other file. The environment file with placeholder values is `docs/api/pharmasense.postman_environment.json`.

### Setup

1. Install [Postman](https://www.postman.com/downloads/).
2. Import both files from `docs/api/` (File > Import).
3. Select the **PharmaSense Local** environment and set its variables:

   | Variable  | Example                    | Description                         |
   | --------- | -------------------------- | ----------------------------------- |
   | `baseUrl` | `http://localhost:3000`    | Where the backend is running.       |
   | `token`   | (set by the login request) | JWT used by authenticated requests. |

4. Run the login request first. It saves the token to the `token` variable automatically (see the test script below).

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
- Endpoints follow the naming rules above: kebab-case, plural nouns, HTTP verbs for actions.
- Never commit real tokens, passwords, or real records. Clear secret values from the environment before exporting. Commit only placeholders.
- Keep the exported JSON up to date. If the collection and the code disagree, fix the collection in the same PR.

---

## Contributing

1. Pick or create a task (use the **Task or bug** issue template), then follow the [Git workflow](#git-workflow) above.
2. Open a pull request to `main` using the PR template and request review from `@StevenTampos`.
3. Merge only after approval and passing CI checks, using squash merge.

Keep PRs small enough to review. Dependabot update PRs follow the same review process and are never merged automatically. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution workflow.

## Data handling

Do not commit credentials, real pharmacy records, employee photos, biometric templates, or database backups. Use synthetic data for development and tests.

Keep local datasets in `local-data/`, model weights in `model-weights/`, and backups in `backups/`. These directories and actual `.env` files are ignored. Schema migrations and `.env.example` files containing placeholders belong in Git.