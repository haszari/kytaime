import React, { PropTypes } from 'react';


const PlayButton = ({readyToPlay, isPlaying, beatNumber, onClick}) => {
   const buttonText = isPlaying ? "Stop" : "Play";
   
   return ( 
      <div>
         <div>{beatNumber}</div>
         <button onClick={onClick}  disabled={!readyToPlay}>{buttonText}</button>
      </div>
   );
}

PlayButton.propTypes = {
  readyToPlay: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  beatNumber: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
}

export default PlayButton;
