import { createReducer } from 'redux-starter-kit';

import transportActions from './actions';

const transportReducer = createReducer( {
  tempo: 88
}, {
  [ transportActions.setTempo ]: ( state, action ) => {
    state.tempo = parseInt( action.payload );
  }
} );

export default transportReducer;