import React, { PropTypes } from 'react';


const PatternCell = ({triggered, playing, onClick, iconClass}) => {
   let classes = ["row", "pattern", "text-center align-middle"];
   if (triggered) 
      classes.push("triggered");
   if (playing) 
      classes.push("playing");

   return (
      <div className={classes.join(" ")} onClick={onClick} >
         <div className={iconClass + " columns"}></div>
      </div>
   );               
}

PatternCell.propTypes = {
   triggered: PropTypes.bool.isRequired,
   playing: PropTypes.bool.isRequired,
   onClick: PropTypes.func.isRequired
}

const PatternGridLine = ({ 
   patterns, rowIndex, channel, editMode,
   onPatternClick, onRowImportPatternClick, onRemovePatternClick }) => {
   // here's a good reason to use inline styles.. come back to that
   let rowColourClass = "patternRow-" + String.fromCharCode('a'.charCodeAt(0) + rowIndex);
   let classes = "row expanded align-middle patternRow " + rowColourClass;

   let importPatternButton = !editMode ? undefined : (  
      <div className="row pattern text-center align-middle" 
         onClick={(e) => { onRowImportPatternClick(rowIndex); }}>
         <div className="columns icon-plus"></div>
      </div>
   );

   let patternCellClickHandler = function(id) {
      if (editMode) {
         onRemovePatternClick({rowIndex, id});
      }
      else
         onPatternClick(id);
   }

   // we're not using this anymore - minimalist
   let channelNumberIndicator = (  
      <div className="columns">
         <div className="patternLine-channel">{channel}</div>
      </div>
   );

   return ( 
      <div className={classes} >
         {patterns.map((pattern) => 
            <PatternCell 
               key={pattern.id} triggered={pattern.triggered} playing={pattern.playing} 
               iconClass={ editMode ? "icon-trash" : undefined }
               onClick={ () => {
                  patternCellClickHandler(pattern.id);
               } }
            />
         )}
         {importPatternButton}
         {channelNumberIndicator}
      </div>
   );
}

PatternGridLine.propTypes = {
   channel: PropTypes.number.isRequired,
   rowIndex: PropTypes.number.isRequired,
   patterns: PropTypes.array.isRequired,
   editMode: PropTypes.bool.isRequired,
   onPatternClick: PropTypes.func.isRequired,
   onRowImportPatternClick: PropTypes.func.isRequired,
}


export default PatternGridLine;
