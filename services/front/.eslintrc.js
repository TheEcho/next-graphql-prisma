module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    project: './tsconfig.json', // Allow to use rules which require type information
    tsconfigRootDir: __dirname,
    extraFileExtensions: ['.json'],
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:react/jsx-runtime',
  ],
  plugins: [
    '@typescript-eslint',
    'prettier',
    'react',
    'unused-imports',
    'simple-import-sort',
    'regex',
    'jsx-expressions',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['warn'],
    'no-console': 'warn',
    'no-nested-ternary': 'error',
    'jsx-quotes': ['warn', 'prefer-double'],
    'react/jsx-filename-extension': ['error', { extensions: ['.ts', '.tsx'] }],
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': [
      'off',
      {
        allowExpressions: true,
      },
    ],
    'padding-line-between-statements': ['warn', { blankLine: 'always', prev: '*', next: 'return' }],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-vars': 1,
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports-ts': 'error',
    'unused-imports/no-unused-vars-ts': [
      'error',
      { vars: 'all', args: 'none', ignoreRestSiblings: true },
    ],
    '@typescript-eslint/ban-types': 0,
    curly: 'warn',
    'sort-imports': 'off',
    'import/order': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [['^\\u0000'], ['^(?!@)\\w'], ['^@!?(?!src)\\w'], ['^@src\\w'], ['^'], ['^\\.']],
      },
    ],
    'simple-import-sort/exports': 'error',
    'regex/invalid': [
      'warn',
      [
        {
          regex: '\\.sort\\(',
          message: 'Array.sort would mutate the array, please rely on space-lift or sort utils',
        },
      ],
    ],
    'regex/invalid-error': [
      'error',
      [
        {
          regex: '\\/\\*\\* \\@jsx jsx \\*\\/',
          message: 'Do not use /** @jsx jsx */',
          replacement: '',
          files: {
            inspect: 'src/(.*).[t,j]?sx$',
          },
        },
        {
          regex: "import React,\\s(.*)\\sfrom 'react'",
          message: 'Do not import React',
          replacement: { function: "return `import ${$[1]} from 'react'`" },
          files: {
            inspect: 'src/(.*).[t,j]?sx$',
          },
        },
        {
          regex: "import React from 'react'",
          message: 'Do not import React',
          replacement: '',
          files: {
            inspect: 'src/(.*).[t,j]?sx$',
          },
        },
        {
          regex: '": "[<>~^*]',
          message: 'Use exact version only.',
          files: {
            inspect: 'package.json',
          },
        },
        {
          regex: '=\\suse(\\w+)Mutation\\(\\)',
          message: 'Use useGeneratedMutation decorator',
          replacement: {
            function:
              "return `= useGeneratedMutation(use${$[1]}Mutation())`",
          },
          files: {
            inspect: 'src/(.*).[t,j]?sx$',
          },
        }
      ],
    ],
    'jsx-expressions/strict-logical-expressions': 'error',
  },
}
