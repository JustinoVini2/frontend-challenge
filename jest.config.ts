module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  modulePaths: ["<rootDir>"],
  collectCoverage: true,
  collectCoverageFrom: ["./src/**"],
  coverageReporters: ["html"],
  coverageDirectory: "./coverage",
};
