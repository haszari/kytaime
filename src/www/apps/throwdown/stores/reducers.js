
import { combineReducers } from 'redux'

import * as actionTypes from './action-types';

import sequencer from '../throwdown-sequencer';

const transport = (state = { 
   playState: '', 
   beatNumber: 0 
}, action) => {
   switch (action.type) {
      case actionTypes.TRANSPORT_TOGGLE_PLAY:
         var playState = ( state.playState === "playing" );
         if (!playState) {
            sequencer.start();
            playState = "playing";
         }
         else {
            sequencer.stop();
            playState = "stopped";
         }
         return Object.assign({}, state, {
            playState: playState
         });

      case actionTypes.TRANSPORT_PLAYSTATE: 
         let beatNumber = (action.playState == "stopped") ? 0 : state.beatNumber;
         return Object.assign({}, state, {
            playState: action.playState,
            beatNumber: beatNumber
         });
      case actionTypes.TRANSPORT_CURRENT_BEAT: 
         return Object.assign({}, state, {
            beatNumber: action.beatNumber
         });

      default:
         return state;
   }
}



const app = combineReducers({
   transport,
});

export default app;