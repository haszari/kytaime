document.write("All the action is in the console...");

import WebMidiHelper from './web-midi-helper';
import transport from './transport';
import midiUtilities from './midi-utilities';
import NotePattern from './note-pattern';

// render our main template/html
var template = require("./templates/main.html");
var templateDiv = document.createElement('div');
document.body.appendChild(templateDiv);
document.addEventListener("DOMContentLoaded", function() {
   templateDiv.innerHTML = template;
});


const requestedPortName = "IAC Driver Logic MIDI In";
let midiOutPort = null;

function initialiseTransport() {
   if (transport) {
      transport.setOptions({
         port: midiOutPort,
         metronomeChannel: midiUtilities.channelMap.drums,
         metronomeNote: midiUtilities.drumMap.stick,
         metronomeOn: false
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

         initialiseTransport();
      }
   }
});


// default pattern is 4 x hats
window.hats = new NotePattern();

// custom bass pattern
window.bassline = new NotePattern({
   duration: 8,
   channel: midiUtilities.channelMap.bass,
   notes: [
      { start: 0, duration: 1, note: 36, velocity: 100 },
      { start: 1, duration: 1, note: 36, velocity: 100 },
      { start: 2, duration: 1, note: 36, velocity: 100 },
      { start: 3, duration: 1, note: 36, velocity: 100 },
      // 1 beat rest on 1
      { start: 5, duration: 1, note: 36, velocity: 100 },
      { start: 6, duration: 1, note: 47, velocity: 100 },
      { start: 7, duration: 1, note: 30, velocity: 100 },
   ]
});

window.transport = transport;
window.midiOutPort = midiOutPort;

//console.log(midiUtilities);
