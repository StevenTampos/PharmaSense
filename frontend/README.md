# Frontend

The frontend contains the browser interface for PharmaSense, built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. It is responsible for screens, reusable UI components, user interactions, and calls to the backend API.

> This guide covers frontend setup, commands, and standards. See [CONTRIBUTING.md](../CONTRIBUTING.md)
> for contribution and review workflow. Repository-owner settings are documented in
> [docs/repository-settings.md](../docs/repository-settings.md).

## Directory layout

| Path              | Purpose                                                           |
| ----------------- | ----------------------------------------------------------------- |
| `app/`            | Application entry: `main.tsx`, `App.tsx`, and global styles.      |
| `src/assets/`     | Images and other files imported by components.                    |
| `src/components/` | Reusable components. `ui/` holds base UI, `modal/` holds dialogs. |
| `src/hooks/`      | Custom React hooks.                                               |
| `src/lib/`        | Helpers and utilities.                                            |
| `public/`         | Static assets served as-is (for example `vite.svg`).              |
| `tests/`          | Frontend tests, mirroring the structure of `src/`.                |
| `docs/`           | Frontend documentation.                                           |

As the source grows, organize `src/` into more areas such as `pages/` (screens) and `services/` (backend API client code).

Build-tool configuration (Vite, TypeScript, ESLint) lives at the **repository root**, not inside `frontend/`, because Vite treats the folder that contains `index.html` as the project root.

Files at the **repository root** that belong to the frontend build:

| File                                                       | Purpose                                                                        |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `index.html`                                               | The single HTML page. Loads `frontend/app/main.tsx`.                           |
| `vite.config.ts`                                           | Vite config: React and Tailwind plugins, `@` alias, public folder, env folder. |
| `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` | TypeScript configuration.                                                      |
| `eslint.config.mjs`                                        | ESLint rules for TypeScript, React, and hooks.                                 |

## Boundaries

- Request data and operations through the backend API; do not connect directly to MySQL.
- Keep business-rule enforcement and authorization in the backend, even when the UI also validates input.
- Never put secrets, private records, or biometric images in `public/`.

## Current status

Done:

- React + TypeScript + Vite project setup with the default template screen, restyled with Tailwind CSS.
- `@` import alias, strict TypeScript, and ESLint and Prettier tooling for `.ts` and `.tsx` files.
- Login, protected administrator routes, the administrator dashboard, and account management.
- Mock-backed account administration using the same in-memory store as mock authentication.
- `frontend/.env.example` with the temporary mock login setting (`VITE_MOCK_LOGIN_PASSWORD`).

Not done yet:

- The remaining PharmaSense screens (POS, Inventory, Analytics, Chatbot, and Attendance).
- Backend API integration; authentication and account operations are mock-only.
- Test tooling (Vitest and React Testing Library) and the first tests.

## Setup

Install [Node.js 24 LTS](https://nodejs.org/) and Git, then run from the **repository root**:

```sh
npm ci
npm run dev
```

Open the URL printed in the terminal (by default `http://localhost:5173`).

Use `npm ci` on a fresh clone so everyone gets the exact versions in `package-lock.json`.

### Recommended editor setup (VS Code)

Open the **repository root** folder as the workspace, then install these extensions:

- **ESLint** (shows lint problems as you type)
- **Prettier - Code formatter** (formats files on save)
- **Tailwind CSS IntelliSense** (class-name autocomplete)

Recommended settings (`Ctrl + ,`):

- **Editor: Format On Save** turned on, with Prettier as the default formatter.
- **Files: Eol** set to `\n` (LF). The repository requires LF line endings.

### Troubleshooting: format check fails on one file

If `npm run format:check` warns about a file you pasted or edited on Windows, it usually has CRLF line endings. Fix it with `npx prettier --write <file>`, or run `npm run format` for the whole repository. In VS Code, click **CRLF** in the bottom-right status bar and switch it to **LF**.

### Troubleshooting: red errors in the editor

If VS Code shows errors such as "Cannot find module" on `react`, `vite`, `@/assets/react.svg`, `./index.css`, or `node:url`, the packages are usually not installed yet:

1. Run `npm ci` from the repository root (not inside `frontend/`).
2. In VS Code, open the command palette and run **TypeScript: Select TypeScript Version** and choose **Use Workspace Version**.
3. Run **TypeScript: Restart TS Server** (or **Developer: Reload Window**).

Open the **repository root** as the VS Code workspace so the editor finds `tsconfig.json` and `node_modules`.

### Entry points

| File                     | Role                                                                        |
| ------------------------ | --------------------------------------------------------------------------- |
| `index.html` (root)      | Contains `<div id="root">` and loads `frontend/app/main.tsx`.               |
| `frontend/app/main.tsx`  | Mounts the React app into `#root` inside `StrictMode`.                      |
| `frontend/app/App.tsx`   | Root component. Add routing and layout here.                                |
| `frontend/app/index.css` | Global styles. Starts with `@import "tailwindcss";` to enable Tailwind CSS. |

### Import alias

`@` points to `frontend/src`:

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

### Adding dependencies

```sh
npm install <package>      # runtime library
npm install -D <package>   # development-only tool
```

Always commit both `package.json` and `package-lock.json`. The initial setup used:

```sh
npm install react react-dom tailwindcss @tailwindcss/vite
npm install -D vite @vitejs/plugin-react typescript typescript-eslint @types/react @types/react-dom @types/node
```

## Run commands

Run these from the repository root.

| Command                | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server with hot reload.                       |
| `npm run build`        | Type-check, then build the frontend for production into `dist/`. |
| `npm run preview`      | Preview the production build locally.                            |
| `npm run typecheck`    | Run `tsc -b` to catch TypeScript errors.                         |
| `npm run lint`         | Check TypeScript and React code with ESLint.                     |
| `npm run format`       | Apply Prettier formatting.                                       |
| `npm run format:check` | Check formatting without changing files.                         |

Run `npm run lint`, `npm run format:check`, and `npm run typecheck` before every commit.

## Planned (not yet available): Environment setup

There is no `frontend/.env.example` yet. Do not try to copy one. Vite is configured with
`envDir: "frontend"` and will read `frontend/.env` when environment configuration is added.

| Variable            | Description                  |
| ------------------- | ---------------------------- |
| `VITE_API_BASE_URL` | Base URL of the backend API. |

Only variables prefixed with `VITE_` are exposed to the browser. **Never put a secret in one.**
Real `.env` files must stay out of Git; a future example file should contain placeholders only.

## Testing

| Tooling (planned)                | Location and file name                                                                               |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Vitest and React Testing Library | `frontend/tests/`, mirroring `src/`, for example `frontend/tests/components/InventoryTable.test.tsx` |

- New features and bug fixes include tests. A bug fix starts with a test that reproduces the bug.
- Test names describe behavior: `it('rejects a batch with a past expiry date')`.
- Tests use synthetic data only and never call the real backend. Mock API calls.
- All tests must pass locally before you open a pull request.
- Prioritize business-critical UI logic: POS totals and discounts, expiry and low-stock indicators, and role-based screens.

## Coding standards

ESLint and Prettier are configured for code linting and formatting. Naming conventions below are
team guidance for manual review; they are not automatically enforced.

### Naming conventions

| Item                                     | Convention                          | Example                                           |
| ---------------------------------------- | ----------------------------------- | ------------------------------------------------- |
| Component and component file             | UpperCamelCase, `.tsx`              | `InventoryTable.tsx`, `ChatbotWidget.tsx`         |
| Custom hook                              | `use` + lowerCamelCase              | `useLowStockAlerts`, `useForecastData`            |
| Function / method                        | lowerCamelCase, verb or verb phrase | `calculateDiscount`, `fetchSalesHistory`          |
| Variable / parameter                     | lowerCamelCase                      | `currentBatch`, `reorderLevel`                    |
| Constant (fixed config or enum-like)     | UPPER_SNAKE_CASE                    | `VAT_RATE`, `MAX_LOGIN_ATTEMPTS`                  |
| Boolean variable / prop                  | prefix `is`, `has`, or `can`        | `isNearExpiry`, `hasDiscount`, `canOverrideStock` |
| Interface / type alias                   | UpperCamelCase, no `I` prefix       | `StockBatch`, `ProductFormValues`                 |
| Props type                               | Component name + `Props`            | `InventoryTableProps`                             |
| Role type                                | String union or `as const` object   | `type UserRole = "admin" \| "pharmacist";`        |
| Non-component file (utils, hooks, types) | lowerCamelCase                      | `formatCurrency.ts`, `useForecastData.ts`         |
| Custom CSS class (on top of Tailwind)    | kebab-case                          | `pos-summary-card`                                |

- React-defined constants and hook return values keep lowerCamelCase.
- Avoid names that differ only in case or by one character (do not use both `stock` and `Stock` in the same scope).
- Use descriptive names. Avoid vague ones such as `data`, `temp`, or `handleStuff`.
- Event handlers are named `handle<Event>` and the props that receive them `on<Event>` (for example `handleSubmit` passed as `onSubmit`).
- Prefer string unions or `as const` objects instead of TypeScript `enum`, which is not allowed by
  the app's `erasableSyntaxOnly` compiler option.

### TypeScript usage rules

- `strict` mode stays enabled in `tsconfig.app.json`. Do not turn it off.
- Do not use `any`. Use a specific type, a generic, or `unknown` and narrow it.
- Type all function parameters and return values of exported functions.
- Type component props with an `interface` or `type` named `<Component>Props`.
- Share API request and response types in one place so the frontend and backend agree on the same shapes.
- Prefer `interface` for object shapes and `type` for unions and aliases.
- Avoid non-null assertions (`!`) and `@ts-ignore`. If one is unavoidable, add a comment explaining why.

### Formatting

- **Indentation:** 2 spaces.
- **Semicolons:** required.
- **Line length:** 100 characters maximum. Wrap long expressions and JSX attributes.
- **Quotes:** use double quotes for TypeScript strings, matching the current Prettier configuration.
  JSX attribute values also use double quotes.
- **Blank lines:** one blank line between functions and components.
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

- Every exported function and React component has a short header comment describing its purpose, parameters, and return value.
- Use TSDoc/JSDoc (`/** ... */`). In multi-line blocks, each line starts with an aligned `*`.
- Inline comments (`//`) are used sparingly, only for non-obvious logic. Do not restate what the code already says.
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
- Use `async` / `await` with `try` / `catch` for API calls. Unhandled promise rejections are not allowed.
- Responses with a body use the same JSON shape (see below) so success and error cases are handled
  consistently. HTTP `204` has no body; clients and tests must handle it without parsing JSON.
- Align names, values, and trailing comments within a block where it improves readability.

## API responses and error handling

The planned API envelope for responses with a body is:

```ts
interface ApiResponse<T> {
  status: "success" | "error";
  data: T | null;
  message: string;
}
```

- Every API call has `try` / `catch` and handles loading (`isLoading`), success, and error states.
- Show the user a clear message from `message`. Never show raw error objects.
- Handle `401` (not logged in or token expired) by sending the user to the login screen, and `403` (wrong role) with a clear "not allowed" message.
- Handle `204` responses without trying to parse a body.
- Use a React error boundary around major pages so one crash does not blank the whole app.
- Do not use `console.log` for debugging in committed code. Never log tokens, passwords, or personal data.

## Security

- **Authorization is enforced by the backend.** Hiding a button or route in the UI is not security.
- **XSS:** do not use `dangerouslySetInnerHTML` with user-provided content. Let React escape output.
- **Secrets:** never put secrets in `VITE_` variables, source files, or `public/`. Everything shipped to the browser is visible to users.
- **Tokens:** do not store sensitive data in the URL. Keep the JWT handling in one place so it is easy to review.
- **Sensitive data:** employee photos, face images, and templates never belong in the frontend source or `public/`.
- **Dependencies:** review Dependabot PRs and avoid unmaintained packages.

## API documentation (planned)

When endpoints exist, document them with a Postman collection and an environment template containing
placeholders only. Neither file exists yet, and there is no implemented login endpoint or
token-saving request. Use the collection to check request and response shapes once it is created.

## Contributing

Follow the contribution and review workflow in [CONTRIBUTING.md](../CONTRIBUTING.md). Repository
settings are documented in [docs/repository-settings.md](../docs/repository-settings.md).
