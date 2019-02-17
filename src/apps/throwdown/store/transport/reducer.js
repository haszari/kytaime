import { createReducer } from 'redux-starter-kit';

import transportActions from './actions';

const transportReducer = createReducer( {
  tempo: 120,
  isPlaying: false
}, {
  [ transportActions.togglePlayback ]: ( state, action ) => {
    state.isPlaying = ! state.isPlaying;
  },
  [ transportActions.setTempo ]: ( state, action ) => {
    state.tempo = parseInt( action.payload );
  }
} );

export default transportReducer;