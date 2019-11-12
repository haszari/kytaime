import _ from 'lodash';

import { createReducer } from 'redux-starter-kit';

import actions from './actions';

function createDeck() {
  return {
    slug: '',
    hue: Math.random() * 360,
    triggeredSection: null,
    playingSection: null,
    sections: [],
  };
}

// interesting that these are a different kind of selector
// they start at state.throwdown ..
// this tells me that I am architecting my selectors wrong??
// or not conventional to use them in reducer??

function getDeck( state, deckSlug ) {
  return _.find( state.decks,
    deck => ( deck.slug === deckSlug )
  );
}
function getSongPattern( state, songSlug, patternSlug ) {
  return _.find( state.patterns,
    pattern => ( pattern.slug === patternSlug ) && ( pattern.songSlug === songSlug )
  );
}
function getDeckSectionPart( state, deckSlug, sectionSlug, partSlug ) {
  const deck = getDeck( state, deckSlug );
  if ( ! deck ) { return; }

  const section = _.find( deck.sections, { slug: sectionSlug } );
  if ( ! section ) { return; }

  return _.find( section.parts, { part: partSlug } );
}

const throwdownReducer = createReducer( {
  audioContext: null,
  buffers: [],

  patterns: [],

  deferAllTriggers: false,

  decks: [],
}, {
  // patterns (may be used in multiple deck sections)
  [actions.addPattern]: ( state, action ) => {
    const patternData = action.payload;
    state.patterns.push( patternData );
  },

  [actions.setDeferAllTriggers]: ( state, action ) => {
    state.deferAllTriggers = action.payload;
  },
  [actions.toggleDeferAllTriggers]: ( state, action ) => {
    state.deferAllTriggers = !state.deferAllTriggers;
  },

  // decks
  [actions.addDeck]: ( state, action ) => {
    const deck = getDeck( state, action.payload.deckSlug );
    if ( deck ) return;

    const newDeck = {
      ...createDeck(),
      slug: action.payload.deckSlug,
    };

    const shuntedDeck = getDeck( state, action.payload.replaceDeckSlug );
    const insertPosition = _.findIndex( state.decks, { slug: action.payload.replaceDeckSlug } );
    if ( action.payload.replaceDeckSlug && insertPosition !== -1 ) {
      // if we're "replacing" a deck row, reorder decks so added one is in that slot
      state.decks.splice( insertPosition, 0, newDeck );
      _.remove( state.decks, shuntedDeck );
      state.decks.push( shuntedDeck );
    }
    else {
      // otherwise just add at the end of the list
      state.decks.push( newDeck );
    }
  },

  [actions.addSection]: ( state, action ) => {
    const deck = getDeck( state, action.payload.deckSlug );
    if ( ! deck ) return;

    const patternsInSection = action.payload.patterns;

    // get a list of full pattern data for the patterns in this section (i.e. filter out others)
    const sectionPatternData = _.filter( state.patterns, ( data ) => {
      const sameSong = ( data.songSlug === action.payload.deckSlug );
      const inThisSection = ( _.indexOf( patternsInSection, data.slug ) !== -1 );
      return sameSong && inThisSection;
    } );

    // get a list of the part names in this section
    const sectionPartSlugs = _.uniq( _.map( sectionPatternData, 'part' ) );

    // generate state array for patterns x parts (instruments)
    const partsPatterns = _.map( sectionPartSlugs, partSlug => {
      const patternData = _.filter( state.patterns, ( pattern, slug ) => {
        const songMatch = ( pattern.songSlug === action.payload.deckSlug );
        const partMatch = ( pattern.part === partSlug );
        const sectionMatch = _.includes( patternsInSection, pattern.slug );
        return songMatch && partMatch && sectionMatch;
      } );
      const patterns = _.map( patternData, 'slug' );
      return {
        // which instrument/part this is
        part: partSlug,
        // all the slugs for the patterns within this part - these are solo/alternatives
        patterns: patterns,
        // which pattern is triggered within this part x section
        triggeredPattern: _.head( patterns ) || '',
      };
    } );

    deck.sections.push( {
      slug: action.payload.slug,
      duration: action.payload.bars * 4,
      patterns: action.payload.patterns,
      parts: partsPatterns,
    } );
  },

  [actions.setDeckTriggeredSection]: ( state, action ) => {
    const deck = getDeck( state, action.payload.deckSlug );
    if ( ! deck ) return;

    // pass no slug to clear triggered section
    deck.triggeredSection = action.payload.sectionSlug;
  },
  [actions.toggleDeckTriggeredSection]: ( state, action ) => {
    const deck = state.decks[action.payload.deckIndex];
    if ( !deck ) return;

    const section = deck.sections[action.payload.sectionIndex];
    const sectionSlug = section ? section.slug : '';
    if ( deck.triggeredSection !== sectionSlug ) {
      deck.triggeredSection = sectionSlug;
    }
    else {
      deck.triggeredSection = null;
    }
  },

  [actions.setDeckPlayingSection]: ( state, action ) => {
    const deck = getDeck( state, action.payload.deckSlug );
    if ( !deck ) return;

    // pass no slug to clear playing section
    deck.playingSection = action.payload.sectionSlug;
  },

  [actions.setDeckPatternPlaystate]: ( state, action ) => {
    const pattern = getSongPattern(
      state,
      action.payload.songSlug,
      action.payload.patternSlug
    );
    if ( ! pattern ) return;

    pattern.isPlaying = action.payload.isPlaying;
  },

  [actions.setDeckSectionPartTriggeredPattern]: ( state, action ) => {
    const part = getDeckSectionPart(
      state,
      action.payload.deckSlug,
      action.payload.sectionSlug,
      action.payload.partSlug
    );
    if ( ! part ) return;

    part.triggeredPattern = action.payload.patternSlug;
  },

} );

export default throwdownReducer;
