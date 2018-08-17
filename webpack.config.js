
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var path = require('path');

var aliases = require('./webpack-aliases');


// const kytaimeApp = {
//    entry: "./src/www/app.jsx",
//    htmlTemplate: "src/www/index.html",
// };
const throwdownApp = {
   entry: "./src/www/app.jsx",
   htmlTemplate: "src/www/index.html",
};
// const squelchApp = {
//    entry: "./src/www/apps/squelcherisation/app.jsx",
//    htmlTemplate: "src/www/index.html",
// };
const app = throwdownApp;

module.exports = {
   entry: app.entry,
   output: {
      path: __dirname + "/dist/www",
      filename: "bundle.js"
   },
   devtool: 'source-map',
   resolve: {
      alias: aliases,
   },
   module: {
      loaders: [
         { 
            test: /\.jsx?$/, 
            exclude: /node_modules/, 
            loader: "babel",
            query: {
               presets: ['es2015', 'react', 'stage-2']
            },
         },
         { 
            test: /\.css$/, 
            loader: "style!css" 
         },
         {
            test: /\.scss$/,
            loader: 'style!css!sass'
         },
         {
            test: /\.html$/,
            loader: 'html-loader'
         }
      ]
   },
   sassLoader: {
      includePaths: [path.resolve(__dirname, "./node_modules/foundation-sites/scss")]
   },
   // this helps generate an html file for our generated bundle filename
   plugins: [
      new HtmlWebpackPlugin({
         template: app.htmlTemplate
      }),
      new CopyWebpackPlugin([
         { from: 'src/www/styles/fontello-kytaime-icons', to: 'styles/fontello-kytaime-icons' },
      ]) 
   ]
};