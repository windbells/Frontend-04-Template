module.exports = {
  entry: './main.js',
  module: {
    rules: [
      {
        test: /\.js$/, // 正则表达式
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: 'createElement',
                },
              ],
            ],
          },
        },
      },
    ],
  },
  mode: 'development', // 开发者模式
};
