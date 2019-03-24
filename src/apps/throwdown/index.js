import _ from 'lodash'; 

import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

import Hjson from 'hjson';

import store from './store/store';
import observeStore from '@lib/observe-redux-store';

import ThrowdownApp from './throwdown-app';

import Header from './components/transport-header/header.jsx';
import PlaybackProgress from './components/playback-progress/playback-progress.jsx';
import DeckSectionsTriggers from './components/throwdown/deck-sections-triggers.jsx';


import throwdownActions from './components/throwdown/actions';

import './style/style.scss';

/// -----------------------------------------------------------------------------------------------
// app audio engine / service

const throwdownApp = new ThrowdownApp();


/// -----------------------------------------------------------------------------------------------
// load hard-coded test data

const testSongFile = '/data/20190217--manas.hjson';
// const testSongFile = 'data/20190306--sweets-from-a-stranger.hjson';
// const testSongFile = 'data/20190306--its-not-real.hjson';

function importThrowdownData( throwdownData ) {
  throwdownApp.importPatterns( throwdownData.patterns );
  
  _.map( throwdownData.sections, ( section, key ) => {
    store.dispatch( throwdownActions.addSection( {
      slug: key, 
      ...section
    } ) );
  } );

  const sectionSlugs = _.keys( throwdownData.sections );
  store.dispatch( throwdownActions.setDeckTriggeredSection( {
      sectionSlug: _.sample( sectionSlugs )
    } ) );
}

window.fetch( testSongFile )
  .then( response => response.text() )
  .then( text => {
    const songData = Hjson.parse( text );
    importThrowdownData( songData );
  } );

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
          <PlaybackProgress />
          <DeckSectionsTriggers />
        </tbody>
      </table>
    </Provider>
  );
}

render(
  ( <App /> ), 
  document.getElementById('app')
);

