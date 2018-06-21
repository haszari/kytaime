
import { sequencer, bpmUtilities, midiOutputs } from '../../lib/sequencer';

import renderTestPattern from './test-pattern';
// import throwdown from './components/throwdown/service.jsx';

import store from './stores/store';

var midiOutPort = null;
let midiOutDevice = "";

var sequencerCallback = function(renderRange) {
  let appState = store.getState();

  // throwdown.render(renderRange, appState.transport.triggerAudio, midiOutPort);

  renderTestPattern(renderRange, appState.transport.triggerTestMidi, midiOutPort, 1);

  console.log(`--- r t=${renderRange.start.time.toFixed(3)} b=${renderRange.start.beat.toFixed(3)}…${renderRange.end.beat.toFixed(3)} audio=${appState.transport.triggerAudio} midi=${appState.transport.triggerMidi}`);
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
    deviceName: requestedPortName,
    callback: function(info) {
     if (info.port) {
      midiOutPort = info.port;
      console.log("Using " + midiOutPort.name);
      midiOutDevice = midiOutPort.name;
      }
    }.bind(this)
  });
}

// script main setup ...

setMidiOut("IAC Driver Bus 1");
sequencer.setRenderCallback('throwdown', sequencerCallback);


// bind sequencer/transport to store

// (thanks to https://github.com/reduxjs/redux/issues/303#issuecomment-125184409)
function observeStore(store, select, onChange) {
  let currentState;

  function handleChange() {
    let nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

observeStore(
  store, 
  (storeState) => {
    return storeState.transport.playState
  }, 
  (playState) => {
    if (playState == "playing") {
      startTransport();
    }
    else {
      stopTransport();
    }
  }
);



module.exports.start = startTransport;
module.exports.stop = stopTransport;
module.exports.getMidiOut = getMidiOut;
module.exports.setMidiOut = setMidiOut;
