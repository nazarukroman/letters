module.exports = {
  '*.{js,jsx}': ['oxfmt', 'oxlint --fix'],
  '*.css': ['oxfmt'],
  'package.json': ['oxfmt'],
  '*.{json,md,mjs,cjs}': ['oxfmt'],
};
