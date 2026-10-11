# PharmaSense

PharmaSense is a capstone project for a browser-based pharmacy management system designed to run on a local network. Its goal is to bring sales, inventory, analytics, and decision support into one application.

## Planned capabilities

- Point-of-sale processing and sales records.
- Inventory management with batch tracking, expiry monitoring, and stock alerts.
- Demand forecasting and business analytics.
- A business chatbot for operational questions.
- Employee attendance, role-based access, and audit logs.

**Development status:** The repository structure and development tools are in place. Application implementation has not started.

## Technology stack

| Area                 | Planned technologies   |
| -------------------- | ---------------------- |
| Frontend             | React and Tailwind CSS |
| Backend              | Node.js and Express    |
| Database             | MySQL                  |
| Specialized services | Python                 |

## Project structure

```text
frontend/
  src/              React application code
  public/           Public static assets
backend/
  src/              Express API and business logic
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

Empty source folders contain `.gitkeep` placeholders so they are included in Git. Remove those placeholders when actual source files are added.

## Development setup

Install [Node.js 24 LTS](https://nodejs.org/) and Git, then run these commands from the repository root:

```sh
npm ci
npm run lint
npm run format:check
```

`npm ci` installs development dependencies and the local commit-message hook. Application startup commands will be added with their implementations.

| Command                                                     | Purpose                                      |
| ----------------------------------------------------------- | -------------------------------------------- |
| `npm run lint`                                              | Check JavaScript and React code with ESLint. |
| `npm run format`                                            | Apply Prettier formatting.                   |
| `npm run format:check`                                      | Check formatting without changing files.     |
| `npm run commitlint -- --edit <message-file>`               | Validate a commit-message file.              |
| `npm run pr-title -- "fix(inventory): correct stock count"` | Validate a proposed PR title locally.        |

CI checks lint, formatting, and PR titles. Reviewdog annotates lint findings, and Dependabot proposes dependency updates. Application tests and Python checks will be added alongside the relevant source code.

## Contributing

Use a short-lived branch for each task and open a pull request to `main`. Request review from `@StevenTampos` and wait for approval before merging.

Commit messages and PR titles use the affected module as their scope:

```text
feat(inventory): add batch expiry tracking
fix(pos): correct change calculation
docs(setup): explain local installation
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow.

## Data handling

Do not commit credentials, real pharmacy records, employee photos, biometric templates, or database backups. Use synthetic data for development and tests.

Keep local datasets in `local-data/`, model weights in `model-weights/`, and backups in `backups/`. These directories and actual `.env` files are ignored. Schema migrations and `.env.example` files containing placeholders belong in Git.
