const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const express = require('express');
const path = require('path');

const aliases = require('./webpack-aliases');

const Config = {
  entry: {
    main: './index.js',
    'import-midi': './src/apps/import-midi/index.js'
  },
  mode: process.env['NODE_ENV'] || 'production',
  devtool: process.env['NODE_ENV'] === 'development' ? 'source-map' : false,
  resolve: {
    modules: [
      'node_modules'
    ],
    alias: aliases,
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
    before: function(app, server) {
      app.use(
        '/media', 
        express.static(
          path.join( process.env.HOME, '/Music/iTunes/iTunes Media/Music' )
        )
      );
    },
    contentBase: path.join( __dirname, '/src/html-routes' ),
    compress: true,
    port: 8080
  }
};

if (!(process.env['NODE_ENV'] === 'development')) {
  Config.optimization = { minimizer: [ new UglifyJsPlugin() ] };
}

module.exports = Config;
