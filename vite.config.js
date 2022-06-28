import { defineConfig } from "vite"
import path from "path"
import dts from "vite-plugin-dts"

export default defineConfig({
  server: {
    host: true,
    open: "/src/demo/index.html",
  },
  publicDir: false,
  build: {
    rollupOptions: { output: { exports: "named" }},
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "roundPolygon",
      formats: [ "es", "cjs", "iife" ],
    },
    target: "esnext",
    outDir: "lib",
    emptyOutDir: false,
  },
  // plugins: [dts()],
})