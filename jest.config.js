module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterSetup: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.jest.json',
      diagnostics: false
    }
  },
  moduleNameMapper: {
    '^@fluentui/react/lib/(.*)$': '<rootDir>/node_modules/@fluentui/react/lib-commonjs/$1'
  },
  testMatch: ['<rootDir>/tests/**/*.test.{ts,tsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json']
};
