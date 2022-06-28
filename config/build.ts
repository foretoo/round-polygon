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
        file: "./dist/round-polygon.es.js",
        format: "es",
        exports: "named",
      },
      {
        file: "./dist/round-polygon.iife.js",
        format: "iife",
        exports: "named",
        name: "roundPolygon"
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
      file: "./dist/round-polygon.d.ts"
    },
    plugins: [dts()],
  },
])