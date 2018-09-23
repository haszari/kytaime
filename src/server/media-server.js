const path = require('path');
const FileHound = require('filehound');

const mediaBaseFolder = path.join(process.env.HOME, '/Music/iTunes/iTunes Media/Music');

function findAndServeMedia(req, res, next) {
  const files = FileHound.create()
    .paths( mediaBaseFolder )
    .match( `*${ req.params.queryText }*` )
    .find();

  files.then( ( files ) => {
    if ( ! files.length ) 
      res.sendStatus( 404 );

    res.sendFile( files[ 0 ] );
  }, 
  () => {
    res.sendStatus( 404 );
  });
}

function mediaServer( app ) {
  app.use( '/api/media/first/:queryText', findAndServeMedia );
}

module.exports = mediaServer;