const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';
const ASSET_PATH = isDevelopment ? '/' : '/ahj-homeworks/workers/frontend/';

module.exports = {
  entry: './src/index.js',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: ASSET_PATH,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/image/[name][ext]'
        }
      },
      {
        test: /\.(mp4|webm)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/video/[name][ext]'
        }
      },
      {
        test: /\.(mp3|wav)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/audio/[name][ext]'
        }
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css',
    }),
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(
        process.env.NODE_ENV === 'production'
          ? 'https://ahj-homeworks-backend.onrender.com/api'
          : 'http://localhost:3000/api'
      )
    }),
    ...(!isDevelopment ? [
      new GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [{
          urlPattern: new RegExp('https://ahj-homeworks-backend.onrender.com/'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 24 * 60 * 60
            }
          }
        }]
      })
    ] : [])
  ],
};