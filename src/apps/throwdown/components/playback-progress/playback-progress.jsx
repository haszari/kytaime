import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import throwdownSelectors from '../throwdown/selectors';

function PlaybackProgressComponent( props ) {
  const phraseProgressPercent = props.phraseProgress * 100;
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
  phraseProgress: PropTypes.number,
}

const mapStateToProps = state => {
  return {
    phraseProgress: throwdownSelectors.getPhraseProgress( state ),
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