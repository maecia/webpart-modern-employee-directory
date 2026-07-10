require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [
    '@microsoft/eslint-config-spfx/lib/profiles/default',
  ],
  parserOptions: { tsconfigRootDir: __dirname },
  plugins: ['react-hooks'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-extra-semi': 'off',
    'no-case-declarations': 'off',
    'no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'off',
  },
};
