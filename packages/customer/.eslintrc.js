module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn', // Temporarily set to warn instead of error
    'jsx-a11y/no-autofocus': 'off', // Disable autofocus rule as it's intentionally used in forms
  },
}; 