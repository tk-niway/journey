module.exports = {
  // パーサーの設定
  parser: '@typescript-eslint/parser',

  // パーサーオプション
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },

  // プラグインの設定
  plugins: ['@typescript-eslint'],

  // 設定の継承
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],

  // ルートディレクトリの設定
  root: true,

  // 環境の設定
  env: {
    node: true,
  },

  // 除外ファイルの設定
  ignorePatterns: ['.eslintrc.cjs', 'dist/**/*', 'node_modules/**/*'],

  // ルールの設定
  rules: {
    // TypeScript関連のルール
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
      },
      {
        selector: 'enum',
        format: ['PascalCase'],
      },
      {
        selector: 'class',
        format: ['PascalCase'],
      },
    ],

    // セキュリティ関連のルール
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-optional-chaining': 'error',

    // パフォーマンス関連のルール
    'no-return-await': 'error',
    'no-promise-executor-return': 'error',

    // Prettierとの連携
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
