module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  ignorePatterns: ['node_modules/*', '.next/*', '.out/*', '!.prettierrc.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2020, ecmaFeatures: { jsx: true } },
  settings: { react: { version: 'detect' } },
  plugins: ['simple-import-sort', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  rules: {
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^[a-z]'], // libraries
          ['^@\\w'], // started from @
          ['^[A-Z]'], // aliases
          ['^\\.+(!?.scss)'], // not scss file
          ['^\\.'] // others file
        ]
      }
    ],
    'react/prop-types': 'off',
    'react/no-children-prop': 'off',
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true
      }
    ],
    '@typescript-eslint/no-empty-interface': [
      'warn',
      {
        allowSingleExtends: false
      }
    ],
    'no-console': 'warn',
    'no-empty-pattern': 'warn',
    'sort-imports': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'prettier/prettier': ['error', {}, { usePrettierrc: true }]
  }
};
