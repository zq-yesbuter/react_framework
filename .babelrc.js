module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  plugins: [
    [
      'import',
      {
        libraryName: 'antd',
        style: true,
      },
    ],
    //   ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 2,
      },
    ],
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          components: './src/components',
        },
      },
    ],
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
};
