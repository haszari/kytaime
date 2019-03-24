import { createReducer } from 'redux-starter-kit';

import actions from './actions';

function deckDefaults() {
  return {
    hue: Math.random() * 360,
    triggeredSection: null,
    playingSection: null, 
    sections: [],
  }
}

const throwdownReducer = createReducer( {
  audioContext: null, 
  buffers: [],
  
  patterns: [],

  deferAllTriggers: false,

  // one hard-coded deck for now – will be an array of decks later
  deck: deckDefaults(),
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

  // song state
  [ actions.addPattern ]: ( state, action ) => {
    const patternData = action.payload;
    state.patterns.push( patternData );
  },
  [ actions.addSection ]: ( state, action ) => {
    const deck = state.deck;

    deck.sections.push( {
      slug: action.payload.slug,

      duration: action.payload.bars * 4,
      
      patterns: action.payload.patterns,
    } );
  },

  [ actions.setDeferAllTriggers ]: ( state, action ) => {
    state.deferAllTriggers = action.payload;
  },
  [ actions.toggleDeferAllTriggers ]: ( state, action ) => {
    state.deferAllTriggers = ! state.deferAllTriggers;
  },


  // sequencer/playback state
  [ actions.setDeckTriggeredSection ]: ( state, action ) => {
    // pass no slug to clear triggered section
    state.deck.triggeredSection = action.payload.sectionSlug;
  },
  [ actions.setDeckPlayingSection ]: ( state, action ) => {
    // pass no slug to clear triggered section
    state.deck.playingSection = action.payload.sectionSlug;
  },

} );

export default throwdownReducer;