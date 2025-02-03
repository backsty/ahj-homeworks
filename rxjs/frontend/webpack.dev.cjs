const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.cjs');

module.exports =  merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
      'Content-Security-Policy': "default-src 'self' http://localhost:3000; connect-src 'self' http://localhost:3000; worker-src 'self' blob: 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    },
    static: {
      directory: './dist',
    },
    compress: true,
    port: 8080,
    open: false,
    hot: true,
    historyApiFallback: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});