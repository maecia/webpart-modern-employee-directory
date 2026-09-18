require('@testing-library/jest-dom');

// Force French locale so component tests assert the default FR strings.
const { setLanguage } = require('./src/webparts/sharepointDirectory/loc/mystrings');
setLanguage('fr-FR');

// Suppress React 17 act() warnings in test output
const originalError = console.error;
console.error = (...args) => {
  if (
    args[0] &&
    typeof args[0] === 'string' &&
    args[0].includes('inside a test was not wrapped in act')
  ) {
    return;
  }
  originalError.call(console, ...args);
};
