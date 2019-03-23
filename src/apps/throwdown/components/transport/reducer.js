import { createReducer } from 'redux-starter-kit';

import actions from './actions';

const transportReducer = createReducer( {
  nextTempo: 150,
  tempo: 120,
  isPlaying: false,
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
} );

export default transportReducer;
