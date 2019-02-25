import _ from 'lodash'; 

import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

import Hjson from 'hjson';

import store from './store/store';

import ThrowdownApp from './throwdown-app';

import PlayButton from './components/play-button.jsx';
import TempoDrop from './components/tempo-drop/component.jsx';

import throwdownActions from './components/throwdown/actions';

/// -----------------------------------------------------------------------------------------------
// app audio engine / service

const throwdownApp = new ThrowdownApp();


/// -----------------------------------------------------------------------------------------------
// load hard-coded test data

const testSongFile = '/data/20190217--manas.hjson';

function importThrowdownData( throwdownData ) {
  _.map( throwdownData.patterns, ( pattern, key ) => {
    store.dispatch( throwdownActions.addPattern( {
      slug: key, 
      ...pattern
    } ) );
  } );
  _.map( throwdownData.sections, ( section, key ) => {
    store.dispatch( throwdownActions.addSection( {
      slug: key, 
      ...section
    } ) );
  } );
}

window.fetch( testSongFile )
  .then( response => response.text() )
  .then( text => {
    const songData = Hjson.parse( text );
    importThrowdownData( songData );
  } );

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

observeStore(
  store, 
  // transport component could provide this selector
  ( state ) => {
    return state.transport.isPlaying
  }, 
  ( isPlaying ) => {
    if ( isPlaying ) {
      throwdownApp.startTransport();
    }
    else {
      throwdownApp.stopTransport();
    }
  }
);

// hook up transport tempo to state
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
      <PlayButton />
      <TempoDrop />
    </Provider>
  );
}

render(
  ( <App /> ), 
  document.getElementById('app')
);

