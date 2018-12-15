const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// const aliases = require('./webpack-aliases');

const Config = {
  entry: './index.js',
  mode: process.env['NODE_ENV'] || 'production',
  devtool: process.env['NODE_ENV'] === 'development' ? 'source-map' : false,
  resolve: {
    modules: [
      'node_modules'
    ],
    // alias: aliases,
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      },
      {
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        use: ['babel-loader?presets[]=react,env', 'eslint-loader?fix=true&emitWarning=true']
      }
    ]
  },
  devServer: {
    contentBase: __dirname,
    compress: true,
    port: 8080
  }
};

if (!(process.env['NODE_ENV'] === 'development')) {
  Config.optimization = { minimizer: [ new UglifyJsPlugin() ] };
}

module.exports = Config;
