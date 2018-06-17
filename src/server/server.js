const path = require('path')
var express = require('express')
var app = express();

// dev or production (so we can serve up appropriate client stuff)
const DEVELOPMENT = process.env.NODE_ENV === 'development';

var webPort = 6041;

if (DEVELOPMENT) {
   // serve up webpacked client-side app
   console.log("We're serving up dev");
   var devServer = require('./dev-server');
   app.use(devServer);
}
else {
   // I think this requires that we run from root folder ..
   console.log("We're serving up production from dist/www/");
   app.use(express.static(path.join(process.env.APP_PATH, '/dist/www')));
}

// serve up iTunes media folder for easy access to audio
app.use('/media', express.static(path.join(process.env.HOME, '/Music/iTunes/iTunes Media/Music')));

// serve up Throwdown folder for easy access to snip / throwdown metadata
app.use('/throwdown', express.static(path.join(process.env.HOME, '/Music/Throwdown')));

// start http server
app.listen(webPort);

console.log(`go to http://localhost:${webPort}`);
