
const { app, BrowserWindow } = require( 'electron' );

// appServer needs APP_PATH
process.env['APP_PATH'] = app.getAppPath();

// this references APP_PATH
const appServer = require( '../server/index.js' );

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow( {
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  } );

  win.loadURL( 'http://localhost:3876/' );
}

app.on( 'ready', createWindow );
