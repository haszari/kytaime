
// styles
// require('./styles/app.scss');

import React from 'react';
import {render} from 'react-dom';

import { Provider } from 'react-redux'

import store from './stores/store';
// import * as actions from './stores/actions';

import { sequencer, bpmUtilities, midiOutputs } from '../../lib/sequencer';

import renderTestPattern from './test-pattern';
// import throwdown from './components/throwdown/service.jsx';

import Transport from './components/transport/component.jsx';
import ThrowdownList from  './components/throwdown/components/throwdown-list.jsx';

function App({ audioContext }) {
  return (
    <Provider store={store}>
      {/* Provider likes to wrap a single element */}
      <div>
        <Transport />
        <ThrowdownList audioContext={audioContext} />
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

var appDiv = document.createElement('div');
document.body.appendChild(appDiv);

render(<App audioContext={ sequencer.audioContext } />, appDiv);

// import throwdownCoreApp from './throwdown-app';

/// -----------------------------------------------------------------------------------------------
// test / bootstrap actions
import * as throwdownActions from './components/throwdown/actions';

store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'mivova' }));

store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'mivova', 
  slug: 'beat', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20180425--mivova--padscape--beat.mp3',
    tempo: 122,
    duration: 8,
    part: 'drums',
    startBeats: [0, 3],
    endBeats: [0.5],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'mivova', 
  slug: 'bass', 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'mivova', 
  slug: 'voc', 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'mivova', 
  slug: 'synth', 
}));

store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'kytaime' }));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'kytaime', 
  slug: 'beat', 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'kytaime', 
  slug: 'bass', 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'kytaime', 
  slug: 'lead', 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'kytaime', 
  slug: 'lead', 
}));
store.dispatch(throwdownActions.throwdown_removeSnipStem({ 
  snip: 'kytaime', 
  slug: 'lead', 
}));



// testing snip actions
// store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'mary' }));
// store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'steve' }));
// store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'helen' }));
// store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'pete' }));
// store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'helen' }));
// store.dispatch(throwdownActions.throwdown_removeSnip({ slug: 'helen' }));
// store.dispatch(throwdownActions.throwdown_renameSnip({ slug: 'steve', newSlug: 'dave' }));
