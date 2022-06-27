module.exports = {
  // each indentation 2 space.
  indent: 2,
  // if length of a line is more than 120, divide it into multiple lines.
  printWidth: 150,
  // a tab equal to 2 space.
  tabWidth: 2,
  useTabs: false,
  // to add semicolon to end of statement.
  semi: true,
  singleQuote: true,
  // to add quote to key of object property only if it's necessary.
  quoteProps: 'as-needed',
  // to add comma to end of value of object property.
  trailingComma: 'all',
  bracketSpacing: true,
  // to not split a start tag into 2 lines.
  bracketSameLine: true,
  // to not split a end tag into 2 lines.
  htmlWhitespaceSensitivity: 'ignore',
  // to not format script and style in vue, because they are responsibility of ESLint and StyleLint.
  vueIndentScriptAndStyle: true,
};
