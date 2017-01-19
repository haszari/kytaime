import React, { PropTypes } from 'react';


const hsl = (h, s, l) => {
   return "hsl(" + 
      h + ", " + 
      s + "%, " +
      l + "%)";
}

const patternColourInfo = {
   baseHue: 22,
   hueIncrement: 66, // 22 is 360 / 16 channels
   backgroundLightness: 97,
   offLightness: 82,
   onLightness: 50,
   saturation: 90
}

const PatternCell = ({hue, triggered, playing, onClick, iconClass}) => {
   let classes = ["row", "pattern", "text-center align-middle"];
   let borderLightness = patternColourInfo.offLightness;
   let backgroundLightness = patternColourInfo.offLightness;
   if (triggered) {
      classes.push("triggered");
      borderLightness = patternColourInfo.onLightness;
   }
   if (playing) {
      classes.push("playing");
      backgroundLightness = patternColourInfo.onLightness;
   }

   let backgroundColour = hsl(
      hue,
      patternColourInfo.saturation, 
      backgroundLightness
   );
   let borderColour = hsl(
      hue,
      patternColourInfo.saturation, 
      borderLightness
   );

   return (
      <div className={classes.join(" ")} onClick={onClick}
         style={{ 
            backgroundColor: backgroundColour,
            borderColor: borderColour
         }} >
         <div className={iconClass + " columns"}></div>
      </div>
   );               
}

PatternCell.propTypes = {
   hue: PropTypes.number.isRequired,
   triggered: PropTypes.bool.isRequired,
   playing: PropTypes.bool.isRequired,
   onClick: PropTypes.func.isRequired
}

const PatternGridLine = ({ 
   patternCells, rowIndex, channel, editMode,
   onPatternClick, onRowImportPatternClick, onRemovePatternClick }) => {

   let rowHue = (patternColourInfo.baseHue + (rowIndex * patternColourInfo.hueIncrement));

   let rowBackgroundColour = hsl(
      rowHue,
      patternColourInfo.saturation, 
      patternColourInfo.backgroundLightness
   );
   let rowStyle = {
      backgroundColor: rowBackgroundColour
   };


   let classes = "row expanded align-middle patternRow ";

   let backgroundColour = hsl(
      rowHue,
      patternColourInfo.saturation, 
      patternColourInfo.offLightness
   );
   let borderColour = hsl(
      rowHue,
      patternColourInfo.saturation, 
      patternColourInfo.offLightness
   );
   let importPatternButton = !editMode ? undefined : (  
      <div className="row pattern text-center align-middle" 
         style={{ 
            backgroundColor: backgroundColour,
            borderColor: borderColour
         }}
         onClick={(e) => { onRowImportPatternClick(rowIndex); }}>
         <div className="columns icon-plus"></div>
      </div>
   );

   let patternCellClickHandler = function({ rowIndex, cellIndex, patternId }) {
      if (editMode) {
         onRemovePatternClick({ rowIndex, patternId });
      }
      else
         onPatternClick({ rowIndex, cellIndex });
   }

   // we're not using this anymore - minimalist
   let channelNumberIndicator = (  
      <div className="columns">
         <div className="patternLine-channel float-right">{channel}</div>
      </div>
   );

   return ( 
      <div className={classes} style={rowStyle} >
         {patternCells.map((cell, cellIndex) => 
            <PatternCell 
               key={cellIndex} triggered={cell.triggered} playing={cell.playing} 
               hue={rowHue}
               iconClass={ editMode ? "icon-trash" : undefined }
               onClick={ () => {
                  patternCellClickHandler({ rowIndex, cellIndex, patternId: cell.patternId });
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
   patternCells: PropTypes.array.isRequired,
   editMode: PropTypes.bool.isRequired,
   onPatternClick: PropTypes.func.isRequired,
   onRowImportPatternClick: PropTypes.func.isRequired,
}


export default PatternGridLine;
