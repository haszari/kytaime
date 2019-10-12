import React from 'react';
import { render, } from 'react-dom';

import { Provider, } from 'react-redux';

import store from './store/store';
import observeStore from '@lib/observe-redux-store';

import ThrowdownApp from './throwdown-app';

import Header from './components/transport-header/header.jsx';
import HeaderPlaybackProgress from './components/playback-progress/header-progress.jsx';
import Decks from './components/throwdown/decks.jsx';

import transportActions from './components/transport/actions';

import fileImport from './components/drag-drop/file-import';
import importDrop from './components/drag-drop/ghost-deck.jsx';

import './style/style.scss';

/// -----------------------------------------------------------------------------------------------
// app audio engine / service

const throwdownApp = new ThrowdownApp();

/// -----------------------------------------------------------------------------------------------
// load hard-coded test data

fileImport.importThrowdownFile( 'data/20190422--likeso.hjson' );
// fileImport.importThrowdownFile( 'data/nook-cranny/20190325--ambients.hjson' );
// fileImport.importThrowdownFile( 'data/nook-cranny/20190325--beats.hjson' );
// fileImport.importThrowdownFile( 'data/nook-cranny/20190325--transitions.hjson' );
// fileImport.importThrowdownFile( 'data/20190325--mivova.hjson' );
// fileImport.importThrowdownFile( 'data/20190217--manas.hjson' );
// fileImport.importThrowdownFile( 'data/20190306--sweets-from-a-stranger.hjson' );
// fileImport.importThrowdownFile( 'data/20190325--maenyb.hjson' );
// fileImport.importThrowdownFile( 'data/20190422--squelch.hjson' );
// fileImport.importThrowdownFile( 'data/20190422--breakfast.hjson' );
// fileImport.importThrowdownFile( 'data/20190412--the-jacket.hjson' );
// fileImport.importThrowdownFile( '/data/20190325--noyu.hjson' );
// fileImport.importThrowdownFile( '/data/20190325--alex-haszard-bdmt.hjson' );
// fileImport.importThrowdownFile( 'data/20190325--kufca.hjson' );
// fileImport.importThrowdownFile( '/data/20190217--manas.hjson' );
// importThrowdownFile( '/data/20190325--noyu.hjson' );
// importThrowdownFile( '/data/20190325--alex-haszard-bdmt.hjson' );
// importThrowdownFile( 'data/20190306--sweets-from-a-stranger.hjson' );
// importThrowdownFile( 'data/20190325--maenyb.hjson' );
// importThrowdownFile( 'data/20190325--shedout.hjson' );
// importThrowdownFile( 'data/20190325--mivova.hjson' );
// fileImport.importThrowdownFile( 'data/20190325--kufca.hjson' );

const initialTempo = 124;
store.dispatch(
  transportActions.setTempo( initialTempo )
);
store.dispatch(
  transportActions.setNextTempo( initialTempo )
);

/// -----------------------------------------------------------------------------------------------
// bind sequencer/transport to store

observeStore(
  store,
  // transport component could provide this selector
  ( state ) => {
    return state.transport.isPlaying;
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
    return state.transport.tempo;
  },
  ( tempo ) => {
    throwdownApp.setTempo( tempo );
  }
);
observeStore(
  store,
  // transport component could provide this selector
  ( state ) => {
    return state.transport.nextTempo;
  },
  ( nextTempo ) => {
    throwdownApp.setNextTempo( nextTempo );
  }
);

/// -----------------------------------------------------------------------------------------------
// app component

function App() {
  return (
    <Provider store={ store }>
      <importDrop.BackgroundDropTarget />
      <table className="throwdown-container" cellSpacing="0" >
        <tbody>
          <Header />
          <HeaderPlaybackProgress backgroundColour="#ccc" progressColour="#888" />
          <Decks />
          <importDrop.GhostDeck />
        </tbody>
      </table>
    </Provider>
  );
}

render(
  ( <App /> ),
  document.getElementById( 'app' )
);
