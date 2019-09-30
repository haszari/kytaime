/*
Utilities for accessing Web MIDI output devices.

- list and display devices
- open a named device for sending midi events to
*/

const midiOutPorts = []; const midiInPorts = [];

function getMidiPorts() {
  var access = navigator.requestMIDIAccess();
  access.then( function( midiAccess ) {
    midiAccess.inputs.forEach( ( port, key ) => {
      midiInPorts.push( {
        name: port.name,
        port: port,
      } );
    } );
    console.log( 'MIDI inputs:', midiInPorts );
    midiAccess.outputs.forEach( ( port, key ) => {
      midiOutPorts.push( {
        name: port.name,
        port: port,
      } );
    } );
    console.log( 'MIDI outputs:', midiOutPorts );
  } );
}

getMidiPorts();

export default {
  getInputs: function() {
    return midiInPorts;
  },

  getOutputs: function() {
    return midiOutPorts;
  },

  // Open a midi device for output.
  // If there's no device with that name, nothing is returned.
  openMidiInput: function( options ) {
    var requestedDeviceName = options.deviceName;
    var callback = options.callback;

    if ( !callback ) {
      return;
    }

    var successInfo = {
      port: null,
    };

    var access = navigator.requestMIDIAccess();
    access.then( function( midiAccess ) {
      midiAccess.inputs.forEach( function( port, key ) {
        if ( port.name === requestedDeviceName ) {
          successInfo.port = port;
        }
      } );

      callback( successInfo );
    } );
  },

  // Open a midi device for output.
  // If a device matches the name you requested, you'll get that,
  // otherwise you'll get the first device.
  openMidiOutput: function( options ) {
    var requestedDeviceName = options.deviceName;
    var callback = options.callback;

    if ( !callback ) {
      return;
    }

    var successInfo = {
      port: null,
    };

    var access = navigator.requestMIDIAccess();
    access.then( function( midiAccess ) {
      midiAccess.outputs.forEach( function( port, key ) {
        if ( port.name === requestedDeviceName ) {
          successInfo.port = port;
        }
      } );

      callback( successInfo );
    } );
  },
};
