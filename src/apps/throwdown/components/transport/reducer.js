import { createReducer } from 'redux-starter-kit';

import actions from './actions';

const transportReducer = createReducer( {
  nextTempo: 135,
  tempo: 135,
  isPlaying: false,
  currentBeat: 0,
}, {
  [actions.setTempo]: ( state, action ) => {
    state.tempo = parseFloat( action.payload );
  },
  [actions.setNextTempo]: ( state, action ) => {
    state.nextTempo = parseFloat( action.payload );
  },
  [actions.adjustNextTempo]: ( state, action ) => {
    state.nextTempo = state.nextTempo + action.payload;
  },
  [actions.togglePlayback]: ( state, action ) => {
    state.isPlaying = !state.isPlaying;
  },
  [actions.setCurrentBeat]: ( state, action ) => {
    state.currentBeat = action.payload;
  },

} );

export default transportReducer;
