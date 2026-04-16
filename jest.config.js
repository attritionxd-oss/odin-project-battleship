// specifies files from triggering a test run
export default {
  watchPathIgnorePatterns: [
    "<rootDir>/sandbox/sandbox.js",
    "<rootDir>/sandbox/sandbox*.js",
    "<rootDir>/build/*.js",
    "<rootDir>*.sandbox.js",
    ".*\\.mjs$",
  ],
  // use the 'node' environment for service/API testing
  testEnvironment: "node",
  // autoclear mock calls and instances between tests
  clearMocks: true,
  // ensure Jest finds the tests directory
  testMatch: ["<rootDir>/tests/**/*.test.js"],
};
