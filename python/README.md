# Python services

This directory is reserved for specialized Python services used by PharmaSense. Forecasting and
chatbot services are planned, and a facial-recognition attendance service is also planned. The
Node.js backend remains responsible for application access control and core business operations.

> This guide covers Python service plans and conventions. See [CONTRIBUTING.md](../CONTRIBUTING.md)
> for contribution and review workflow. Repository-owner settings are documented in
> [docs/repository-settings.md](../docs/repository-settings.md).

## Planned services

| Directory      | Planned purpose                                           | Candidate technology |
| -------------- | --------------------------------------------------------- | -------------------- |
| `forecasting/` | Demand forecasting from historical sales data.            | statsmodels ETS      |
| `chatbot/`     | Business-chatbot processing using a locally hosted model. | Ollama (local model) |
| Attendance     | Facial-recognition attendance service.                    | OpenCV contrib LBPH  |

The attendance recognition path is OpenCV contrib, installed through `opencv-contrib-python`, and
uses `cv2.face.LBPHFaceRecognizer_create`. The Python package `face_recognition` is a different
approach based on dlib face encodings, not an implementation of LBPH. Using it would require an
explicit team decision.

The attendance service does not have a directory yet. Decide its location when implementation
begins. Keep service dependencies with the corresponding service.

## Current status

Python service implementations, `requirements.txt` files, and tests do not exist yet. Ruff is
configured at the repository root in `pyproject.toml` and verified in CI. No Python virtual
environment, environment example, or runnable service commands are provided by this repository.

## Planned (not yet available): Python setup

When a service is implemented, document its Python version and dependencies, create its own virtual
environment, and pin dependencies in that service's `requirements.txt`. There are no
`requirements.txt` files today; do not try to install dependencies from one yet.

Keep `.venv/` out of Git. Never commit employee photos, face templates, or trained model files.
Store private datasets in the ignored root `local-data/` directory and model weights in the ignored
root `model-weights/` directory.

## Planned (not yet available): Environment setup

There is no `python/.env.example` yet. Do not try to copy one. When services need configuration,
document their environment variables and provide an example file containing placeholders only.
Actual `.env` files must remain local. Environment variable names should use UPPER_SNAKE_CASE and
must not be hard-coded in source files.

The chatbot may need an `OLLAMA_ENDPOINT` setting; the final environment contract is not defined.

## Ruff configuration

Ruff is configured for Python linting and formatting in `pyproject.toml` at the repository root:

```toml
[tool.ruff]
target-version = "py311"
line-length = 100
src = ["python"]

exclude = [
  ".claude",
  ".git",
  ".venv",
  "venv",
  "node_modules",
  "dist",
  "build",
  "local-data",
  "model-weights",
  "backups",
]

[tool.ruff.format]
quote-style = "single"
indent-style = "space"
line-ending = "lf"

[tool.ruff.lint]
select = ["E", "F", "W", "I", "N", "D", "T20", "ERA"]

[tool.ruff.lint.pydocstyle]
convention = "google"
```

The selected rule groups cover E/W (pycodestyle), F (pyflakes), I (import order), N (PEP 8
naming), D (docstrings), T20 (leftover `print` statements), and ERA (commented-out code). Ruff's
formatter enforces the single-quote preference directly.

Install Ruff with `pip install ruff` and run these commands from the repository root:

| Command                 | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| `ruff check .`          | Lint Python files.                       |
| `ruff check --fix .`    | Lint and apply safe fixes.               |
| `ruff format --check .` | Check formatting without changing files. |
| `ruff format .`         | Apply formatting.                        |

`pytest` remains planned for service tests once services are implemented.

Tests should use synthetic data only. Never use real sales records or real face images. Prioritize
forecast calculations, recognition confidence thresholds, and response shapes the backend depends
on.

## Coding conventions

These conventions are enforced by Ruff (configured in `pyproject.toml` and checked in CI):

- Modules, files, functions, and variables use `snake_case`; classes use `UpperCamelCase`; constants
  use `UPPER_SNAKE_CASE`.
- Boolean names use `is_`, `has_`, or `can_` prefixes.
- Avoid vague names and abbreviations except short loop counters.
- Use 4-space indentation, omit semicolons, and keep lines within 100 characters.
- Prefer single-quoted strings unless the string itself contains an apostrophe.
- Follow PEP 8 blank-line conventions and keep one statement per line.
- Add docstrings to functions and classes, describing their purpose, parameters, and return value.
- Handle errors explicitly; do not swallow exceptions. Use `logging`, not debug `print` statements.
- Validate backend input and never log face images, templates, credentials, or other personal data.

## Security and data handling

- Never commit credentials, real pharmacy records, employee photos, biometric templates, or database
  backups. Use synthetic data for development and tests.
- Keep employee photos, face templates, and trained recognition models out of Git and on a
  restricted host. Collect only what attendance needs.
- The Python services are internal and should accept requests only from the backend, not the public
  network.
- Pin dependency versions when service manifests are introduced.
- If a secret is committed, treat it as leaked and rotate it immediately.
