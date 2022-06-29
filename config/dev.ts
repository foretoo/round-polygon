import { defineConfig } from "rollup"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import esbuild from "rollup-plugin-esbuild"
import sass from "rollup-plugin-sass"
import serve from "rollup-plugin-serve"
import livereload from "rollup-plugin-livereload"
import { inliner } from "./plugins/js-inliner"



export default defineConfig({
  input: "./src/integration/index.ts",
  output: {
    file: "./src/integration/index.html",
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    esbuild(),
    sass({ insert: true }),
    inliner(),
    serve({
      open: process.env.served === "true" ? false : true,
      contentBase: "./src/integration",
      onListening: () => process.env.served = "true"
    }),
    livereload()
  ],
})