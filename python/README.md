# Python services

This directory contains specialized Python services used by PharmaSense. These services handle forecasting and chatbot processing while the Node.js backend remains responsible for application access control and core business operations. A facial recognition attendance service is also planned on the Python side.

> This guide covers Python setup, commands, and standards. Git workflow, branch protection, and team rules are in the [root README](../README.md). How the backend calls these services is described in the [backend guide](../backend/README.md).

## Directory layout

| Directory      | Purpose                                                   | Main libraries (planned) |
| -------------- | --------------------------------------------------------- | ------------------------ |
| `forecasting/` | Demand forecasting from historical sales data.            | statsmodels (ETS)        |
| `chatbot/`     | Business-chatbot processing using a locally hosted model. | Ollama (local model)     |

The backend communicates with these services through internal APIs. Keep each service's source and dependencies with that service.

Store model weights in the ignored root `model-weights/` directory and private datasets in `local-data/`. Neither belongs in the source tree.

The facial recognition attendance service (LBPH, using OpenCV and `face_recognition`) has no directory yet. Decide its folder name (for example `python/attendance/`) before starting it, and keep its photos and templates out of Git.

## Current status

Done:

- The folder structure, ignore rules for virtual environments, caches, `model-weights/`, and `local-data/`, and the standards below.

Not done yet:

- Service implementations, dependencies (`requirements.txt` per service), and tests.
- The web framework that exposes each service to the backend (to be chosen).
- Python lint and format configuration (`.flake8` and `pyproject.toml`).
- `python/.env.example`.

## Python setup

Requirements: **Python 3.11 or newer** and `pip`.

Each service has its **own virtual environment and its own `requirements.txt`**, so dependencies stay with the service. Example for the forecasting service:

```sh
cd python/forecasting
python -m venv .venv
source .venv/bin/activate        # Windows (PowerShell): .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Rules:

- Keep `.venv/` out of Git (it is already ignored).
- Add every new dependency to **that service's** `requirements.txt` with a pinned version.
- `face_recognition` needs `dlib`, which requires CMake and a C++ compiler on some systems. Install those first if `pip install` fails.
- Never commit employee photos, face templates, or trained model files (see [Security and data handling](#security-and-data-handling)).

### Lint and format configuration

The standards need two settings that differ from the tools' defaults. Add them when the first service is created:

- **flake8** (`.flake8` or `setup.cfg`): `max-line-length = 100`, and ignore `E203` and `W503` so it does not clash with black.
- **black** (`pyproject.toml`): `line-length = 100` and `skip-string-normalization = true`. Black defaults to 88 characters and rewrites quotes to double quotes, which conflicts with the team's 100-character limit and single-quote rule.

## Environment setup

Real `.env` files are never committed. Copy the example and fill in the values:

```sh
cp python/.env.example python/.env
```

| Variable          | Description                                     |
| ----------------- | ----------------------------------------------- |
| `OLLAMA_ENDPOINT` | URL of the local Ollama server for the chatbot. |

The final list lives in `python/.env.example`. Environment variable keys use UPPER_SNAKE_CASE and are never hard-coded in source files. Secrets and model paths are stored only in `.env`.

## Run commands

Python services are started separately from the Node.js tooling. Exact start commands are added with each service. Until then, run these from the service folder (with its virtual environment active):

| Command           | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `flake8 .`        | Check style and common errors.           |
| `black --check .` | Check formatting without changing files. |
| `black .`         | Apply formatting.                        |
| `pytest`          | Run the Python tests (once tests exist). |

Run `flake8` and `black --check` before every commit.

## Testing

| Tooling (planned) | Location and file name                    |
| ----------------- | ----------------------------------------- |
| pytest            | `python/<service>/tests/test_<module>.py` |

- New features and bug fixes include tests. A bug fix starts with a test that reproduces the bug.
- Test names describe behavior, for example `test_forecast_returns_horizon_length`.
- Tests use synthetic data only. Never use real sales records or real face images.
- All tests must pass locally before you open a pull request.
- Prioritize forecast calculations, confidence thresholds for recognition, and the shape of every response the backend depends on.

## Coding standards

flake8 and black enforce these rules automatically, so run them before every commit.

### Naming conventions

- Modules and files: snake_case (`demand_forecast.py`, `face_attendance.py`), per PEP 8.
- Functions and variables: snake_case (`compute_ets_forecast`, `sales_history`).
- Classes: UpperCamelCase (`EtsForecaster`, `LbphRecognizer`).
- Constants: UPPER_SNAKE_CASE (`FORECAST_HORIZON_DAYS`, `LBPH_CONFIDENCE_THRESHOLD`).
- Boolean variables are prefixed with `is_`, `has_`, or `can_` (`is_near_expiry`).
- Avoid abbreviated or single-letter variable names outside short loop counters (prefer `forecast_window` over `fw`).
- Avoid vague names such as `data`, `temp`, or `handle_stuff`.
- Avoid names that differ only in case or by a single character.

### Formatting

- **Indentation:** 4 spaces (PEP 8).
- **Semicolons:** omitted.
- **Line length:** 100 characters maximum. Wrap long expressions.
- **Quotes:** single quotes unless the string itself contains an apostrophe.
- **Blank lines:** follow PEP 8 (two blank lines between top-level functions and classes).
- **One statement per line.** Never put multiple statements on a single line.
- **Imports:** standard library first, then third-party packages, then local modules, each group separated by a blank line.

### Comments and documentation

- Every function and class has a docstring directly below the `def` or `class` line (triple quotes, PEP 257) describing its purpose, parameters, and return value.
- Inline comments (`#`) are used sparingly, only to explain non-obvious logic such as ETS smoothing parameters or LBPH confidence thresholds. Do not restate what the code already says.
- Never commit commented-out code. Delete it; Git history keeps it.

```python
def compute_ets_forecast(sales_history, horizon_days=FORECAST_HORIZON_DAYS):
    """Forecast daily demand with an ETS model.

    Args:
        sales_history: Daily unit sales, oldest first.
        horizon_days: Number of future days to forecast.

    Returns:
        A list with one forecast value per future day.
    """
    ...
```

### Recommended practices

- Handle errors explicitly. Catch specific exceptions, return a clear error response, and never swallow exceptions silently.
- Use the `logging` module, not `print`. Never commit debug `print` statements.
- Never log face images, templates, or other personal data.
- Validate all input received from the backend before processing it.
- Keep responses in the same JSON shape the backend expects so it can pass results on as `{ status, data, message }`.
- Align names, values, and trailing comments within a block where it improves readability.

## Security and data handling

- Never commit credentials, real pharmacy records, employee photos, biometric templates, or database backups. Use synthetic data for development and tests.
- Employee photos, face templates, and trained recognition models stay out of Git and are stored only on the host machine with restricted access. Collect only what attendance needs.
- Keep local datasets in `local-data/` and model weights in `model-weights/`. These directories and actual `.env` files are ignored.
- The Python services are internal. They should accept requests only from the backend, not from the public network.
- Review Dependabot PRs, and pin dependency versions in each `requirements.txt`.
- If a secret is ever committed, treat it as leaked. Rotate it immediately, even after deleting it from the repo.

## Contributing

Follow the Git workflow, branch naming, commit convention, and PR template in the [root README](../README.md#git-workflow). Quick reference:

- **Branch:** `<type>/<short-description>`, for example `feat/inventory-batches`.
- **Commit and PR title:** `type(scope): short description`, in the imperative mood, with no final period and at most 100 characters. Use the service as the scope. Example: `feat(forecasting): add ETS demand model`.
- **Never commit:** commented-out code, debug `console.log` / `print` statements, test credentials, `.env` files, or real pharmacy, employee, or biometric data.
- **Review:** non-trivial changes go through a pull request reviewed by another team member before merging into `main`.