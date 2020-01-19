const path = require( 'path' );
var express = require( 'express' );
var app = express();

// dev or production (so we can serve up appropriate client stuff)
// const DEVELOPMENT = process.env.NODE_ENV === 'development';

var webPort = 3876;

// if ( DEVELOPMENT ) {
//   // serve up webpacked client-side app
//   // console.log("We're serving up dev");
//   var devServer = require( './dev-server' );
//   app.use( devServer );
// }
// else {
// I think this requires that we run from root folder ..
console.log( "We're serving up production from dist/www/" );

// Serve up media (for access to stems)
app.use(
  '/media',
  express.static(
    path.join( process.env.HOME, '/Music/iTunes/iTunes Media/Music' )
  )
);

// serve built react app
app.use( express.static( path.join( process.env.APP_PATH, '/dist' ) ) );

// serve html page(s)
app.use( express.static( path.join( process.env.APP_PATH, '/src/html-routes' ) ) );

// serve hard-coded data
app.use(
  '/data',
  express.static(
    path.join( process.env.APP_PATH, '/src/data' )
  )
);

// }

// start http server
app.listen( webPort );

console.log( `go to http://localhost:${ webPort }` );
