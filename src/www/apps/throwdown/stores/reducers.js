
import { combineReducers } from 'redux'

import * as actionTypes from './action-types';

import sequencer from '../throwdown-sequencer';

const transport = (state = { 
   playState: '', 
   beatNumber: 0,
   /// generalness coming sooon
   triggerAudio: true, 
   triggerMidi: false,
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

      case actionTypes.TOGGLE_ELEMENT_TRIGGER_STATE: 
         if (action.element == 'MIDI') {
            return Object.assign({}, state, {
               triggerMidi: !state.triggerMidi
            });            
         }
         if (action.element == 'Audio') {
            return Object.assign({}, state, {
               triggerAudio: !state.triggerAudio
            });            
         }


      default:
         return state;
   }
}



const app = combineReducers({
   transport,
});

export default app;