
import Hjson from 'hjson';

import sequencer from '../../sequencer';

import { connect } from 'react-redux';

import store from '../../stores/store';
import * as actions from '../../stores/actions';

import Toolbar from '../presentation/toolbar.jsx';


const mapStateToProps = (state, ownProps) => {
   return {
      projectName: state.project.name, 
      projectTag: state.project.tag, 
      playState: state.transport.playState,
      beatNumber: state.transport.beatNumber,
      onPlayClick: () => {
         sequencer.togglePlay();
      },
      editMode: state.userinterface.editMode,
      exportData: Hjson.stringify(state),
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      onToggleEditMode: () => {
         dispatch(actions.uiToggleEditMode())
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