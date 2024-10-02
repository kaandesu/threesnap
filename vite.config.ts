import { defineConfig } from "vite";
import { resolve } from "path";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "live-demo") {
    return {
      base: "./",
      test: {
        globals: true,
      },
      resolve: {
        alias: {
          "~": resolve(__dirname, "src", "threesnapPlugin"),
        },
      },
      build: {
        rollupOptions: {
          input: ["index.html"],
        },
      },
    };
  } else {
    return {
      publicDir: false,
      test: {
        globals: true,
        setupFiles: "src/setupTests.ts",
        includeSource: ["src/**/*.spec.ts", "src/**/*.test.ts"],
      },
      resolve: {
        alias: {
          "~": resolve(__dirname, "src", "threesnapPlugin"),
        },
      },
      build: {
        lib: {
          entry: resolve(__dirname, "src/threesnapPlugin", "index.ts"),
          name: "threesnap",
          fileName: "threesnap",
        },
      },
    };
  }
});
