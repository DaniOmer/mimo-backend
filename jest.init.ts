import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testTimeout: 15000,
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.unit.test.ts"],
  moduleFileExtensions: ["js", "json", "ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@apps/(.*)$": "<rootDir>/apps/$1",
  },
  rootDir: ".",
  coverageDirectory: "./coverage/unit",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/__tests__/**",
    "!src/**/index.ts",
    "!src/**/jest.config.ts",
    "!src/config/**",
  ],
  coverageReporters: ["json", "lcov", "text", "clover"],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.unit.ts"],
};

export default config;
