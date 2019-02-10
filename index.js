import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

import store from './src/www/store/store';

import ThrowdownApp from './src/www/components/throwdown-app';
import BasslinePlayer from './src/www/components/bassline';
import BeatPlayer from './src/www/components/beat';

import TempoSlider from './src/www/components/tempo-slider.jsx';
import TempoDrop from './src/www/components/tempo-drop/component.jsx';


/// -----------------------------------------------------------------------------------------------
// app audio engine / service

const throwdownApp = new ThrowdownApp();
// throwdownApp.push( new BasslinePlayer() );
// throwdownApp.push( new BasslinePlayer( { midiChannel: 3 } ) );
const softStepBeat = new BeatPlayer();
throwdownApp.push( softStepBeat );

throwdownApp.toggleTransport();

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

// hook up transport tempo, beat sample player to state
observeStore(
  store, 
  // transport component could provide this selector
  ( state ) => {
    return state.transport.tempo
  }, 
  ( tempo ) => {
    throwdownApp.setTempo( tempo )
  }
);

// hook up transport next tempo to state
observeStore(
  store, 
  // transport component could provide this selector
  ( state ) => {
    return state.tempoDrop.nextTempo
  }, 
  ( nextTempo ) => {
    throwdownApp.setNextTempo( nextTempo )
  }
);

/// -----------------------------------------------------------------------------------------------
// app component

function App() {
  return (
    <Provider store={ store }>
      <h1>Bam</h1>
      <TempoSlider />
      <TempoDrop />
    </Provider>
  );
}

render(
  ( <App /> ), 
  document.getElementById('app')
);

