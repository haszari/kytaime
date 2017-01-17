

import * as actionTypes from './action-types';



export function setGridNumRows(numRows) {
   return { type: actionTypes.PATTERNGRID_SET_NUM_ROWS, numRows: numRows }
}

export function setGridRowMidiChannel({ rowIndex, midiChannel }) {
   return { type: actionTypes.PATTERNGRID_SET_ROW_MIDICHANNEL, rowIndex: rowIndex, midiChannel: midiChannel }
}



export function uiToggleEditMode() {
   return { type: actionTypes.UI_TOGGLE_EDITMODE }
}



export function transportPlayState(playState) {
   return { type: actionTypes.TRANSPORT_PLAYSTATE, playState: playState };
}

export function transportCurrentBeat(beatNumber) {
   return { type: actionTypes.TRANSPORT_CURRENT_BEAT, beatNumber: beatNumber };
}



let nextPatternId = 1;
export function addPattern({rowIndex, notes, duration, startBeats, endBeats}) {
   return { 
      type: actionTypes.ADD_PATTERN, 
      id: nextPatternId++, 
      rowIndex: rowIndex,
      notes: notes,
      duration: duration,
      startBeats: startBeats,
      endBeats: endBeats
   };
}

export function togglePatternTrigger(pattern) {
   return { type: actionTypes.TOGGLE_PATTERN_TRIGGER, id: pattern.id };
}

export function patternPlayState(pattern) {
   return { type: actionTypes.PATTERN_PLAYSTATE, id: pattern.id, playing: pattern.playing };
}

export function removePattern({ rowIndex, id }) {
   return { type: actionTypes.REMOVE_PATTERN, id: id, rowIndex: rowIndex };
}


export function importRehydrate(state) {
   return { type: actionTypes.IMPORT_REHYDRATE, state: state };
}
 