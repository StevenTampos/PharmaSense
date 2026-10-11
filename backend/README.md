# Backend

Node.js and Express API code lives in `src/`.

Start simple. Add folders such as `routes/`, `services/`, and `middleware/` when the code needs them rather than creating a folder for every possible layer now.

The backend owns authentication, access control, business rules, and database access. The frontend calls this API; Python services communicate through internal APIs. Keep credentials in local environment files, not source code.

This is a folder scaffold, not a running API. Add the backend's package manifest, entry point, and relevant tests with the first implementation. The root ESLint configuration already supports Node.js code in `backend/`.
