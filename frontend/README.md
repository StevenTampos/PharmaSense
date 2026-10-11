# Frontend

React and Tailwind CSS browser code lives here.

- `src/`: application source. Add `components/` for reusable UI, `pages/` for screens, and `services/` for backend API calls when needed.
- `public/`: public static assets. Anything placed here may be served to users; never put private data or credentials here.

Keep browser code inside `src/`; build-tool configuration belongs at the frontend root. The root ESLint configuration already supports JavaScript and JSX in `frontend/src/`.

This is a folder scaffold, not a runnable application. Add the frontend's package manifest and build setup with the first implementation. Use the backend API rather than connecting directly to MySQL.
