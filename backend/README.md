# Backend

The backend contains the Node.js and Express API for PharmaSense. It handles application operations, business rules, access control, and communication with MySQL and the Python services.

## Responsibilities

- Authenticate users and enforce role-based permissions.
- Validate requests and process sales and inventory operations.
- Read and update database records consistently.
- Coordinate forecasting and chatbot requests through internal service APIs.
- Record application audit events.

## Directory layout

Application source belongs in `src/`. As the API grows, use `routes/` for endpoints, `services/` for business logic, and `middleware/` for shared request handling.

Keep credentials in local environment files. Database schema changes belong in the repository's `database/migrations/` directory, not ad hoc production edits.

The root ESLint configuration supports Node.js code in `backend/`. The API entry point and runtime setup have not been implemented yet.
