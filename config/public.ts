import { defineConfig } from "rollup"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import esbuild from "rollup-plugin-esbuild"
import { eslintBundle } from "rollup-plugin-eslint-bundle"
import sass from "rollup-plugin-sass"
import { terser } from "rollup-plugin-terser"

export default defineConfig({
  external: (id) => id.includes("src/index.ts") || null,
  input: "src/integration/index.ts",
  output: {
    file: "public/script.js",
    format: "es",
    paths: (id) =>
        id.includes("src/index.ts") ? "../dist/round-polygon.es.js"
      : id === "bratik"             ? "https://unpkg.com/bratik@latest/dist/bratik.min.js"
      : id === "simplex-noise"      ? "https://unpkg.com/simplex-noise@3.0.1/dist/esm/simplex-noise.js"
      : "",
  },
  plugins: [
    nodeResolve({ jail: "src" }),
    commonjs(),
    esbuild(),
    eslintBundle({ eslintOptions: { fix: true }}),
    sass({ output: "public/style.css" }),
    terser(),
  ],
})