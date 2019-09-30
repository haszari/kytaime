/*
Web Worker interval (timer) callback utility.

This is an essential part of accurate sequencing, as it ensures
the timer continues to run even if the tab/browser is in the background,
hidden, minimised etc. Also takes the heat off the main thread. Generally more
reliable than setInterval or requestAnimationFrame.
*/

var intervalId = null;

var stopCallbacks = function() {
  clearInterval( intervalId );
  intervalId = null;
};

var startCallbacks = function( renderInterval, message ) {
  intervalId = setInterval( function() {
    self.postMessage( message );
  }, renderInterval );
};

self.addEventListener( 'message', function( e ) {
  // note that 'start' & 'stop' are hard-coded in sequencer.js
  if ( e.data.type == 'start' ) {
    startCallbacks( e.data.interval, e.data.message );
  }
  else if ( e.data.type == 'stop' ) {
    stopCallbacks();
  }
}, false );
