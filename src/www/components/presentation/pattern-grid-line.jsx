import React, { PropTypes } from 'react';


const Toolbar = ({ patterns }) => {
   return ( 
      <div className="row expanded align-middle patternRow patternRow-a">
         {patterns.map(pattern => 
            <div className="">
               <div className="pattern"></div>
            </div>
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

Toolbar.propTypes = {
   patterns: PropTypes.array.isRequired,
}

export default Toolbar;
