const ESLintPlugin = require("eslint-webpack-plugin");
const express = require("express");
const path = require("path");

const aliases = require("./webpack-aliases");

const Config = {
   plugins: [new ESLintPlugin()],
   entry: {
      main: "./src/apps/throwdown/index.js",
      "import-midi": "./src/apps/import-midi/index.js",
      "link-click": "./src/apps/link-click/index.js",
   },
   mode: process.env["NODE_ENV"] || "production",
   devtool: process.env["NODE_ENV"] === "development" ? "source-map" : false,
   resolve: {
      modules: ["node_modules"],
      alias: aliases,
      fallback: { os: require.resolve("os-browserify/browser") },
   },
   module: {
      rules: [
         {
            test: /\.scss$/,
            use: [
               "style-loader", // creates style nodes from JS strings
               "css-loader", // translates CSS into CommonJS
               "sass-loader", // compiles Sass to CSS, using Node Sass by default
            ],
         },
         {
            test: /\.worker\.js$/,
            use: { loader: "worker-loader" },
         },
         {
            test: /\.js$|\.jsx$/,
            exclude: /node_modules/,
            use: ["babel-loader"],
         },
      ],
   },
   devServer: {
      static: [
         path.join(__dirname, "/src/html-routes"),
         // Hjson song data files.
         {
            directory: path.join(__dirname, "/src/data"),
            publicPath: "/data",
         },
         // iTunes / Apple Music media (stems, audio, samples, loops).
         {
            directory: path.join(process.env.HOME, "/Music/Music/Media.localized"),
            publicPath: "/media",
         },
      ],
      compress: true,
      port: 3876,
   },
};

// if (!(process.env['NODE_ENV'] === 'development')) {
//   Config.optimization = { minimizer: [ new UglifyJsPlugin() ] };
// }

module.exports = Config;
