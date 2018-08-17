
// styles
// require('./styles/app.scss');

import React from 'react';
import {render} from 'react-dom';

import { Provider } from 'react-redux'

import store from './stores/store';

import { sequencer, bpmUtilities } from '@kytaime/lib/sequencer';

import Transport from './components/transport/component.jsx';
import * as transportActions from './components/transport/actions';

import ThrowdownDecks from  './components/decks/views/throwdown-decks.jsx';
import ThrowdownService from  './components/decks/services/throwdown-service.jsx';

function App({ audioContext }) {
  return (
    <Provider store={store}>
      {/* Provider likes to wrap a single element */}
      <div>
        <Transport title="Squelcherisation" />

        {/* UI components */}
        <ThrowdownDecks />

        {/* service components to play back audio, midi */}
        <ThrowdownService audioContext={audioContext} />
      </div>
    </Provider>
  );
}

var sequencerCallback = function(renderRange) {

  store.dispatch(transportActions.transportRenderUpdate(renderRange));
}

var startTransport = function() {
  sequencer.start();
}
var stopTransport = function() {
  // throwdown.stop();
  sequencer.stop();
}


// bind sequencer/transport to store

// (thanks to https://github.com/reduxjs/redux/issues/303#issuecomment-125184409)
// this should be moved into a lib folder
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
  // transport component could provide this selector
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

sequencer.setMidiOut("IAC Driver Bus 1");
sequencer.setRenderCallback('throwdown', sequencerCallback);

// I believe we need to nudge the channel count so we can use em all
sequencer.audioContext.destination.channelCount = sequencer.audioContext.destination.maxChannelCount;


var appDiv = document.createElement('div');
document.body.appendChild(appDiv);

render(<App audioContext={ sequencer.audioContext } />, appDiv);

// import './load-test-snip-data';
import './load-squelch-snip-data';

