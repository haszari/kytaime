import React, { PropTypes } from 'react';


const PatternCell = ({triggered, playing}) => {
   let classes = ["pattern"];
   if (triggered) 
      classes.push("triggered");
   if (playing) 
      classes.push("playing");

   return (
      <div className="">
         <div className={classes.join(" ")}></div>
      </div>
   );               
}


const PatternGridLine = ({ patterns }) => {
   return ( 
      <div className="row expanded align-middle patternRow patternRow-a">
         {patterns.map((pattern) => 
            <PatternCell key={pattern.id} triggered={pattern.triggered} playing={false} />
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
