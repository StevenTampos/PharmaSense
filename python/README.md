# Python services

Specialized Python code lives here, separate from the Node.js backend.

- `forecasting/`: demand forecasting code.
- `chatbot/`: local business-chatbot service code.

Add other services only when their implementation needs them. These folders do not define an API framework or deployment setup yet.

Add each service's real dependencies, Ruff lint/format checks, and relevant tests with its first implementation. Extend CI and Dependabot for the manifests you actually use. Keep model weights in the ignored root `model-weights/` directory and private datasets in `local-data/`, not in these source folders.
