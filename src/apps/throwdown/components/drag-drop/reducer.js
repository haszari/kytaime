import { createReducer } from 'redux-starter-kit';

import actions from './actions';

const fileImportReducer = createReducer( {
  dropHighlightDeck: '', 
  dropHighlightAddNew: false,
}, {
  [ actions.setDropHighlight ]: ( state, action ) => {
    if ( action.payload && action.payload.dropHighlightDeck ) {
      state.dropHighlightDeck = action.payload.dropHighlightDeck;
      state.dropHighlightAddNew = false;
    }
    else if ( action.payload && action.payload.dropHighlightAddNew ) {
      state.dropHighlightDeck = '';
      state.dropHighlightAddNew = true;
    }
    else {
      state.dropHighlightDeck = '';
      state.dropHighlightAddNew = false; 
    }
  },
} );

export default fileImportReducer;