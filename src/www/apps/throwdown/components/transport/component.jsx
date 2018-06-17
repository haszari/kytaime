
import React from 'react';

import { connect } from 'react-redux';

import * as actions from './actions';


const mapStateToProps = (state, ownProps) => {
   return {
      playState: state.transport.playState,
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      onThrowdownClicked: () => {
         dispatch(actions.transportTogglePlay());
      },
      onThrowdownMIDIClicked: () => {
         dispatch(actions.toggleElementTriggerState({ element: 'MIDI' }));
      },
      onThrowdownAudioClicked: () => {
         dispatch(actions.toggleElementTriggerState({ element: 'Audio' }));
      },
   }
}

const renderTransport = function(props) {
	return (
		<div>
         <h1 onClick={props.onThrowdownClicked}>Throwdown</h1>
         <h2 onClick={props.onThrowdownMIDIClicked}>MIDI</h2>
         <h2 onClick={props.onThrowdownAudioClicked}>Audio</h2>
      </div>
   );
} 

const Transport = connect(
   mapStateToProps,
   mapDispatchToProps
)(renderTransport);

export default Transport;