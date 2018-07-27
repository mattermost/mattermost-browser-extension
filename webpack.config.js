/*
    ./webpack.config.js
*/
const path = require('path');

const STANDARD_EXCLUDE = [
  path.join(__dirname, 'node_modules'),
  path.join(__dirname, 'non_npm_dependencies'),
];

module.exports = {
  entry: './src/app/index.js',
  output: {
    path: path.resolve('dist'),
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
    ],
  },
}
