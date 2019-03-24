/*
Utilities for accessing Web MIDI output devices.

- list and display devices
- open a named device for sending midi events to
*/

let midiOutPorts = [], midiInPorts = [];

function getMidiPorts() {
   var access = navigator.requestMIDIAccess();
   access.then(function(midiAccess) { 
      midiAccess.inputs.forEach((port, key) => { 
         midiInPorts.push({
            name: port.name, 
            port: port
         });
      });
      console.log('MIDI inputs:', midiInPorts);
      midiAccess.outputs.forEach((port, key) => { 
         midiOutPorts.push({
            name: port.name, 
            port: port
         });
      });
      console.log('MIDI outputs:', midiOutPorts);
   });
}

getMidiPorts();

export default {
   getInputs: function() {
      return midiInPorts;
   },

   getOutputs: function() {
      return midiOutPorts;
   },

   openMidiInput: function( options ) {
      var requestedDeviceName = options.deviceName;
      var callback = options.callback;

      if (!callback) {
         return;
      }

      var successInfo = {
         port: null,
      };

      // get midi device .. and store in a global
      var access = navigator.requestMIDIAccess();
      access.then(function(midiAccess) { 
         midiAccess.inputs.forEach( function(port, key) { 
            if (!successInfo.port || port.name == requestedDeviceName) {
               successInfo.port = port;
            }
         });

         callback(successInfo);
      });
   },

   openMidiOutput: function( options ) {
      var requestedDeviceName = options.deviceName;
      var callback = options.callback;

      if (!callback) {
         return;
      }

      var successInfo = {
         port: null,
      };

      // get midi device .. and store in a global
      var access = navigator.requestMIDIAccess();
      access.then(function(midiAccess) { 
         midiAccess.outputs.forEach( function(port, key) { 
            if (!successInfo.port || port.name == requestedDeviceName) {
               successInfo.port = port;
            }
         });

         callback(successInfo);
      });
   }
}