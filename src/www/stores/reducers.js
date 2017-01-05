

import { combineReducers } from 'redux'

import { TRANSPORT_CURRENT_BEAT, TRANSPORT_PLAYSTATE } from './action-types';


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

const kytaimeApp = combineReducers({
   transport
});

export default kytaimeApp;