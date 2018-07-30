/*
    ./webpack.config.js
*/
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const STANDARD_EXCLUDE = [
  path.join(__dirname, 'node_modules'),
];

module.exports = {
  entry: ['babel-polyfill', './src/app/index.js', './src/main.html'],
  output: {
    path: path.resolve('dist'),
    publicPath: '/static/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
          test: /\.(js|jsx)?$/,
          exclude: STANDARD_EXCLUDE,
          use: [
              {
                  loader: 'babel-loader',
                  options: {
                      presets: [
                          'react',
                          ['es2015', {modules: false}],
                          'stage-0',
                      ],
                      plugins: ['transform-runtime'],
                      cacheDirectory: true,
                  },
              },
          ],
      },
      {
        test: /\.html$/,
        use: [
            {
                loader: 'html-loader',
                options: {
                    attrs: 'link:href',
                },
            },
        ],
      },
    ],
  },
  target: 'web',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'main.html',
      inject: 'head',
      template: 'src/main.html',
    })
  ]
}
