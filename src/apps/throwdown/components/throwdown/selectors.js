import _ from 'lodash';

import { createSelector } from 'redux-starter-kit';

// 'throwdown' path is hard-coded in all these AND in store.js .. how to share that?
const getThrowdown = createSelector( [ 'throwdown' ] );
const getSections = createSelector( [ 'throwdown.sections' ] );
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


export default {
  getThrowdown,
  getSections,
  getPatterns,
  getDecks,
  getDeck,
  getBuffers,
  getPhraseLoop,
  getTriggerLoop,
  getPhraseProgress,
};