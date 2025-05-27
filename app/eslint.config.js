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
      globals: {
        // ✅ Explicitly define allowed globals here
        console: true,
        setTimeout: true,
        setInterval: true,
        clearTimeout: true,
        clearInterval: true,
        window: true,
        document: true,
        alert: true,
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
