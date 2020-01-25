const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    embed: path.resolve(__dirname + '/src/index.js'),
    react: path.resolve(__dirname + '/src/react/embed.jsx'),
  },
  output: {
    path: path.resolve(__dirname + '/dist/'),
    filename: '[name].js',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  externals: {
    "react": 'react',
    "react-dom": 'react-dom',
  },
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, "src/"),
          path.resolve(__dirname, "node_modules/"),
        ],
        use: [
          MiniCssExtractPlugin.loader,
          // "style-loader", // creates style nodes from JS strings
          "css-loader?modules=true&localIdentName=[local]___[hash:base64:5]" // translates CSS into CommonJS
        ]
      },
    ],
  },
}
