
import React from 'react';

import { connect } from 'react-redux';

import * as actions from '../stores/actions';


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
   }
}

const renderTransport = function(props) {
	return (
		<div onClick={props.onThrowdownClicked}>
         <h1>Throwdown</h1>
      </div>
   );
} 

const Transport = connect(
   mapStateToProps,
   mapDispatchToProps
)(renderTransport);

export default Transport;