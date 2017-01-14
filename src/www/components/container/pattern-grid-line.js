import { connect } from 'react-redux';

import importMidiFile from '../../lib/import-midi-file';

import PatternGridLine from '../presentation/pattern-grid-line.jsx';

import store from '../../stores/store';
import * as actions from '../../stores/actions';



const mapStateToProps = (state, ownProps) => {
   return {
      channel: ownProps.channel,
      patterns: state.patterns.filter(p => p.channel == ownProps.channel),
      editMode: state.userinterface.editMode
   }
}

let hiddenPatternImportButton = document.createElement('input');
hiddenPatternImportButton.setAttribute('type', 'file');

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      onRemovePatternClick: (id) => {
         dispatch(actions.removePattern({id: id}));
      },
      onPatternClick: (id) => {
         dispatch(actions.togglePatternTrigger({id: id}));
      },
      onRowImportPatternClick: (channel) => {
         // resetting event handler here so we can capture channel
         hiddenPatternImportButton.onchange = () => {
            var reader = new FileReader();
            reader.readAsArrayBuffer(hiddenPatternImportButton.files[0]);
            reader.onloadend = function(event) {
               var importedMidiFile = importMidiFile(event.target.result);
               var lastNote = _.maxBy(importedMidiFile.notes, 'start');
               var duration = Math.pow(2, Math.ceil(Math.sqrt(lastNote.start)));
               store.dispatch(actions.addPattern({ 
                  duration: duration,
                  channel: channel,
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
