

import { combineReducers } from 'redux'

import { TRANSPORT_CURRENT_BEAT, TRANSPORT_READY_TO_PLAY } from './action-types';


function transportReadyToPlay(state = false, action) {
   switch (action.type) {
      case TRANSPORT_READY_TO_PLAY: 
         return action.readyToPlay
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
   transportReadyToPlay,
   transportCurrentBeat
});

export default kytaimeApp;