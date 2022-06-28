import { defineConfig } from "rollup"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import esbuild from "rollup-plugin-esbuild"
import { eslintBundle } from "rollup-plugin-eslint-bundle"
import dts from "rollup-plugin-dts"

export default defineConfig([
  {
    input: "./src/index.ts",
    output: [
      {
        file: "./dist/index.es.js",
        format: "es",
        exports: "named",
      },
      {
        file: "./dist/index.iife.js",
        format: "iife",
        name: "toolkit"
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      esbuild(),
      eslintBundle({ eslintOptions: { fix: true }}),
    ],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "./dist/index.d.ts"
    },
    plugins: [dts()],
  },
])