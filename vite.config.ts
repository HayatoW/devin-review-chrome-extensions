import { defineConfig } from "vite-plus";

export default defineConfig({
  build: {
    copyPublicDir: true,
    rolldownOptions: {
      input: {
        background: "src/background.ts",
      },
      output: {
        entryFileNames: "background.js",
      },
    },
  },
  fmt: {},
  lint: { options: { typeAware: true, typeCheck: true } },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
