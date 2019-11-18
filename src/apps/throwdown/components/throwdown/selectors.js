import _ from 'lodash';

import { createSelector } from 'redux-starter-kit';

const getThrowdown = ( state ) => { return _.get( state, 'throwdown' ); };

const getPatterns = ( state ) => { return _.get( state, 'throwdown.patterns' ); };

const getDecks = ( state ) => { return _.get( state, 'throwdown.decks' ); };

const getTransport = ( state ) => { return _.get( state, 'transport' ); };

function getPattern( state, patternSlug ) {
  return _.find( state.patterns,
    pattern => ( pattern.slug === patternSlug )
  );
}

// this could be a user option/runtime param
const MIN_PHRASE_LENGTH = 4;

function getPhraseLoopFromPatterns( patterns ) {
  return _.reduce( patterns, ( phrase, patternData ) => {
    return Math.max( phrase, patternData.duration );
  }, MIN_PHRASE_LENGTH );
}

// this is the same for section | deck | global right now
// in future they will be different
function getPhraseLoop( state ) {
  const decks = getDecks( state );
  const relevantDecks = _.filter( decks, deck => {
    return ( deck.playingSection || deck.triggeredSection );
  } );
  const relevantPhraseLoop = _.map( relevantDecks, deck => {
    return getDeckPhraseLoop( state, deck.slug );
  } );
  return _.reduce( relevantPhraseLoop, ( phrase, deckPhrase ) => {
    return Math.max( phrase, deckPhrase );
  }, MIN_PHRASE_LENGTH );
}

const getTriggerLoop = createSelector(
  [ getThrowdown, getPhraseLoop ],
  ( throwdown, phraseLoop ) => ( throwdown.deferAllTriggers ? Infinity : phraseLoop )
);

const getPhraseProgress = createSelector(
  [ getPhraseLoop, getTransport ],
  ( phraseLoop, transport ) => {
    return ( transport.currentBeat % phraseLoop ) / phraseLoop;
  }
);

function getDeck( state, deckSlug ) {
  return _.find( getDecks( state ),
    deck => ( deck.slug === deckSlug )
  );
}

function getDeckSections( state, deckSlug ) {
  const deckState = getDeck( state, deckSlug );
  if ( !deckState ) { return; }

  return deckState.sections;
}

function getDeckSection( state, deckSlug, sectionSlug ) {
  const deckState = getDeck( state, deckSlug );
  if ( !deckState ) { return; }

  return _.find( deckState.sections,
    section => ( section.slug === sectionSlug )
  );
}

function getDeckSectionPatterns( state, deckSlug, sectionSlug ) {
  const allPatterns = getPatterns( state );
  const section = getDeckSection( state, deckSlug, sectionSlug );
  if ( !section ) { return; }

  const patterns = section.patterns.map(
    patternSlug => _.find( allPatterns, { songSlug: deckSlug, slug: patternSlug } )
  );
  return _.filter( patterns ); // filter out undefined patterns, e.g. slug not present
}

function getAllDeckPatterns( state, deckSlug ) {
  const allPatterns = getPatterns( state );
  const deckState = getDeck( state, deckSlug );
  if ( ! deckState ) { return; }

  const sectionPatterns = deckState.sections.map( section => {
    var patterns = section.patterns.map(
      patternSlug => _.find( allPatterns, {
        slug: patternSlug,
        songSlug: section.songSlug,
      } )
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
  [ getDeckPhraseLoop, getTransport ],
  ( phraseLoop, transport ) => {
    return ( transport.currentBeat % phraseLoop ) / phraseLoop;
  }
);

export default {
  getThrowdown,
  getPatterns,
  getPattern,

  getDecks,
  getDeck,
  getDeckPhraseLoop,
  getDeckPhraseProgress,
  getDeckSections,
  getDeckSection,
  getDeckSectionPatterns,
  getAllDeckPatterns,

  getPhraseLoop,
  getTriggerLoop,
  getPhraseProgress,
};
