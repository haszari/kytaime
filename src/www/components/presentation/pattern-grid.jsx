import React, { PropTypes } from 'react';

import PatternGridLine from '../container/pattern-grid-line.js';


const PatternGrid = ({ }) => {

   return ( 
      <section id="patternLines">

         <PatternGridLine channel={1} />

         <PatternGridLine channel={2} />

         <PatternGridLine channel={3} />

         <PatternGridLine channel={4} />

         <PatternGridLine channel={5} />

         <PatternGridLine channel={6} />

      </section>
   )
}

PatternGrid.propTypes = {
   // channel: PropTypes.number.isRequired,
   // patterns: PropTypes.array.isRequired,
   // editMode: PropTypes.bool.isRequired,
   // onPatternClick: PropTypes.func.isRequired,
   // onRowImportPatternClick: PropTypes.func.isRequired,
}


export default PatternGrid;
