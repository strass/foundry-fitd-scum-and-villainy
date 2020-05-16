module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ["standard", "prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    mergeObject: "readonly",

    // Foundry:
    Dialog: "readonly",
    ActorSheet: "readonly",
    FitDRoll: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react"],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "react/jsx-uses-vars": "error",
    "react/jsx-uses-react": "error",
  },
};
