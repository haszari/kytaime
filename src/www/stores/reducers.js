

import { combineReducers } from 'redux'

import { TRANSPORT_CURRENT_BEAT, TRANSPORT_PLAYSTATE, ADD_PATTERN, TOGGLE_PATTERN } from './action-types';


const transport = (state = { playState: '', beatNumber: 0 }, action) => {
   switch (action.type) {
      case TRANSPORT_PLAYSTATE: 
         return Object.assign({}, state, {
            playState: action.playState
         });
      case TRANSPORT_CURRENT_BEAT: 
         return Object.assign({}, state, {
            beatNumber: action.beatNumber
         });
      default:
         return state;
   }
}


const pattern = (state = {}, action) => {
  switch (action.type) {
    case ADD_PATTERN:
      return {
        id: action.id, 
        playState: 'idle'
      }
    case TOGGLE_PATTERN:
      if (state.id !== action.id) {
        return state;
      }

      return Object.assign({}, state, {
        triggered: !state.triggered
      });

    default:
      return state
  }
}

const patterns = (state = [], action) => {
   switch (action.type) {
      case ADD_PATTERN:
         return [
            ...state,
            pattern(undefined, action)
         ];
      default:
         return state;
   }
}

const kytaimeApp = combineReducers({
   transport,
   patterns
});

export default kytaimeApp;