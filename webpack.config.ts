import path from 'path';
import * as webpack from 'webpack';
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config: webpack.Configuration = {
  entry: {
    index: path.resolve(__dirname, './src/entry.js'),
  },
  mode: 'development',
  devServer: {
    contentBase: '.temp',
    host: '0.0.0.0',
    disableHostCheck: true,
    hot: true,
    inline: true,
    overlay: true,
    port: 3030,
    proxy: {
      '/api': {
        target: 'https://session-test-wintyo.herokuapp.com/',
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './src/index.html'),
      hash: true,
      inject: true,
    })
  ]
};

export default config;
