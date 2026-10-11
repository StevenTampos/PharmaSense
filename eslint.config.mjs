import js from "@eslint/js";
import globals from "globals";
import reactJsx from "eslint-plugin-react-jsx";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: [
      ".claude/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.venv/**",
      "**/venv/**",
      "**/local-data/**",
      "**/model-weights/**",
      "**/backups/**",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
    },
  },
  {
    files: ["*.{js,mjs,cjs}", "scripts/**/*.{js,mjs,cjs}", "backend/**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["frontend/src/**/*.{js,jsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["frontend/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["**/*.jsx", "frontend/src/**/*.js"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "react-jsx": reactJsx,
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactJsx.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
];
