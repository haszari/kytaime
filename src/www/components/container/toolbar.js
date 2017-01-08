import sequencer from '../../sequencer';
import { connect } from 'react-redux';
import Toolbar from '../presentation/toolbar.jsx';


const mapStateToProps = (state, ownProps) => {
   return {
      playState: state.transport.playState,
      beatNumber: state.transport.beatNumber,
      onPlayClick: () => {
         sequencer.togglePlay();
      }
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      // we'll hook up toggle play here??
      // onBeatTick: () => {
      //    dispatch(transportCurrentBeat(ownProps.beatNumber + 1))
      // }
   }
}


const SequencerApp = connect(
   mapStateToProps,
   mapDispatchToProps
)(Toolbar);

export default SequencerApp;