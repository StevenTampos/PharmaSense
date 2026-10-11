# Frontend

The frontend contains the browser interface for PharmaSense, using React and Tailwind CSS. It is responsible for screens, reusable UI components, user interactions, and calls to the backend API.

## Directory layout

| Directory | Purpose                                                     |
| --------- | ----------------------------------------------------------- |
| `src/`    | React components, pages, styles, and API client code.       |
| `public/` | Public static assets served without application processing. |

Build-tool configuration belongs at the frontend root. As source grows, organize `src/` into areas such as `components/`, `pages/`, and `services/`.

## Boundaries

- Request data and operations through the backend API; do not connect directly to MySQL.
- Keep business-rule enforcement and authorization in the backend, even when the UI also validates input.
- Never put secrets, private records, or biometric images in `public/`.

The root ESLint configuration supports JavaScript and JSX in `frontend/src/`. The application entry point and build setup have not been implemented yet.
