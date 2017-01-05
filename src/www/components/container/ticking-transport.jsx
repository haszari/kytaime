import { connect } from 'react-redux';
import transportCurrentBeat from '../../stores/actions';
import Transport from '../presentation/transport.jsx';


const mapStateToProps = (state, ownProps) => {
   return {
      beatNumber: state.transportCurrentBeat
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      // we don't have anything to do here - the transport just dispatches events
      // onBeatTick: () => {
      //    dispatch(transportCurrentBeat(ownProps.beatNumber + 1))
      // }
   }
}


const TickingTransport = connect(
   mapStateToProps,
   mapDispatchToProps
)(Transport);

export default TickingTransport;