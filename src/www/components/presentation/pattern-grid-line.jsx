import React, { PropTypes } from 'react';


const PatternCell = ({triggered, playing, onClick}) => {
   let classes = ["pattern"];
   if (triggered) 
      classes.push("triggered");
   if (playing) 
      classes.push("playing");

   return (
      <div className="" onClick={onClick} >
         <div className={classes.join(" ")}></div>
      </div>
   );               
}

PatternCell.propTypes = {
   triggered: PropTypes.bool.isRequired,
   playing: PropTypes.bool.isRequired,
   onClick: PropTypes.func.isRequired
}

const PatternGridLine = ({ patterns, onPatternClick, channel }) => {
   // here's a good reason to use inline styles.. come back to that
   let rowColourClass = "patternRow-" + String.fromCharCode('a'.charCodeAt(0) + channel-1);
   let classes = "row expanded align-middle patternRow " + rowColourClass;

   return ( 
      <div className={classes}>
         {patterns.map((pattern) => 
            <PatternCell key={pattern.id} triggered={pattern.triggered} playing={pattern.playing} onClick={() => onPatternClick(pattern.id) } />
         )}

         <div className="small columns">
            <div className="patternLine-addPattern">+</div>
         </div>
         <div className="">
            <div className="patternLine-channel">{channel}</div>
         </div>
      </div>
   );
}

PatternGridLine.propTypes = {
   channel: PropTypes.number.isRequired,
   patterns: PropTypes.array.isRequired,
   onPatternClick: PropTypes.func.isRequired
}


export default PatternGridLine;
