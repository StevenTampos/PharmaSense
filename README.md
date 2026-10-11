# PharmaSense

A capstone pharmacy management project covering inventory, point-of-sale workflows, analytics, and decision support.

**Status:** Repository tooling is ready; application development has not started. The proposed stack is React with Tailwind CSS, Node.js with Express, MySQL, and Python for specialized services. The application is intended to run on a local network.

## Tooling setup

Install [Node.js 24 LTS](https://nodejs.org/) and Git, then run these commands from the repository root:

```sh
npm ci
npm run lint
npm run format:check
```

`npm ci` also installs a local commit-message hook. There are no application services to start yet.

| Command                                                     | Purpose                                      |
| ----------------------------------------------------------- | -------------------------------------------- |
| `npm run lint`                                              | Check JavaScript and React code with ESLint. |
| `npm run format`                                            | Apply Prettier formatting.                   |
| `npm run format:check`                                      | Check formatting without changing files.     |
| `npm run commitlint -- --edit <message-file>`               | Validate a commit-message file.              |
| `npm run pr-title -- "fix(inventory): correct stock count"` | Validate a proposed PR title locally.        |

Python linting and application tests will be added with the first relevant source code. The current checks verify repository tooling, not pharmacy functionality.

## Collaboration

Use short-lived branches and pull requests to `main`. Commit messages and PR titles follow:

```text
type(scope): short description

feat(inventory): add batch expiry tracking
fix(pos): correct change calculation
docs(setup): explain local installation
```

The scope describes the affected module, not the author. See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow and approval policy.

## Checks and review tools

- **ESLint and Prettier:** code rules and consistent formatting.
- **Reviewdog:** lint annotations on changed PR lines. This is static review, not AI business-logic review.
- **Dependabot:** weekly, grouped dependency-update PRs. Updates still need human review; nothing merges automatically.
- **commitlint:** consistent local commit messages and PR titles.

Workflows and dependency updates take effect after these files are published to GitHub. Private GitHub Actions usage is subject to the account's included allowance and settings; no paid review service is configured.

## Approval limitation

The intended reviewer is `@StevenTampos`. **Private repositories on GitHub Free cannot enforce protected-branch approvals or required checks.** Until an eligible plan is available, requesting that review and waiting for passing checks is a team policy, not a merge lock.

[Repository settings](docs/repository-settings.md) explains the optional GitHub Pro/Student Pro protection setup and the owner's exception for their own PRs. No remote settings have been changed by adding these files.

## Keep local material out of Git

`Capstone_Paper_G17.pdf` is a local reference and is explicitly ignored. Do not commit research records, real pharmacy data, database backups, face images, biometric templates, credentials, or model weights. Use synthetic test fixtures instead.

Keep private data in `local-data/`, weights in `model-weights/`, and database backups in `backups/`; these directories are ignored. Schema and migration source files may be committed. Safe `.env.example` files may be committed, but actual `.env` files must remain local.
