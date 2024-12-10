module.exports = {
    testEnvironment: 'node',
    rootDir: '.',
    testMatch: ['<rootDir>/src/__tests__/e2e/**/*.test.js'],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    setupFiles: ['<rootDir>/jest.setup.cjs'],
    testTimeout: 30000,
    moduleFileExtensions: ['js', 'cjs', 'mjs'],
};