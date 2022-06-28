import { defineConfig } from "rollup"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import esbuild from "rollup-plugin-esbuild"
import { eslintBundle } from "rollup-plugin-eslint-bundle"
import sass from "rollup-plugin-sass"

export default defineConfig([
  {
    input: "./src/integration/index.ts",
    output: {
      file: "./public/index.js",
      format: "es",
      exports: "named",
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      esbuild(),
      eslintBundle({ eslintOptions: { fix: true }}),
      sass({ output: "./public/style.css" }),
    ],
  }
])