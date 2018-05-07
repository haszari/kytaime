
import { sequencer, bpmUtilities, midiOutputs } from '../../lib/sequencer';

import renderTestPattern from './test-pattern';

import store from './stores/store';
import * as actions from './stores/actions';


var midiOutPort = null;
let midiOutDevice = "";

var sequencerCallback = function(renderRange) {
   // we should use some kind of chain tech thing here to make this generic!
   // updateUI(renderRange)
   // renderKytaimePatterns(renderRange);
   renderTestPattern(renderRange, midiOutPort, 1);
   // console.log(renderRange);
}

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

// script main setup ...

setMidiOut("IAC Driver Bus 1");
sequencer.setRenderCallback('throwdown', sequencerCallback);



module.exports.start = sequencer.start;
module.exports.stop = sequencer.stop;
module.exports.getMidiOut = getMidiOut;
module.exports.setMidiOut = setMidiOut;
