module.exports = {
  // 文末にセミコロンを付与
  semi: true,

  // 文字列にシングルクォートを使用
  singleQuote: true,

  // JSXではダブルクォートを使用
  jsxSingleQuote: false,

  // 配列やオブジェクトの最後の要素の後にカンマを付与（ES5互換）
  trailingComma: 'es5',

  // インデントのスペース数を2に設定
  tabWidth: 2,

  // タブの代わりにスペースを使用
  useTabs: false,

  // オブジェクトリテラルの括弧内にスペースを入れる
  bracketSpacing: true,

  // アロー関数の引数に常に括弧を付与
  arrowParens: 'always',

  // 改行コードをLFに統一（Unixスタイル）
  endOfLine: 'lf',

  // 閉じ括弧を新しい行に配置
  bracketSameLine: false,

  // オブジェクトのプロパティ名を必要な場合のみクォートで囲む
  quoteProps: 'as-needed',

  // マークダウンの改行を保持
  proseWrap: 'preserve',

  // HTMLの空白の扱いをCSSに準拠
  htmlWhitespaceSensitivity: 'css',

  // 埋め込み言語（例：CSS-in-JS）の自動フォーマット
  embeddedLanguageFormatting: 'auto',

  // 属性を1行にまとめる（falseの場合）
  singleAttributePerLine: false,

  // 1行の最大文字数（デフォルト値）
  printWidth: 80,
};
