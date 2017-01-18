
import { combineReducers } from 'redux'

import * as actionTypes from './action-types';

const patternrow = (state = {}, action) => {
   switch (action.type) {
      case actionTypes.PATTERNGRID_SET_ROW_MIDICHANNEL:
         return Object.assign({}, state, {
           midiChannel: action.midiChannel
         });
      case actionTypes.ADD_PATTERN:
         return Object.assign({}, state, {
           patterns: state.patterns.concat(action.id)
         });
      case actionTypes.REMOVE_PATTERN:
         return Object.assign({}, state, {
           patterns: state.patterns.filter((patternId) => (patternId != action.id))
         });
      default:
         return state;
   }
}

const makepatternrows = (count) => {
   return Array(count).fill({
      midiChannel: 1,
      patterns: [] // array of pattern IDs
   });
}

const patterngrid = (state = [], action) => {
   switch (action.type) {
      case actionTypes.IMPORT_REHYDRATE:
         return action.state.patterngrid;

      case actionTypes.PATTERNGRID_SET_NUM_ROWS:
         if (state.length > action.numRows)
            return state.slice(0, action.numRows);
         else 
            return [
               ...state,
               ...makepatternrows(action.numRows - state.length)
            ];
      case actionTypes.PATTERNGRID_SET_ROW_MIDICHANNEL:
      case actionTypes.ADD_PATTERN:
      case actionTypes.REMOVE_PATTERN:
         state = [
            ...state.slice(0, action.rowIndex),
            patternrow(state[action.rowIndex], action),
            ...state.slice(action.rowIndex + 1)
         ]
      default:
         return state;
   }
}


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
      case actionTypes.IMPORT_REHYDRATE:
         return action.state.patterns;

         // this is bad, because it introduces data in this reducer
         // the others don't have access to it
         // (i.e. patterngrid)
         // return _.map(action.state.patterns, (pattern) => {
         //    if (!pattern.id) 
         //       pattern.id = shortid.generate();
         //    return pattern;
         // });

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
   patterngrid,
   transport,
   patterns
});

export default kytaimeApp;