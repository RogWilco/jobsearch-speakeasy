module.exports = {
  arrowParens: 'avoid',
  plugins: [
    'prettier-plugin-multiline-arrays',
    'prettier-plugin-organize-imports',
    'prettier-plugin-packagejson',
    'prettier-plugin-sh',
  ].map(p => require.resolve(p)),
  multilineArraysWrapThreshold: 1,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
}
