
import { sequencer, bpmUtilities, midiOutputs } from '../../lib/sequencer';

import renderTestPattern from './test-pattern';
import throwdown from './throwdown.jsx';

import store from './stores/store';
import * as actions from './stores/actions';

// let AudioContext = window.AudioContext || window.webkitAudioContext;
// var audioContext;
//   if (!audioContext)
//     audioContext = new AudioContext();

var midiOutPort = null;
let midiOutDevice = "";

var sequencerCallback = function(renderRange) {

  let appState = store.getState();
  throwdown.render(renderRange, appState.transport.triggerAudio, midiOutPort);

  renderTestPattern(renderRange, appState.transport.triggerMidi, midiOutPort, 0);


  console.log(''); // newline
  console.log(`r t=${renderRange.start.time.toFixed(3)} b=${renderRange.start.beat.toFixed(3)}…${renderRange.end.beat.toFixed(3)} audio=${appState.transport.triggerAudio} midi=${appState.transport.triggerMidi}`);
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
