/** @type {import('jest').Config} */
module.exports = {
  displayName: 'customer',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/src/test/setup.ts',
    '<rootDir>/src/setupTests.ts'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', {
      presets: ['next/babel'],
      plugins: ['@babel/plugin-transform-modules-commonjs']
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@orbitblu/common/(.*)$': '<rootDir>/../common/src/$1',
    '^@orbitblu/common$': '<rootDir>/../common/src'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{ts,tsx}',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  coverageDirectory: '../../coverage/packages/customer',
  transformIgnorePatterns: [
    '/node_modules/(?!@orbitblu/common)',
  ],
  rootDir: '.',
  roots: ['<rootDir>/src', '<rootDir>/../common/src'],
  modulePaths: ['<rootDir>/../common/src'],
  moduleDirectories: ['node_modules', '<rootDir>/../common/src'],
  resolver: null,
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  verbose: true,
}; 