
import React from 'react';

import { connect } from 'react-redux';

import * as actions from './actions';


const mapStateToProps = (state, ownProps) => {
   return {
      playState: state.transport.playState,
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
	return (
		<div>
         <h1 onClick={props.onThrowdownClicked}>Throwdown</h1>
         <p onClick={props.onThrowdownMIDIClicked}>Test beat {testTriggerState}</p>
      </div>
   );
} 

const Transport = connect(
   mapStateToProps,
   mapDispatchToProps
)(renderTransport);

export default Transport;