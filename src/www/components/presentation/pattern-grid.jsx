import React, { PropTypes } from 'react';

import PatternGridLine from '../container/pattern-grid-line.js';


const PatternGrid = ({ patternGridLines }) => {

   return ( 
      <section id="patternLines">

         {patternGridLines.map((line, index) => 
            <PatternGridLine key={index} channel={line.midiChannel} />
         )}

      </section>
   )
}

PatternGrid.propTypes = {
   patternGridLines: PropTypes.array.isRequired,
}


export default PatternGrid;
