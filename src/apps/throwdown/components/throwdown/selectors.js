import _ from 'lodash';

import { createSelector } from 'redux-starter-kit';

// 'throwdown' path is hard-coded in all these AND in store.js .. how to share that?
const getThrowdown = createSelector( [ 'throwdown' ] );

const getPatterns = createSelector( [ 'throwdown.patterns' ] );
const getBuffers = createSelector( [ 'throwdown.buffers' ] );

const getDecks = createSelector( [ 'throwdown.decks' ] );

// this could be a user option/runtime param
const MIN_PHRASE_LENGTH = 4;

function getPhraseLoopFromPatterns( patterns ) {
  return _.reduce( patterns, ( phrase, patternData ) => {
    return Math.max( phrase, patternData.duration );
  }, MIN_PHRASE_LENGTH );
}

// this is the same for section | deck | global right now
// in future they will be different
// and it includes ALL patterns, not just those that are triggered/playing
const getPhraseLoop = createSelector( 
  [ 'throwdown.patterns' ],
  getPhraseLoopFromPatterns,
);


const getTriggerLoop = createSelector( 
  [ 'throwdown.deferAllTriggers', getPhraseLoop ],
  ( deferAllTriggers, phraseLoop ) => ( deferAllTriggers ? Infinity : phraseLoop ),
);

const getPhraseProgress = createSelector( 
  [ getPhraseLoop, 'transport.currentBeat' ],
  ( phraseLoop, currentBeat ) => {
    return ( currentBeat % phraseLoop ) / phraseLoop;
  },
);

function getDeck( state, deckSlug ) {
  return _.find( getDecks( state ), 
    deck => ( deck.slug === deckSlug )
  );
}

function getDeckSection( state, deckSlug, sectionSlug ) {
  const deckState = getDeck( state, deckSlug );
  if ( ! deckState ) 
    return;

  return _.find( deckState.sections, 
    section => ( section.slug === sectionSlug )
  );
}

function getDeckSectionPatterns( state, deckSlug, sectionSlug ) {
  const allPatterns = getPatterns( state );
  const section = getDeckSection( state, deckSlug, sectionSlug );
  if ( ! section ) 
    return;

  const patterns = section.patterns.map(
    patternSlug => _.find( allPatterns, { songSlug: deckSlug, slug: patternSlug } )
  );
  return _.filter( patterns ); // filter out undefined patterns, e.g. slug not present
}

function getAllDeckPatterns( state, deckSlug ) {
  const allPatterns = getPatterns( state );
  const deckState = getDeck( state, deckSlug );
  if ( ! deckState ) 
    return;

  const sectionPatterns = deckState.sections.map( section => {
    var patterns = section.patterns.map( 
      patternSlug => _.find( allPatterns, { slug: patternSlug } )
    );
    return _.filter( patterns ); // filter out undefined patterns, e.g. slug not present
  } );

  return _.flatten( sectionPatterns );
}

function getDeckPhraseLoop( state, deckSlug ) {
  const patterns = getAllDeckPatterns( state, deckSlug );
  return getPhraseLoopFromPatterns( patterns );
}

const getDeckPhraseProgress = createSelector( 
  [ getDeckPhraseLoop, 'transport.currentBeat' ],
  ( phraseLoop, currentBeat ) => {
    return ( currentBeat % phraseLoop ) / phraseLoop;
  },
);

export default {
  getBuffers,
  
  getThrowdown,
  getPatterns,

  getDecks,
  getDeck,
  getDeckPhraseLoop,
  getDeckPhraseProgress,
  getDeckSection,
  getDeckSectionPatterns,
  getAllDeckPatterns,
  
  getPhraseLoop,
  getTriggerLoop,
  getPhraseProgress,
};