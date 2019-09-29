import _ from 'lodash'; 

import Hjson from 'hjson';

import store from '../../store/store';

import throwdownActions from '../throwdown/actions';
import throwdownSelectors from '../throwdown/selectors';

import audioUtilities from '@kytaime/audio-utilities';
import audioState from '@kytaime/audio-state';

function ensureAudioBuffered( filename ) {
  if ( audioState.getAudioBuffer( filename ) ) {
    return;
  }
  audioUtilities.loadSample( filename, audioState.getAudioContext(), ( buffer ) => {
    console.log( `sample decoded, ready to play ${ filename }` );
    audioState.addAudioBuffer( filename, buffer );
  } );
}

function importPatterns( songSlug, patterns ) {
  _.map( patterns, ( pattern, key ) => {
    store.dispatch( throwdownActions.addPattern( {
      songSlug, 
      slug: key, 
      ...pattern
    } ) );
    if ( pattern.file ) {
      ensureAudioBuffered( pattern.file );
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

function addThrowdownDeck( filename, throwdownData, replaceDeckRowSlug ) {
  const songSlug = getUniqueImportSlug( throwdownData.slug, filename );

  importPatterns( songSlug, throwdownData.patterns );

  store.dispatch( throwdownActions.addDeck( {
    deckSlug: songSlug,
    replaceDeckSlug: replaceDeckRowSlug
  } ) ); 
  
  _.map( throwdownData.sections, ( section, key ) => {
    store.dispatch( throwdownActions.addSection( {
      deckSlug: songSlug,
      slug: key, 
      ...section
    } ) );
  } );

  return songSlug;
}

function importThrowdownFile( fileUrl ) {
  window.fetch( fileUrl )
    .then( response => response.text() )
    .then( text => {
      const songData = Hjson.parse( text );
      addThrowdownDeck( fileUrl, songData );
    } );
}

function importThrowdownData( filename, hjsonBlob, replaceDeckRowSlug ) {
  addThrowdownDeck( filename, hjsonBlob, replaceDeckRowSlug );
}

export default { 
  importThrowdownFile,
  importThrowdownData,
};
