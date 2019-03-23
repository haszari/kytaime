import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import transportActions from '../transport/actions';

function PlayButtonComponent( props ) {
  const label = props.isPlaying ? "Stop" : "Play";
  return (
    <button onClick={ props.togglePlayback }>{ label }</button>
  );
}

PlayButtonComponent.propTypes = {
  togglePlayback: PropTypes.func,
  isPlaying: PropTypes.bool,
}

const mapStateToProps = state => {
  return {
    isPlaying: state.transport.isPlaying,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    togglePlayback: event => {
      dispatch( transportActions.togglePlayback( ) )
    }
  }
}

const PlayButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayButtonComponent);

export default PlayButton;