import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
  
  collectCoverage: true,
  collectCoverageFrom: [ "index.ts", "segments.ts", "utils.ts" ],
  coverageReporters: [ "text" ],
  rootDir: "src",
  verbose: true,
  transform: {
    "^.+\.(t|j)s$": "@swc/jest",
  },
}

export default config