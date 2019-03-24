import _ from 'lodash'; 

import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

import Hjson from 'hjson';

import store from './store/store';
import observeStore from '@lib/observe-redux-store';

import ThrowdownApp from './throwdown-app';

import Header from './components/transport-header/header.jsx';
import HeaderPlaybackProgress from './components/playback-progress/header-progress.jsx';
import Decks from './components/throwdown/decks.jsx';


import throwdownActions from './components/throwdown/actions';

import './style/style.scss';

/// -----------------------------------------------------------------------------------------------
// app audio engine / service

const throwdownApp = new ThrowdownApp();


/// -----------------------------------------------------------------------------------------------
// load hard-coded test data

function addThrowdownDeck( songSlug, throwdownData ) {
  throwdownApp.importPatterns( songSlug, throwdownData.patterns );

  store.dispatch( throwdownActions.addDeck( {
    deckSlug: songSlug,
  } ) ); 
  
  _.map( throwdownData.sections, ( section, key ) => {
    store.dispatch( throwdownActions.addSection( {
      deckSlug: songSlug,
      slug: key, 
      ...section
    } ) );
  } );

  // trigger a random section
  // const sectionSlugs = _.keys( throwdownData.sections );
  // store.dispatch( throwdownActions.setDeckTriggeredSection( {
  //   deckSlug: songSlug,
  //   sectionSlug: _.sample( sectionSlugs )
  // } ) );

  // hard code build for testing
  // store.dispatch( throwdownActions.setDeckTriggeredSection( {
  //   deckSlug: 'test',
  //   sectionSlug: 'build',
  // } ) );
}

// const testSongFile = '/data/20190217--manas.hjson';
// const testSongFile = 'data/20190306--sweets-from-a-stranger.hjson';
// const testSongFile = 'data/20190306--its-not-real.hjson';

function importThrowdownFile( deckSlug, file ) {
  window.fetch( file )
    .then( response => response.text() )
    .then( text => {
      const songData = Hjson.parse( text );
      addThrowdownDeck( deckSlug, songData );
    } );
}

importThrowdownFile( 'manas', '/data/20190217--manas.hjson' );
importThrowdownFile( 'noyu', '/data/20190325--noyu.hjson' );
importThrowdownFile( 'axbdmt', '/data/20190325--alex-haszard-bdmt.hjson' );
importThrowdownFile( 'sweets', 'data/20190306--sweets-from-a-stranger.hjson' );
// importThrowdownFile( 'itsnotreal', 'data/20190306--its-not-real.hjson' );

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

