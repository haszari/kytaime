import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

import store from './store/store';
import observeStore from '@lib/observe-redux-store';

import ThrowdownApp from './throwdown-app';

import Header from './components/transport-header/header.jsx';
import HeaderPlaybackProgress from './components/playback-progress/header-progress.jsx';
import Decks from './components/throwdown/decks.jsx';

import transportActions from './components/transport/actions';
import throwdownActions from './components/throwdown/actions';

// import fileImport from './components/drag-drop/file-import';
import importDrop from './components/drag-drop/ghost-deck.jsx';

import './style/style.scss';

/// -----------------------------------------------------------------------------------------------
// app audio engine / service

const throwdownApp = new ThrowdownApp();

/// -----------------------------------------------------------------------------------------------
// set up hard-coded decks and output routing

const routingConfig = {
  numAudioChannels: 2, // perc | music
  numMidiChannels: 3, // drums | bass | chords
};

routingConfig.midiPartMap = {
  // percussion of any kind
  drums: 0,
  beat: 0,
  kick: 0,
  hat: 0,
  snare: 0,
  clap: 0,
  perc: 0,

  // sub bass
  bass: 1,
  sub: 1,

  // synth chords pad lead whatever
  chords: 2,

  pad: 2,

  lead: 2,
  synth: 2,
  melody: 2,
  stab: 2,
  arp: 2,
  arpeggio: 2,

  // vocal sample texture other misc
  vocal: 2,
  voc: 2,
  sample: 2,
  texture: 2,
  fx: 2,
};
routingConfig.audioPartMap = {
  // percussion of any kind
  drums: 0,
  beat: 0,
  kick: 0,
  hat: 0,
  snare: 0,
  clap: 0,
  perc: 0,

  // sub bass
  bass: 1,
  sub: 1,

  // synth chords pad lead whatever
  chords: 1,

  pad: 1,

  lead: 1,
  synth: 1,
  melody: 1,
  stab: 1,
  arp: 1,
  arpeggio: 1,

  // vocal sample texture other misc
  vocal: 1,
  voc: 1,
  sample: 1,
  texture: 1,
  fx: 1,
};

var deckIndex = 0;

store.dispatch( throwdownActions.addDeck( {
  deckSlug: 'top',
  routing: {
    firstAudioChannel: routingConfig.numAudioChannels * deckIndex, // aka 0
    firstMidiChannel: routingConfig.numMidiChannels * deckIndex, // aka 0
    ...routingConfig,
  },
} ) );
store.dispatch( throwdownActions.addDeck( {
  deckSlug: 'bottom',
  routing: {
    firstAudioChannel: routingConfig.numAudioChannels * deckIndex, // aka 0
    firstMidiChannel: routingConfig.numMidiChannels * deckIndex, // aka 0
    ...routingConfig,
  },
} ) );
deckIndex++;

/// -----------------------------------------------------------------------------------------------
// load hard-coded test data

// fileImport.importThrowdownFileToDeck( 'data/edits/20200106--tesko-suicide-pak-n-save.hjson', 'paknsave' );
// fileImport.importThrowdownFileToDeck( 'data/20190217--manas.hjson', 'paknsave' );

// fileImport.importThrowdownFileToDeck( 'data/20191125--janura-crossing.hjson', 'A1' );
// fileImport.importThrowdownFileToDeck( 'data/20190325--noyu.hjson', 'A1' );
// fileImport.importThrowdownFileToDeck( 'data/20190325--maenyb.hjson', 'A1' );
// fileImport.importThrowdownFileToDeck( 'data/20190217--manas.hjson', 'A1' );
// fileImport.importThrowdownFileToDeck( 'data/20190325--mivova.hjson', 'A1' );
// fileImport.importThrowdownFileToDeck( 'data/20191116--jacket.hjson', 'A1' );
// fileImport.importThrowdownFileToDeck( 'data/20190325--kufca.hjson', 'A1' );
// fileImport.importThrowdownFileToDeck( 'data/20190306--sweets-from-a-stranger.hjson', 'A1' );

// fileImport.importThrowdownFileToDeck( 'data/20190325--shedout.hjson', 'B2' );
// fileImport.importThrowdownFileToDeck( 'data/20190325--noyu.hjson', 'B2' );
// fileImport.importThrowdownFileToDeck( 'data/20190325--maenyb.hjson', 'B2' );
// fileImport.importThrowdownFileToDeck( 'data/20190217--manas.hjson', 'B2' );
// fileImport.importThrowdownFileToDeck( 'data/20190325--mivova.hjson', 'B2' );
// fileImport.importThrowdownFileToDeck( 'data/20191116--jacket.hjson', 'B2' );
// fileImport.importThrowdownFileToDeck( 'data/20190325--kufca.hjson', 'B2' );
// fileImport.importThrowdownFileToDeck( 'data/20190306--sweets-from-a-stranger.hjson', 'B2' );

// fileImport.importThrowdownFile( 'data/20190422--likeso.hjson' );
// fileImport.importThrowdownFile( 'data/nook-cranny/20190325--ambients.hjson' );
// fileImport.importThrowdownFile( 'data/nook-cranny/20190325--beats.hjson' );
// fileImport.importThrowdownFile( 'data/nook-cranny/20190325--transitions.hjson' );
// fileImport.importThrowdownFile( 'data/20190422--squelch.hjson' );
// fileImport.importThrowdownFile( 'data/20190422--breakfast.hjson' );
// fileImport.importThrowdownFile( 'data/20190325--alex-haszard-bdmt.hjson' );

const initialTempo = 135;
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
