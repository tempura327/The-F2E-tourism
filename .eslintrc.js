module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/typescript/recommended', 'plugin:prettier/recommended', 'eslint-config-prettier'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    // turns on the rule provided by this plugin, which runs Prettier from within ESLint.
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 'no-var-requires': false,
    'lines-around-comment': [
      'error',
      {
        afterBlockComment: false,
        afterLineComment: false,
      },
    ],
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
