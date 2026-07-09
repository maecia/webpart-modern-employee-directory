const { toHaveNoViolations } = require('jest-axe')

// Force French locale for deterministic test assertions
jest.mock('./src/webparts/sharepointDirectory/loc/mystrings', () => {
  const original = jest.requireActual('./src/webparts/sharepointDirectory/loc/mystrings')
  return {
    ...original,
    setLanguage: () => {},
  }
})

expect.extend(toHaveNoViolations)

// Suppress React 17 act() warnings in test output
const originalError = console.error
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('inside a test was not wrapped in act')) return
  originalError.call(console, ...args)
}
