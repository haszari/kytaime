
var HtmlWebpackPlugin = require('html-webpack-plugin');

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
   // this helps generate an html file for our generated bundle filename
   plugins: [new HtmlWebpackPlugin()]
};