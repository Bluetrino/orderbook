module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["import"],
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    // # alternatively, 'recommended' is the combination of these two rule sets:
    // "plugin:import/errors",
    // "plugin:import/warnings"
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],

    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",

    "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "_.*", argsIgnorePattern: "_.*" }],

    "@typescript-eslint/member-ordering": [
      "error",
      {
        default: [
          // Index signature
          "signature",

          // Fields
          "public-field", // = ["public-static-field", "public-instance-field"]
          "protected-field", // = ["protected-static-field", "protected-instance-field"]
          "private-field", // = ["private-static-field", "private-instance-field"]

          // Constructors
          "public-constructor",
          "protected-constructor",
          "private-constructor",

          "constructor",

          // Methods
          "public-method", // = ["public-static-method", "public-instance-method"]
          "protected-method", // = ["protected-static-method", "protected-instance-method"]
          "private-method", // = ["private-static-method", "private-instance-method"]
        ],
      },
    ],

    "import/no-duplicates": "error",
    "import/order": [
      "warn",
      {
        groups: [["builtin", "external"], "internal", ["parent", "index", "sibling"]],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
        },
      },
    ],

    "import/no-unresolved": "Off",
  },
};
