import React from 'react';
import PropTypes from 'prop-types';

function PlaybackProgressComponent( props ) {
  const phraseProgressPercent = props.progressPercent;
  return (
    <tr style={{ backgroundColor: props.backgroundColour }}>
      <td 
        colSpan="99" 
        className="playback-progress-container" >
        <div 
          className="playback-progress-progress" 
          style={{ 
            width: `${ phraseProgressPercent }%`,
            backgroundColor: props.progressColour,
          }}
        ></div>
      </td>
    </tr>
  );
}

PlaybackProgressComponent.propTypes = {
  togglePlayback: PropTypes.func,
  isPlaying: PropTypes.bool,
  progressPercent: PropTypes.number,
  backgroundColour: PropTypes.string,
  progressColour: PropTypes.string,
}

export default PlaybackProgressComponent;