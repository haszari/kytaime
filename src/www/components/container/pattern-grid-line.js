import { connect } from 'react-redux';

import importMidiFile from '../../lib/import-midi-file';

import PatternGridLine from '../presentation/pattern-grid-line.jsx';

import store from '../../stores/store';
import * as actions from '../../stores/actions';

import _ from 'lodash'; 


const mapStateToProps = (state, ownProps) => {
   let rowState = state.patterngrid[ownProps.rowIndex];
   let patternsForThisRow = [];
   // if (rowState && rowState.patterns.length)
   //    patternsForThisRow = rowState.patterns.map(
   //       (patternId) => _.find(state.patterns, { id: patternId })
   //    );
   return {
      // patterns: _.compact(patternsForThisRow),
      patternCells: rowState ? rowState.patternCells : [],
      editMode: state.userinterface.editMode
   }
}

let hiddenPatternImportButton = document.createElement('input');
hiddenPatternImportButton.setAttribute('type', 'file');

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      onRemovePatternClick: ({rowIndex, patternId}) => {
         dispatch(actions.removePattern({rowIndex, patternId}));
      },
      onPatternClick: ({ rowIndex, cellIndex }) => {
         dispatch(actions.toggleCellTrigger({ rowIndex, cellIndex }));
      },
      onRowImportPatternClick: (rowIndex) => {
         hiddenPatternImportButton.onchange = () => {
            if (hiddenPatternImportButton.files.length < 1)
               return;
            var reader = new FileReader();
            reader.readAsArrayBuffer(hiddenPatternImportButton.files[0]);
            reader.onloadend = function(event) {
               var importedMidiFile = importMidiFile(event.target.result);
               var lastNote = _.maxBy(importedMidiFile.notes, 'start');
               var duration = Math.pow(2, Math.ceil(Math.sqrt(lastNote.start)));
               store.dispatch(actions.addPattern({ 
                  duration: duration,
                  rowIndex: rowIndex,
                  notes: importedMidiFile.notes,
               }));
            }
         }

         hiddenPatternImportButton.click();
      }
   }
}


const PatternGridLine_Container = connect(
   mapStateToProps,
   mapDispatchToProps
)(PatternGridLine);

export default PatternGridLine_Container;
