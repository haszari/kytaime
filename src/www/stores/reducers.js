

import { combineReducers } from 'redux'

import * as actionTypes from './action-types';


const userinterface = (state = { editMode: false }, action) => {
   switch (action.type) {
      case actionTypes.UI_TOGGLE_EDITMODE: 
         return Object.assign({}, state, {
            editMode: !state.editMode
         });
      default:
         return state;
   }
}


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
            channel: action.channel,  
            notes: action.notes || [],
            duration: action.duration || 4,
            startBeats: action.startBeats || [ 0 ],
            endBeats: action.endBeats || [ 0 ],
            triggered: true,
            playing: false
         }

      case actionTypes.TOGGLE_PATTERN_TRIGGER:
         if (state.id !== action.id) {
           return state;
         }

         return Object.assign({}, state, {
           triggered: !state.triggered
         });

      case actionTypes.PATTERN_PLAYSTATE:
         if (state.id !== action.id) {
           return state;
         }

         return Object.assign({}, state, {
           playing: action.playing
         });

      default:
         return state;
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
      case actionTypes.PATTERN_PLAYSTATE:
         return state.map(p => {
            return pattern(p, action);
         });

      case actionTypes.REMOVE_PATTERN:
         return state.filter(pattern => pattern.id !== action.id);

      default:
         return state;
   }
}

const kytaimeApp = combineReducers({
   userinterface,
   transport,
   patterns
});

export default kytaimeApp;