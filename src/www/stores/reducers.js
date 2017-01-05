

import { combineReducers } from 'redux'

import { TRANSPORT_CURRENT_BEAT, TRANSPORT_PLAYSTATE } from './action-types';


function transportPlayState(state = false, action) {
   switch (action.type) {
      case TRANSPORT_PLAYSTATE: 
         return action.playState
      default:
         return state;
   }
} 

function transportCurrentBeat(state = 0, action) {
   switch (action.type) {
      case TRANSPORT_CURRENT_BEAT: 
         return action.beatNumber
      default:
         return state;
   }
} 

const kytaimeApp = combineReducers({
   // durr looks like these need to be in a subobject transport: { canPlay, currentBeat }
   transportPlayState,
   transportCurrentBeat
});

export default kytaimeApp;