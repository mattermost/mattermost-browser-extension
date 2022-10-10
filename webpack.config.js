/*
    ./webpack.config.js
*/
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const STANDARD_EXCLUDE = [path.join(__dirname, "node_modules")];

module.exports = {
  entry: ["./src/app/index.js", "./src/main.html"],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: STANDARD_EXCLUDE,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
              plugins: ["@babel/plugin-transform-runtime"],
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
    ],
  },
  target: "web",
  plugins: [
    new HtmlWebpackPlugin({
      filename: "main.html",
      inject: "head",
      template: "src/main.html",
    }),
  ],
  stats: {
    errorDetails: true,
    logging: "verbose",
  },
};
