module.exports = {
  root: true,

  env: {
    node: true,
  },

  // extends: ["plugin:vue/essential", "eslint:recommended", "@vue/typescript"],

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "explicit-module-boundary-types":
      process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-non-null-assertion":
      process.env.NODE_ENV === "production" ? "warn" : "off",
    "ban-ts-comment": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-explicit-any": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-useless-catch": process.env.NODE_ENV === "production" ? "warn" : "off",
  },

  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
  },

  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],

  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript",
    // "@vue/typescript/recommended",
  ],
};
