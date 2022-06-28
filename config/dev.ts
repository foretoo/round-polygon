import { defineConfig } from "rollup"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import esbuild from "rollup-plugin-esbuild"
import sass from "rollup-plugin-sass"
import serve from "rollup-plugin-serve"
import livereload from "rollup-plugin-livereload"
import { inliner } from "./helpers/js-inliner"
import { template } from "../src/integration/helpers/template"



export default defineConfig({
  input: "./src/integration/index.ts",
  output: {
    file: "./src/integration/index.html",
  },
  plugins: [
    esbuild(),
    nodeResolve(),
    commonjs(),
    sass({ insert: true }),
    inliner(template),
    serve({
      open: process.env.served === "true" ? false : true,
      contentBase: "./src/integration",
      onListening: () => process.env.served = "true"
    }),
    livereload()
  ],
})