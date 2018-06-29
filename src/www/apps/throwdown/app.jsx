
// styles
// require('./styles/app.scss');

import React from 'react';
import {render} from 'react-dom';

import { Provider } from 'react-redux'

import store from './stores/store';
import * as transportActions from './components/transport/actions';

import { sequencer, bpmUtilities, midiOutputs } from '../../lib/sequencer';

import renderTestPattern from './test-pattern';
// import throwdown from './components/throwdown/service.jsx';

import Transport from './components/transport/component.jsx';

import ThrowdownService from  './components/throwdown/services/throwdown-service.jsx';
import ThrowdownList from  './components/throwdown/components/throwdown-list.jsx';

function App({ audioContext }) {
  return (
    <Provider store={store}>
      {/* Provider likes to wrap a single element */}
      <div>
        <Transport />

        <ThrowdownService audioContext={audioContext} />
        <ThrowdownList />
      </div>
    </Provider>
  );
}

var midiOutPort = null;
let midiOutDevice = "";

var sequencerCallback = function(renderRange) {
  let appState = store.getState();

  // throwdown.render(renderRange, appState.transport.triggerAudio, midiOutPort);

  renderTestPattern(renderRange, appState.transport.triggerTestMidi, midiOutPort, 0);

  store.dispatch(transportActions.transportRenderUpdate(renderRange));

  console.log(`--- r t=${renderRange.start.time.toFixed(3)} b=${renderRange.start.beat.toFixed(3)}…${renderRange.end.beat.toFixed(3)} audio=${appState.transport.triggerAudio} midi=${appState.transport.triggerMidi}`);
}

var startTransport = function() {
  sequencer.start();
}
var stopTransport = function() {
  // throwdown.stop();
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

// hook up playback to app state
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

/// -----------------------------------------------------------------------------------------------
// main

setMidiOut("IAC Driver Bus 1");
sequencer.setRenderCallback('throwdown', sequencerCallback);

// I believe we need to nudge the channel count so we can use em all
sequencer.audioContext.destination.channelCount = sequencer.audioContext.destination.maxChannelCount;


var appDiv = document.createElement('div');
document.body.appendChild(appDiv);

render(<App audioContext={ sequencer.audioContext } />, appDiv);

import './load-test-snip-data';

