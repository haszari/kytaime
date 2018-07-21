
import React from 'react';

import { connect } from 'react-redux';

import * as actions from './actions';


const mapStateToProps = (state, ownProps) => {
   return {
      playState: state.transport.playState,
      beat: state.transport.beat,
      time: state.transport.time,
      testBeatTriggered: state.transport.triggerTestMidi,
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      onThrowdownClicked: () => {
         dispatch(actions.transportTogglePlay());
      },
      onThrowdownMIDIClicked: () => {
         dispatch(actions.toggleTestPatternPlayState());
      },
      // onThrowdownAudioClicked: () => {
      //    dispatch(actions.toggleElementTriggerState({ element: 'Audio' }));
      // },
   }
}

const renderTransport = function(props) {
   let testTriggerState = props.testBeatTriggered ? ' >' : ' …';
   let { playState, beat, time } = props;
   let title = props.title ? props.title : 'Throwdown';
	return (
		<div>
         <h1 onClick={props.onThrowdownClicked}>{title}</h1>
         <pre>{ Math.round(beat) } { Math.round(time) }ms</pre>
         <p onClick={props.onThrowdownMIDIClicked}>Test beat {testTriggerState}</p>
      </div>
   );
} 

const Transport = connect(
   mapStateToProps,
   mapDispatchToProps
)(renderTransport);

export default Transport;