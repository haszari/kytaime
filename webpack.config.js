
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var path = require('path');

module.exports = {
   entry: "./src/www/app.jsx",
   output: {
      path: __dirname + "/dist/www",
      filename: "bundle.js"
   },
   devtool: 'source-map',
   module: {
      loaders: [
         { 
            test: /\.jsx?$/, 
            exclude: /node_modules/, 
            loader: "babel",
            query: {
               presets: ['es2015', 'react']
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
         template: 'src/www/index.html'
      }),
      new CopyWebpackPlugin([
         { from: 'src/www/styles/fontello-kytaime-icons', to: 'styles/fontello-kytaime-icons' },
      ]) 
   ]
};