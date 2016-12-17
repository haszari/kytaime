

import { combineReducers } from 'redux'

import { TRANSPORT_CURRENT_BEAT } from './action-types';


function transportCurrentBeat(state = 0, action) {
   switch (action.type) {
      case TRANSPORT_CURRENT_BEAT: 
         return action.beatNumber
      default:
         return state;
   }
} 

const kytaimeApp = combineReducers({
   transportCurrentBeat
});

export default kytaimeApp;