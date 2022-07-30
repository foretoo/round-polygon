import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
  
  rootDir: "src/tests",
  verbose: true,
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
}

export default config