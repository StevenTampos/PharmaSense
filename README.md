# PharmaSense

PharmaSense is a capstone project for a browser-based pharmacy management system designed to run on
a local network. Its goal is to bring sales, inventory, analytics, and decision support into one
application.

## Development status

The React + TypeScript + Vite + Tailwind CSS frontend scaffold exists. Business modules, the
backend, database implementation, and Python services are not implemented yet.

## Technology

| Area               | Technology or plan                                       |
| ------------------ | -------------------------------------------------------- |
| Frontend           | React, TypeScript, Vite, and Tailwind CSS v4 (available) |
| Backend            | Node.js and Express with TypeScript (planned)            |
| Database           | MySQL (planned)                                          |
| Forecasting        | Python and statsmodels ETS (planned)                     |
| Facial recognition | OpenCV contrib LBPH (planned)                            |
| Chatbot            | Python service using a local Ollama model (planned)      |

The attendance recognition plan is OpenCV contrib (`opencv-contrib-python`) using
`cv2.face.LBPHFaceRecognizer_create`. `face_recognition` uses a different, dlib-based face-encoding
approach and is not the LBPH implementation; adopting it would require an explicit team decision.

The frontend and planned backend use TypeScript, not plain JavaScript. Only Python services use a
different language.

## Repository layout

```text
index.html          Vite entry HTML (loads frontend/app/main.tsx)
vite.config.ts      React and Tailwind plugins, @ alias, public folder, and frontend envDir
tsconfig*.json      Frontend and Vite TypeScript configuration
eslint.config.mjs   JavaScript, TypeScript, and React lint configuration
frontend/
  app/              Application entry: main.tsx, App.tsx, and global styles
  src/              Components, hooks, utilities, and assets
  public/           Static assets served as-is
  tests/            Frontend tests (tooling planned)
backend/src/        Planned Express API source
python/             Planned forecasting and chatbot services
database/           Planned MySQL migrations and synthetic seeds
docs/               Project and team documentation
scripts/            Repository development tools
```

See the guides for [frontend](frontend/README.md), [backend](backend/README.md), [Python
services](python/README.md), and [database](database/README.md).

## Working setup (available now)

Install [Node.js 24](https://nodejs.org/) and Git. From the repository root:

```sh
npm ci
npm run dev
npm run lint
npm run format:check
npm run typecheck
npm run build
```

Open the URL printed by Vite (by default `http://localhost:5173`). `npm ci` installs the
dependencies from `package-lock.json`.

| Command                | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Start the Vite development server.              |
| `npm run build`        | Type-check and build the frontend into `dist/`. |
| `npm run preview`      | Preview the production build locally.           |
| `npm run typecheck`    | Run TypeScript project references (`tsc -b`).   |
| `npm run lint`         | Run ESLint.                                     |
| `npm run format`       | Format files with Prettier.                     |
| `npm run format:check` | Check formatting without changing files.        |

### Frontend implementation notes

- `index.html` is at the repository root and loads `frontend/app/main.tsx`.
- `frontend/app/main.tsx` mounts the React app; `frontend/app/App.tsx` is its root component.
- `frontend/app/index.css` imports Tailwind with `@import "tailwindcss";`.
- Vite's `envDir` points to `frontend/`, and the `@` alias points to `frontend/src/`.
- Tailwind CSS v4 uses its Vite plugin; there is no Tailwind config or PostCSS setup.
- Only `VITE_` variables are exposed to browser code. Never put secrets in them.

## Planned (not yet available): backend, database, and environment setup

Backend and database implementations are not available. There are no `.env.example` files, backend
TypeScript config, migration or seed scripts, or service dependencies yet. Do not copy example
environment files or run migration or seed commands. Add setup instructions when those files and
scripts are implemented.

Planned environment values include backend connection and authentication settings, Python service
URLs, and `VITE_API_BASE_URL`. Actual `.env` files must stay local and out of Git. A future database
user should have access only to the PharmaSense database, not run as `root`.

## API contract and documentation (planned)

Once the API exists, responses with a body will use this envelope:

```ts
interface ApiResponse<T> {
  status: "success" | "error";
  data: T | null;
  message: string;
}
```

Successful deletes may return HTTP `204` with no body. Clients and tests must handle `204` without
trying to parse the JSON envelope. Authorization and business-rule enforcement belong in the
backend; hiding a UI control is not a security boundary.

The planned API-documentation convention is a version-controlled Postman collection and an
environment template containing placeholders only. Neither file exists yet, and there is no
implemented login endpoint or token-saving request. Keep the documentation aligned with real
endpoints once they are implemented.

## Data and testing

Use synthetic data for development and tests. Never commit credentials, real pharmacy records,
employee photos, biometric templates, or database backups. Private biometric material must stay out
of Git and on a restricted host. Keep local datasets, model weights, and backups in the designated
ignored directories.

## Contributing

Follow the workflow in [CONTRIBUTING.md](CONTRIBUTING.md). Repository-owner settings and branch
protection are documented in [docs/repository-settings.md](docs/repository-settings.md).

The configured Prettier formatter uses double quotes for TypeScript. Naming conventions are guidance
for manual review, not ESLint-enforced rules. Python uses single quotes as a style convention,
enforced by Ruff. Ruff configuration lives in `pyproject.toml` and is verified in CI. See the
[Python guide](python/README.md) for Ruff commands and rules.

For a TypeScript union instead of an enum, use:

```ts
type UserRole = "admin" | "pharmacist";
```
