import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testTimeout: 30000,
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.integration.test.ts"],
  moduleFileExtensions: ["js", "json", "ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  rootDir: ".",
  coverageDirectory: "./coverage/integration",
  collectCoverageFrom: [
    "src/**/*.ts",
    "src/**/*.js",
    "!src/**/*.test.ts",
    "!src/**/*.test.js",
    "!src/**/index.ts",
    "!src/**/jest.config.ts",
  ],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.integration.ts"],
};

export default config;
