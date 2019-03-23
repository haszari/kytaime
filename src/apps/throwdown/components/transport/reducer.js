import { createReducer } from 'redux-starter-kit';

import actions from './actions';

const transportReducer = createReducer( {
  nextTempo: 135,
  tempo: 135,
  isPlaying: false,
  currentBeat: 0,
}, {
  [ actions.setTempo ]: ( state, action ) => {
    state.tempo = parseInt( action.payload );
  },
  [ actions.setNextTempo ]: ( state, action ) => {
    state.nextTempo = parseInt( action.payload );
  },
  [ actions.togglePlayback ]: ( state, action ) => {
    state.isPlaying = ! state.isPlaying;
  },
  [ actions.setCurrentBeat ]: ( state, action ) => {
    state.currentBeat= action.payload;
  },

} );

export default transportReducer;
