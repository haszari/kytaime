import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

import store from './store/store';
import observeStore from '@lib/observe-redux-store';

import ThrowdownApp from './throwdown-app';

import Header from './components/transport-header/header.jsx';
import HeaderPlaybackProgress from './components/playback-progress/header-progress.jsx';
import Decks from './components/throwdown/decks.jsx';

import importThrowdownFile from './components/file-import/file-import';

import './style/style.scss';

/// -----------------------------------------------------------------------------------------------
// app audio engine / service

const throwdownApp = new ThrowdownApp();

/// -----------------------------------------------------------------------------------------------
// load hard-coded test data

importThrowdownFile( 'manas', '/data/20190217--manas.hjson' );
// importThrowdownFile( 'noyu', '/data/20190325--noyu.hjson' );
// importThrowdownFile( 'axbdmt', '/data/20190325--alex-haszard-bdmt.hjson' );
// importThrowdownFile( 'sweets', 'data/20190306--sweets-from-a-stranger.hjson' );
// importThrowdownFile( 'maenyb', 'data/20190325--maenyb.hjson' );
// importThrowdownFile( 'shedout', 'data/20190325--shedout.hjson' );
// importThrowdownFile( 'mivova', 'data/20190325--mivova.hjson' );
importThrowdownFile( 'kufca', 'data/20190325--kufca.hjson' );

/// -----------------------------------------------------------------------------------------------
// bind sequencer/transport to store

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
    return state.transport.nextTempo
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
      <table cellSpacing="0" >
        <tbody>
          <Header />
          <HeaderPlaybackProgress backgroundColour="#ccc" progressColour="#888" />
          <Decks />
        </tbody>
      </table>
    </Provider>
  );
}

render(
  ( <App /> ), 
  document.getElementById('app')
);

// disable default drag handling on doc
document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())

