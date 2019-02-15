/*
Utilities for accessing Web MIDI output devices.

- list and display devices
- open a named device for sending midi events to
*/

let midiOutPorts = [];

function getMidiOutputs() {
   var access = navigator.requestMIDIAccess();
   access.then(function(midiAccess) { 
      midiAccess.outputs.forEach((port, key) => { 
         midiOutPorts.push({
            name: port.name, 
            port: port
         });
      });
      console.log('MIDI outputs:', midiOutPorts);
   });
}

getMidiOutputs();

export default {
   getOutputs: function() {
      return midiOutPorts;
   },

   openMidiOutput: function(options) {
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