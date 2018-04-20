
import Hjson from 'hjson';

import ksequencer from '../../kytaime-pattern-sequencer';

import { connect } from 'react-redux';

import store from '../../stores/store';
import * as actions from '../../stores/actions';

import Toolbar from '../presentation/toolbar.jsx';


const mapStateToProps = (state, ownProps) => {
   return {
      editMode: state.userinterface.editMode,
      
      projectName: state.project.name, 
      projectTag: state.project.tag, 
      exportData: Hjson.stringify(state),

      tempo: state.project.tempo, 
      
      playState: state.transport.playState,
      beatNumber: state.transport.beatNumber,
      
      onPlayClick: () => {
         ksequencer.togglePlay();
      },
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      onToggleEditMode: () => {
         dispatch(actions.uiToggleEditMode())
      },
      onApplyTempoClicked: (bpm) => {
         dispatch(actions.setProjectTempo(bpm));
      },
      onChangeProjectName: (event) => {
         dispatch(actions.setProjectName({ name: event.target.value }));
      },
      onChangeProjectTag: (event) => {
         dispatch(actions.setProjectTag({ tag: event.target.value }));
      },
   }
}


const SequencerApp = connect(
   mapStateToProps,
   mapDispatchToProps
)(Toolbar);

export default SequencerApp;