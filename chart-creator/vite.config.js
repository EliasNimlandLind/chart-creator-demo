// vite.config.js
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const rootDirectory = env.VITE_PROD === "true" ? "library" : process.cwd();

  return {
    root: rootDirectory,
    build: {
      outDir: "./dist",
      rollupOptions: {
        input: {
          main:
            env.VITE_PROD === "true" ? "library/chartGenerator.js" : "index.js",
        },
      },
      minify: env.VITE_PROD === "true" ? "esbuild" : false,
    },
    server: {
      open: false,
      port: 5173,
    },
  };
});
