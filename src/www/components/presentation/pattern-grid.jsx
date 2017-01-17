import React, { PropTypes } from 'react';

import PatternGridLine from '../container/pattern-grid-line.js';


const PatternGrid = ({ patternGridLines, onFilesDropped }) => {

   let dragAll = () => {
      // coming soon .. UI hint
      return false;
   }

   return ( 
      <section id="patternLines" 
         onDrop={onFilesDropped} 
         onDragOver={dragAll} 
         >

         {patternGridLines.map((info, index) => 
            <PatternGridLine key={index} rowIndex={index} channel={info.midiChannel} />
         )}

      </section>
   )
}

PatternGrid.propTypes = {
   onFilesDropped: PropTypes.func.isRequired,
   patternGridLines: PropTypes.array.isRequired,
}


export default PatternGrid;
