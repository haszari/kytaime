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

function getUniqueImportSlug( slug, filename ) {
  // ahem, need wurd() lib!
  var uniqueSlug = slug || filename || 'new_' + Math.round( Math.random() * 99999 ) + '_guy';

  // you're not leaving until you're unique
  const decks = throwdownSelectors.getDecks( store.getState() );
  while ( _.includes( _.map( decks, 'slug' ), uniqueSlug ) ) {
    uniqueSlug += Math.round( Math.random() * 99 )
  }

  return uniqueSlug;
}

function addThrowdownDeck( filename, throwdownData ) {
  const songSlug = getUniqueImportSlug( throwdownData.slug, filename );

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
}

function importThrowdownFile( fileUrl ) {
  window.fetch( fileUrl )
    .then( response => response.text() )
    .then( text => {
      const songData = Hjson.parse( text );
      addThrowdownDeck( fileUrl, songData );
    } );
}

function importThrowdownData( filename, hjsonBlob ) {
  addThrowdownDeck( filename, hjsonBlob );
}


export default { 
  importThrowdownFile,
  importThrowdownData,
};
