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
  }
}

function getDeck( state, deckSlug ) {
  return _.find( state.decks, 
    deck => ( deck.slug === deckSlug )
  );
}

const throwdownReducer = createReducer( {
  audioContext: null, 
  buffers: [],
  
  patterns: [],

  deferAllTriggers: false,

  decks: []
}, {
  [ actions.setAudioContext ]: ( state, action ) => {
    state.audioContext = action.payload;
  },
  [ actions.addAudioBuffer ]: ( state, action ) => {
    state.buffers.push( {
      file: action.payload.file,
      buffer: action.payload.buffer,
    } );
  },

  // patterns (may be used in multiple deck sections)
  [ actions.addPattern ]: ( state, action ) => {
    const patternData = action.payload;
    state.patterns.push( patternData );
  },

  [ actions.setDeferAllTriggers ]: ( state, action ) => {
    state.deferAllTriggers = action.payload;
  },
  [ actions.toggleDeferAllTriggers ]: ( state, action ) => {
    state.deferAllTriggers = ! state.deferAllTriggers;
  },

  // decks
  [ actions.addDeck ]: ( state, action ) => {
    const deck = getDeck( state, action.payload.deckSlug );
    if ( deck ) return;

    const newDeck = {
      ...createDeck(),
      slug: action.payload.deckSlug,
    };

    if ( action.payload.replaceDeckSlug ) {
      // if we're "replacing" a deck row, reorder decks so added one is in that slot
      // and the replaced deck is shunted to the bottom
      const shuntedDeck = getDeck( state, action.payload.replaceDeckSlug );
      _.remove( state.decks, shuntedDeck );
      state.decks.push( shuntedDeck );
      state.decks.unshift( newDeck );
    }
    else {
      // otherwise just add at the end of the list
      state.decks.push( newDeck );
    }
  },

  [ actions.addSection ]: ( state, action ) => {
    const deck = getDeck( state, action.payload.deckSlug );
    if ( ! deck ) return;

    deck.sections.push( {
      slug: action.payload.slug,

      duration: action.payload.bars * 4,
      
      patterns: action.payload.patterns,
    } );
  },

  [ actions.setDeckTriggeredSection ]: ( state, action ) => {
    const deck = getDeck( state, action.payload.deckSlug );
    if ( ! deck ) return;

    // pass no slug to clear triggered section
    deck.triggeredSection = action.payload.sectionSlug;
  },
  [ actions.toggleDeckTriggeredSection ]: ( state, action ) => {
    const deck = state.decks[ action.payload.deckIndex ];
    if ( ! deck ) return;

    const section = deck.sections[ action.payload.sectionIndex ];
    const sectionSlug = section ? section.slug : '';
    if (deck.triggeredSection !== sectionSlug) {
      deck.triggeredSection = sectionSlug;
    }
    else {
      deck.triggeredSection = null;
    }
  },

  [ actions.setDeckPlayingSection ]: ( state, action ) => {
    const deck = getDeck( state, action.payload.deckSlug );
    if ( ! deck ) return;

    // pass no slug to clear playing section
    deck.playingSection = action.payload.sectionSlug;
  },


} );

export default throwdownReducer;