// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  ignorePatterns: ['/dist/*'],
  settings: {
    'import/resolver': {
      alias: [
        ['@', './src'],  // adjust the path if your `src` directory is located elsewhere
      ],
    },
  },
};
