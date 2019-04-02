import _ from 'lodash'; 

import Hjson from 'hjson';

import store from '../../store/store';

import throwdownActions from '../throwdown/actions';
import throwdownSelectors from '../throwdown/selectors';

import sequencer from '@kytaime/sequencer/sequencer';
import audioUtilities from '@kytaime/audio-utilities';

function ensureAudioBuffered( audioContext, buffers, filename ) {
  if ( _.find( buffers, { file: filename } ) ) {
    return;
  }
  audioUtilities.loadSample( filename, audioContext, ( buffer ) => {
    console.log( `sample decoded, ready to play ${ filename }` );
    store.dispatch( throwdownActions.addAudioBuffer( {
      file: filename,
      buffer: buffer,
    } ) );
  } );
}

function importPatterns( songSlug, patterns ) {
  const buffers = throwdownSelectors.getBuffers( store.getState() );

  _.map( patterns, ( pattern, key ) => {
    store.dispatch( throwdownActions.addPattern( {
      songSlug, 
      slug: key, 
      ...pattern
    } ) );
    if ( pattern.file ) {
      ensureAudioBuffered( sequencer.audioContext, buffers, pattern.file );
    }
  } );  
}

function addThrowdownDeck( songSlug, throwdownData ) {
  importPatterns( songSlug, throwdownData.patterns );

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

function importThrowdownFile( deckSlug, fileUrl ) {
  window.fetch( fileUrl )
    .then( response => response.text() )
    .then( text => {
      const songData = Hjson.parse( text );
      addThrowdownDeck( deckSlug, songData );
    } );
}

function importThrowdownData( deckSlug, hjsonBlob ) {
  addThrowdownDeck( deckSlug, hjsonBlob );
}


export default { 
  importThrowdownFile,
  importThrowdownData,
};
