import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: "espree",
        ecmaVersion: 2021,
        sourceType: "module",
      },
      env: {
        browser: true, // ✅ Allows setTimeout, setInterval, etc.
      },
      globals: {
        console: true, // optional: allow console
      },
    },
    plugins: { vue },
    rules: {
      "no-console": "off",
      "no-undef": "error",
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "vue/no-unused-vars": "error",
      "vue/multi-word-component-names": "off",
    },
  },
];
