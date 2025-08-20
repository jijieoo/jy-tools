import { defineConfig } from "vite";

const defaultExcludes = [
  "dist",
  "**/*.d.ts",
  "dts-bundle-generator.config.ts",
  "eslint.config.ts",
  "vite.config.ts",
  "vitest.config.ts",
  "src/index.ts",
];

export default defineConfig({
  test: {
    coverage: {
      exclude: [...defaultExcludes],
    },
    watch: false,
  },
});
