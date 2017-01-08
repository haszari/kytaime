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

const PatternGridLine = ({ patterns, onPatternClick, onRowMetaClick, channel }) => {
   // here's a good reason to use inline styles.. come back to that
   let rowColourClass = "patternRow-" + String.fromCharCode('a'.charCodeAt(0) + channel-1);
   let classes = "row expanded align-middle patternRow " + rowColourClass;

   // we're not using these bits anymore - minimalist
   let addCellButton = (  
      <div className="">
         <div className="patternLine-addPattern">+</div>
      </div>
   );
   let channelNumberIndicator = (  
      <div className="columns">
         <div className="patternLine-channel">{channel}</div>
      </div>
   );

   return ( 
      <div className={classes} 
         onClick={(e) => { if (e.metaKey) onRowMetaClick(channel); } } >
         {patterns.map((pattern) => 
            <PatternCell 
               key={pattern.id} triggered={pattern.triggered} playing={pattern.playing} 
               onClick={ (e) => {
                  e.stopPropagation();
                  onPatternClick(e, pattern.id);
               } }
            />
         )}
      </div>
   );
}

PatternGridLine.propTypes = {
   channel: PropTypes.number.isRequired,
   patterns: PropTypes.array.isRequired,
   onPatternClick: PropTypes.func.isRequired,
   onRowMetaClick: PropTypes.func.isRequired,
}


export default PatternGridLine;
