module.exports = {
  root: true,
  extends: ['eslint-config-airbnb/node'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    //eslint hiện đang ko đọc được path config của tsconfig nên phải thêm rule này
    //TODO : sau này phải bỏ mấy rule này rồi config lại path ts và eslint
    'import/no-unresolved': [
      'error',
      {
        ignore: ['^~'],
      },
    ],
    'import/extensions': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    '@typescript-eslint/no-throw-literal': 'off',
  },

  plugins: ['import'],
  settings: {
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
    'import/resolver': {
      typescript: { project: ['tsconfig.json'] },
    },
  },
};
