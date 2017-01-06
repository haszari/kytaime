

import { combineReducers } from 'redux'

import * as actionTypes from './action-types';


const transport = (state = { playState: '', beatNumber: 0 }, action) => {
   switch (action.type) {
      case actionTypes.TRANSPORT_PLAYSTATE: 
         return Object.assign({}, state, {
            playState: action.playState
         });
      case actionTypes.TRANSPORT_CURRENT_BEAT: 
         return Object.assign({}, state, {
            beatNumber: action.beatNumber
         });
      default:
         return state;
   }
}


const pattern = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.ADD_PATTERN:
      return {
        id: action.id, 
        triggered: false
      }
    case actionTypes.TOGGLE_PATTERN_TRIGGER:
      if (state.id !== action.id) {
        return state;
      }

      let newState = Object.assign({}, state, {
        triggered: !state.triggered
      });
      return newState;

    default:
      return state
  }
}

const patterns = (state = [], action) => {
   switch (action.type) {
      case actionTypes.ADD_PATTERN:
         return [
            ...state,
            pattern(undefined, action)
         ];
      case actionTypes.TOGGLE_PATTERN_TRIGGER:
         return state.map(p => {
            return pattern(p, action);
         });
      default:
         return state;
   }
}

const kytaimeApp = combineReducers({
   transport,
   patterns
});

export default kytaimeApp;