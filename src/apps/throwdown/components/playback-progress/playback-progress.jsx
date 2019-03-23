import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

function PlaybackProgressComponent( props ) {
  const phraseProgressPercent = 18.0/32.0 * 100;
  return (
    <tr>
      <td colSpan="99" className="playback-progress-container"><div 
        className="playback-progress-progress" 
        style={{ width: `${ phraseProgressPercent }%` }}
      ></div></td>
    </tr>
  );
}

PlaybackProgressComponent.propTypes = {
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
  }
}

const PlaybackProgress = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaybackProgressComponent);

export default PlaybackProgress;