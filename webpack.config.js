
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   entry: "./src/www/app.js",
   output: {
      path: __dirname + "/dist/www",
      filename: "bundle.js"
   },
   devtool: 'source-map',
   module: {
      loaders: [
         { 
            test: /\.js$/, 
            exclude: /node_modules/, 
            loader: "babel",
            query: {
               presets: ['es2015']
            }
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