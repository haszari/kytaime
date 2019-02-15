import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

import store from './src/www/store/store';

import ThrowdownApp from './src/www/components/throwdown-app';
import BasslinePlayer from './src/www/components/bassline';
import SampleSlicePlayer from './src/www/components/sample-slice-player';

import TempoDrop from './src/www/components/tempo-drop/component.jsx';


/// -----------------------------------------------------------------------------------------------
// app audio engine / service

const throwdownApp = new ThrowdownApp();


/// -----------------------------------------------------------------------------------------------
// hard-coded test data

// throwdownApp.push( new BasslinePlayer() );
// throwdownApp.push( new BasslinePlayer( { midiChannel: 3 } ) );
throwdownApp.push(
  new SampleSlicePlayer( {
    audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-beat-alpine.m4a',
    tempoBpm: 132, 
    sampleDuration: 4,
  } )
);
throwdownApp.push(
  new SampleSlicePlayer( {
    audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-beat-step-alpine.m4a',
    tempoBpm: 132, 
    sampleDuration: 4,
  } )
);
throwdownApp.push(
  new SampleSlicePlayer( {
    audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-sub-ridge2.mp3',
    tempoBpm: 132, 
    sampleDuration: 4,
  } )
);
throwdownApp.push(
  new SampleSlicePlayer( {
    audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-lead-uplands.m4a',
    tempoBpm: 132, 
    sampleDuration: 16,
  } )
);
throwdownApp.push(
  new SampleSlicePlayer( {
    audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-voc-hills.m4a',
    tempoBpm: 132, 
    sampleDuration: 32,
  } )
);

throwdownApp.toggleTransport();

/// -----------------------------------------------------------------------------------------------
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
      <TempoDrop />
    </Provider>
  );
}

render(
  ( <App /> ), 
  document.getElementById('app')
);

