const express = require('express');
const path = require('path');

const aliases = require('./webpack-aliases');

const Config = {
  entry: {
    main: './src/apps/throwdown/index.js',
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
        test: /\.scss$/,
        use: [
            "style-loader", // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
            "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      },
      {
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader?fix=true&emitWarning=true']
      }
    ]
  },
  devServer: {
    before: function(app, server) {
      // serve iTunes library for samples/media
      app.use(
        '/media', 
        express.static(
          path.join( process.env.HOME, '/Music/iTunes/iTunes Media/Music' )
        )
      );
      // serve hjson song data from src
      app.use(
        '/data', 
        express.static(
          path.join( __dirname, '/src/data' )
        )
      );
    },
    contentBase: path.join( __dirname, '/src/html-routes' ),
    compress: true,
    port: 3876
  }
};

// if (!(process.env['NODE_ENV'] === 'development')) {
//   Config.optimization = { minimizer: [ new UglifyJsPlugin() ] };
// }

module.exports = Config;
