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

## Working setup

Install [Node.js 24](https://nodejs.org/) and Git. From the repository root:

```sh
npm ci
npm run dev:all
```

Open `http://localhost:5173` in your browser.

| Command                | Purpose                                                        |
| ---------------------- | -------------------------------------------------------------- |
| `npm run dev:all`      | Start frontend and backend development servers concurrently.   |
| `npm run dev`          | Start the Vite frontend development server only.               |
| `npm run dev:backend`  | Start the Express API backend development server only.         |
| `npm run db:setup`     | Automatically create and seed local MySQL database.            |
| `npm run build`        | Type-check and build the frontend for production into `dist/`. |
| `npm run test`         | Run the automated test suite with Vitest.                      |
| `npm run typecheck`    | Run TypeScript project references (`tsc -b`).                  |
| `npm run lint`         | Run ESLint.                                                    |
| `npm run format:check` | Check formatting with Prettier.                                |

### Quick start with local MySQL (XAMPP)

1. Start MySQL in the **XAMPP Control Panel**.
2. Copy the backend environment template:
   ```sh
   cp backend/.env.example backend/.env
   ```
3. Initialize the database, tables, and test accounts:
   ```sh
   npm run db:setup
   ```
4. Start the application:
   ```sh
   npm run dev:all
   ```

### Test login credentials

- **Username / Email:** `admin` (or `admin@pharmasense.local`)
- **Password:** `admin123`

### Frontend implementation notes

- `index.html` is at the repository root and loads `frontend/app/main.tsx`.
- `frontend/app/main.tsx` mounts the React app; `frontend/app/App.tsx` is its root component.
- `frontend/app/index.css` imports Tailwind with `@import "tailwindcss";`.
- Vite's `envDir` points to `frontend/`, and the `@` alias points to `frontend/src/`.
- Tailwind CSS v4 uses its Vite plugin; there is no Tailwind config or PostCSS setup.
- Only `VITE_` variables are exposed to browser code. Never put secrets in them.

## Environment and backend configuration

Backend environment variables are managed via `backend/.env` (copied from `backend/.env.example`).
Real `.env` files must stay local and out of Git.

| Variable         | Description                                   |
| ---------------- | --------------------------------------------- |
| `PORT`           | Express API server port (default `5000`).     |
| `DB_HOST`        | MySQL host (default `localhost`).             |
| `DB_PORT`        | MySQL port (default `3306`).                  |
| `DB_NAME`        | Database name (default `pharmasense`).        |
| `DB_USER`        | Database user (default `root` in XAMPP).      |
| `DB_PASSWORD`    | Database password.                            |
| `JWT_SECRET`     | Secret key for signing authentication tokens. |
| `JWT_EXPIRES_IN` | Authentication token duration (default `8h`). |

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
