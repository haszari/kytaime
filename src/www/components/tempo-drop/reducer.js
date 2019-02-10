import { createReducer } from 'redux-starter-kit';

import actions from './actions';

const transportReducer = createReducer( {
  nextTempo: 150
}, {
  [ actions.setNextTempo ]: ( state, action ) => {
    state.nextTempo = parseInt( action.payload );
  }
} );

export default transportReducer;