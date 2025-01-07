module.exports = {
    verbose: true,
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/jest.setup.cjs'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    transform: {
        '^.+\\.(js|jsx|mjs)$': ['babel-jest', { configFile: './.babelrc' }]
    },
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/'
    ],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    },
    moduleNameMapper: {
        '\\.(css|less)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    roots: ['<rootDir>/src']
};