
import { sequencer, bpmUtilities, midiOutputs } from '../../lib/sequencer';

import renderNotePattern from '../../lib/render-note-pattern';
// import renderAutomationPattern from '../../lib/render-automation-pattern';

import store from './stores/store';
import * as actions from './stores/actions';


var midiOutPort = null;
let midiOutDevice = "";

const renderTestPattern = function(renderRange) {
   let curPhraseLength = 4;
   let pattern = {
      duration: 4,
      notes: [
        { 
          start: 0, 
          duration: 1, 
          note: 36, 
          velocity: 100 
          },
        { 
          start: 1, 
          duration: 1, 
          note: 36, 
          velocity: 100 
          },
        { 
          start: 2, 
          duration: 1, 
          note: 36, 
          velocity: 100 
          },
        { 
          start: 3, 
          duration: 1, 
          note: 36, 
          velocity: 100 
          },

        { 
          start: 0.64, 
          duration: 0.25, 
          note: 42, 
          velocity: 100 
          },
        { 
          start: 1.64, 
          duration: 0.25, 
          note: 42, 
          velocity: 100 
          },
        { 
          start: 2.64, 
          duration: 0.25, 
          note: 42, 
          velocity: 100 
          },
        { 
          start: 3.64, 
          duration: 0.25, 
          note: 42, 
          velocity: 100 
          },

  
        { 
          start: 0.98, 
          duration: 1, 
          note: 39, 
          velocity: 100 
          },
        { 
          start: 2.98, 
          duration: 1, 
          note: 39, 
          velocity: 100 
          },

        { 
          start: 3, 
          duration: 1, 
          note: 37, 
          velocity: 110 
        },
      ]
   };
   renderNotePattern(
      renderRange, renderRange.tempoBpm, curPhraseLength,
      midiOutPort, 
      pattern,
      1, 
      true, 
      true      
   );
}

var kytaimeSequencerCallback = function(renderRange) {
   // we should use some kind of chain tech thing here to make this generic!
   // updateUI(renderRange)
   // renderKytaimePatterns(renderRange);
   renderTestPattern(renderRange);
   // console.log(renderRange);
}


// var togglePlay = function() {
//    var currentPlayState = sequencer.isPlaying();
//    if (!currentPlayState) {
//       sequencer.start();
//       store.dispatch(actions.transportPlayState("playing"));
//    }
//    else {
//       sequencer.stop();
//       store.dispatch(actions.transportPlayState("stopped"));
//    }

// }

// var setOptions = function(options) {
//    midiOutPort = options.port;
// };


function getMidiOut() { return midiOutDevice; };
function setMidiOut(requestedPortName) {
   midiOutputs.openMidiOutput({
      deviceName: requestedPortName, // default
      callback: function(info) {
         if (info.port) {
            midiOutPort = info.port;
            console.log("Using " + midiOutPort.name);
            midiOutDevice = midiOutPort.name;

            // initialiseTransport();
         }
      }.bind(this)
   });   
}

setMidiOut("IAC Driver Bus 1");


// script main thing

// store.dispatch(actions.transportPlayState("stopped"));

sequencer.setRenderCallback('kytaime', kytaimeSequencerCallback);



// module.exports.setPattern = setPattern;
// module.exports.togglePlay = togglePlay;
module.exports.start = sequencer.start;
module.exports.stop = sequencer.stop;
module.exports.getMidiOut = getMidiOut;
module.exports.setMidiOut = setMidiOut;
