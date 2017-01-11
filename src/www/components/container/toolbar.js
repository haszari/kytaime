import sequencer from '../../sequencer';

import { connect } from 'react-redux';

import store from '../../stores/store';
import * as actions from '../../stores/actions';

import Toolbar from '../presentation/toolbar.jsx';


const mapStateToProps = (state, ownProps) => {
   return {
      playState: state.transport.playState,
      beatNumber: state.transport.beatNumber,
      onPlayClick: () => {
         sequencer.togglePlay();
      },
      editMode: state.userinterface.editMode
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      onToggleEditMode: () => {
         dispatch(actions.uiToggleEditMode())
      }
   }
}


const SequencerApp = connect(
   mapStateToProps,
   mapDispatchToProps
)(Toolbar);

export default SequencerApp;