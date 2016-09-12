// Exports dev-server middleware for serving client-side assets.
// (For debugging)

var webpack = require("webpack");
var webpackMiddleware = require("webpack-dev-middleware");
var webpackConfig = require("../../webpack.config.js");

module.exports = webpackMiddleware(webpack(webpackConfig));

