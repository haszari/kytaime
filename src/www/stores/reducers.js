
import { combineReducers } from 'redux'

import * as actionTypes from './action-types';

const patternCell = (state = {}, action) => {
   switch (action.type) {

      case actionTypes.TOGGLE_CELL_TRIGGER:
         let s = Object.assign({}, state, {
           triggered: !state.triggered
         });
         return s;
         // return Object.assign({}, state, {
         //   triggered: !state.triggered
         // });

      case actionTypes.SET_CELL_PLAYSTATE:
         return Object.assign({}, state, {
           playing: action.playing
         });

      default:
         return state;
   }
}

const patternrow = (state = {}, action) => {
   switch (action.type) {
      case actionTypes.PATTERNGRID_SET_ROW_MIDICHANNEL:
         return Object.assign({}, state, {
           midiChannel: action.midiChannel
         });

      case actionTypes.ADD_PATTERN:
         return Object.assign({}, state, {
            patternCells: state.patternCells.concat({
               patternId: action.patternId,
               triggered: false,
               playing: false
            })
         });

      case actionTypes.REMOVE_PATTERN:
         return Object.assign({}, state, {
            patternCells: state.patternCells.filter(
               (patternCell) => (patternCell.patternId != action.patternId)
            )
         });

      case actionTypes.TOGGLE_CELL_TRIGGER:
      case actionTypes.SET_CELL_PLAYSTATE:
         let s =  Object.assign({}, state, {
            patternCells: state.patternCells.map((cell, index) => {
               if (index == action.cellIndex)
                  return patternCell(cell, action);
               return cell;
            })
         });
         return s;

      default:
         return state;
   }
}

const makepatternrows = (count) => {
   return Array(count).fill({
      midiChannel: 1,
      patternCells: []
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
      case actionTypes.TOGGLE_CELL_TRIGGER:
      case actionTypes.SET_CELL_PLAYSTATE:
         return [
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


const transport = (state = { 
   playState: '', 
   beatNumber: 0 
}, action) => {
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
            id: action.patternId,
            notes: action.notes || [],
            duration: action.duration || 4,
            startBeats: action.startBeats || [ 0 ],
            endBeats: action.endBeats || [ 0 ],
            name: '',
            // triggered: true,
            // playing: false
         }

      // case actionTypes.TOGGLE_PATTERN_TRIGGER:
      //    if (state.id !== action.id) {
      //      return state;
      //    }

      //    return Object.assign({}, state, {
      //      triggered: !state.triggered
      //    });

      // case actionTypes.PATTERN_PLAYSTATE:
      //    if (state.id !== action.id) {
      //      return state;
      //    }

      //    return Object.assign({}, state, {
      //      playing: action.playing
      //    });

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

      // case actionTypes.TOGGLE_PATTERN_TRIGGER:
      // case actionTypes.PATTERN_PLAYSTATE:
      //    return state.map(p => {
      //       return pattern(p, action);
      //    });

      case actionTypes.REMOVE_PATTERN:
         return state.filter(pattern => pattern.id !== action.patternId);

      default:
         return state;
   }
}

const project = (state = { 
   tempo: 123,
   name: '', 
   tag: '' 
}, action) => {
   switch (action.type) {
      case actionTypes.IMPORT_REHYDRATE:
         return Object.assign({}, state, action.state.project);

      case actionTypes.SET_PROJECT_TEMPO:
         return Object.assign({}, state, {
            tempo: action.tempo
         });
      case actionTypes.SET_PROJECT_NAME: 
         return Object.assign({}, state, {
            name: action.name
         });
      case actionTypes.SET_PROJECT_TAG: 
         return Object.assign({}, state, {
            tag: action.tag
         });

      default:
         return state;
   }
}


const kytaimeApp = combineReducers({
   // not persisted
   userinterface,
   transport,

   // persisted
   project, 
   patterngrid,
   patterns
});

export default kytaimeApp;