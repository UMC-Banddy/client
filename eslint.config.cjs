// eslint.config.cjs
const js = require("@eslint/js");
const ts = require("typescript-eslint");

module.exports = [
  {
    ignores: [
      "dist",
      "node_modules",
      ".vite",
      "**/*.config.*", // vite, tailwind, postcss 등
      "**/*.d.ts",
      "**/*.test.*",
      // PWA 관련 자동 생성 파일들
      "sw.js",
      "workbox-*.js",
      "registerSW.js",
      "manifest.webmanifest",
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        project: "./tsconfig.app.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
      // 여기에 원하는 룰을 계속 추가 가능
    },
  },
];
