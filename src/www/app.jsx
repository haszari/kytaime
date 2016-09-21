import WebMidiHelper from './web-midi-helper';
import transport from './transport';
import midiUtilities from './midi-utilities';
import importMidiFile from './import-midi-file';

import NotePattern from './note-pattern';
import AutomationPattern from './automation-pattern';

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
      { start: 1.5, duration: 1, note: 36, velocity: 100 },
      { start: 3, duration: 1, note: 36, velocity: 100 },

      { start: 4.55, duration: 1, note: 36, velocity: 100 },
      { start: 6, duration: 1, note: 47, velocity: 90 },
      { start: 7.59, duration: 0.5, note: 48, velocity: 80 },
   ],
   endBeats: [ 0, 7.5 ]
});

// custom beat pattern
var halfOff = 0.64;
var snarePull = -0.02;
window.beat = new NotePattern({
   duration: 4,
   channel: midiUtilities.channelMap.drums,
   notes: [
      { start: 0, duration: 1, note: midiUtilities.drumMap.kick, velocity: 100 },
      { start: 1, duration: 1, note: midiUtilities.drumMap.kick, velocity: 100 },
      { start: 2, duration: 1, note: midiUtilities.drumMap.kick, velocity: 100 },
      { start: 3, duration: 1, note: midiUtilities.drumMap.kick, velocity: 100 },

      { start: 0 + halfOff, duration: 0.25, note: midiUtilities.drumMap.hat, velocity: 100 },
      { start: 1 + halfOff, duration: 0.25, note: midiUtilities.drumMap.hat, velocity: 100 },
      { start: 2 + halfOff, duration: 0.25, note: midiUtilities.drumMap.hat, velocity: 100 },
      { start: 3 + halfOff, duration: 0.25, note: midiUtilities.drumMap.hat, velocity: 100 },

      { start: 1 + snarePull, duration: 1, note: midiUtilities.drumMap.clap, velocity: 100 },
      { start: 3 + snarePull, duration: 1, note: midiUtilities.drumMap.clap, velocity: 100 },

      { start: 3, duration: 1, note: midiUtilities.drumMap.stick, velocity: 110 },
   ],
   startBeats: [ 0, 1 + snarePull, 3 + snarePull ]   
});

// custom lead pattern
window.lead = new NotePattern({
   duration: 16,
   channel: midiUtilities.channelMap.saw,
   notes: [
      { start: 0, duration: 7, note: 36, velocity: 50 },
      { start: 4, duration: 7, note: 42, velocity: 50 },
      { start: 8, duration: 7, note: 48, velocity: 50 },
      { start: 12 + halfOff, duration: 0.5, note: 46, velocity: 60 },
      { start: 15 + halfOff, duration: 0.5, note: 43, velocity: 60 },
   ],
   startBeats: [ 0, 12 ],   
   endBeats: [ 12 ]
});

window.send = new AutomationPattern({
   duration: 128,
   controller: 0,
   points: [
      { start: 5, value: 0 },
      { start: 6, value: 120 },
      { start: 7, value: 1 },

      { start: 31, value: 1 },
      { start: 30, value: 100 },
      { start: 33, value: 1 },

      { start: 100, value: 12 },
      { start: 120, value: 127 },
      { start: 127, value: 3 },
   ]
});
window.filter = new AutomationPattern({
   duration: 32, 
   controller: 20,
   points: [
      { start: 0, value: 120 },
      { start: 16, value: 12 },
      { start: 32, value: 120 }
   ]
});

//window.send.triggered = window.send.playing = false;

transport.setPattern({ 
   beat: window.beat, 
   bassline: window.bassline, 
   lead: window.lead,
   filter: window.filter,
   send: window.send
});

function onFileSelected(input) {
   var reader = new FileReader();
   reader.readAsArrayBuffer(input.files[0]);
   reader.onloadend = function(event) {
      var importedMidiFile = importMidiFile(event.target.result);
      var lastNote = _.maxBy(importedMidiFile.notes, 'start');
      var duration = Math.pow(2, Math.ceil(Math.sqrt(lastNote.start)));
      window.imported = new NotePattern({
         duration: duration,
         channel: midiUtilities.channelMap.stab,
         notes: importedMidiFile.notes
      });  
   }
}

window.onFileSelected = onFileSelected;
window.transport = transport;
window.midiOutPort = midiOutPort;

//console.log(midiUtilities);


import React from 'react';
import {render} from 'react-dom';

class App extends React.Component {
  render () {
    return <p> Hello React!</p>;
  }
}

var appDiv = document.createElement('div');
document.body.appendChild(appDiv);

render(<App/>, appDiv);