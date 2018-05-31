
import { sequencer, bpmUtilities, midiOutputs } from '../../lib/sequencer';

import renderTestPattern from './test-pattern';
import throwdown from './throwdown.jsx';

import store from './stores/store';
import * as actions from './stores/actions';

let AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;

var midiOutPort = null;
let midiOutDevice = "";

var sequencerCallback = function(renderRange) {
  if (!audioContext)
    audioContext = new AudioContext();

  renderTestPattern(renderRange, midiOutPort, 1);

  throwdown.render(renderRange, midiOutPort, audioContext.destination);
}

var startTransport = function() {
  sequencer.start();
}
var stopTransport = function() {
  throwdown.stop();
  sequencer.stop();
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



module.exports.start = startTransport;
module.exports.stop = stopTransport;
module.exports.getMidiOut = getMidiOut;
module.exports.setMidiOut = setMidiOut;
