const rules = require('./.eslintrc.rules')

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'standard',
  ],
  parserOptions: { ecmaVersion: 2018 },
  plugins: ['html'],
  rules,
}
