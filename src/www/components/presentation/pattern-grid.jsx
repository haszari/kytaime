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


const PatternGridLine = ({ patterns, onPatternClick }) => {
   return ( 
      <div className="row expanded align-middle patternRow patternRow-a">
         {patterns.map((pattern) => 
            <PatternCell key={pattern.id} triggered={pattern.triggered} playing={pattern.playing} onClick={() => onPatternClick(pattern.id) } />
         )}

         <div className="small columns">
            <div className="patternLine-addPattern">+</div>
         </div>
         <div className="">
            <div className="patternLine-channel">1</div>
         </div>
      </div>
   );
}

PatternGridLine.propTypes = {
   patterns: PropTypes.array.isRequired,
}

export default PatternGridLine;
