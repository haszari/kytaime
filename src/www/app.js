document.write("All the action is in the console...");

import WebMidiHelper from './web-midi-helper';
import transport from './transport';
import midiUtilities from './midi-utilities';

// render our main template/html
var template = require("./templates/main.html");
var templateDiv = document.createElement('div');
document.body.appendChild(templateDiv);
document.addEventListener("DOMContentLoaded", function() {
   templateDiv.innerHTML = template;
});


const requestedPortName = "IAC Driver Logic MIDI In";
let midiOutPort = null;

function startMetronome() {
   if (transport) {
      transport.setOptions({
         port: midiOutPort,
         metronomeChannel: midiUtilities.channelMap.drums,
         metronomeNote: midiUtilities.drumMap.stick,
         metronomeOn: true
      });
      // transport.start();
   }
}

WebMidiHelper.openMidiOut({
   deviceName: requestedPortName, // default
   callback: function(info) {
      if (info.port) {
         midiOutPort = info.port;
         console.log("Using " + midiOutPort.name);

         startMetronome();
      }
   }
});

window.transport = transport;
window.midiOutPort = midiOutPort;

//console.log(midiUtilities);
