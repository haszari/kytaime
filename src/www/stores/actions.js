
import shortid from 'shortid';

import * as actionTypes from './action-types';



export function setGridNumRows(numRows) {
   return { type: actionTypes.PATTERNGRID_SET_NUM_ROWS, numRows: numRows }
}

export function setGridRowMidiChannel({ rowIndex, midiChannel }) {
   return { type: actionTypes.PATTERNGRID_SET_ROW_MIDICHANNEL, rowIndex: rowIndex, midiChannel: midiChannel }
}

export function toggleCellTrigger({ rowIndex, cellIndex }) {
   return { type: actionTypes.TOGGLE_CELL_TRIGGER, rowIndex: rowIndex, cellIndex: cellIndex };
}

export function setCellPlayState({ rowIndex, cellIndex, playing }) {
   return { type: actionTypes.SET_CELL_PLAYSTATE, rowIndex: rowIndex, cellIndex: cellIndex, playing: playing };
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


export function addPattern({rowIndex, notes, duration, startBeats, endBeats}) {
   return { 
      type: actionTypes.ADD_PATTERN, 
      rowIndex: rowIndex,

      patternId: shortid.generate(),
      notes: notes,
      duration: duration,
      startBeats: startBeats,
      endBeats: endBeats
   };
}

export function removePattern({ rowIndex, patternId }) {
   return { type: actionTypes.REMOVE_PATTERN, patternId: patternId, rowIndex: rowIndex };
}


export function importRehydrate(state) {
   return { type: actionTypes.IMPORT_REHYDRATE, state: state };
}
 

export function setProjectTag({ tag }) {
   return { type: actionTypes.SET_PROJECT_TAG, tag: tag };
}

export function setProjectName({ name }) {
   return { type: actionTypes.SET_PROJECT_NAME, name: name };
}
