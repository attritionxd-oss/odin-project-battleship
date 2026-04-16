import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import jest from "eslint-plugin-jest";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
  },
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    plugins: { jest },
    rules: {
      ...jest.configs.recommended.rules,
      "jest/no-disabled-tests": "warn",
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
]);
