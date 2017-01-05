import React, { PropTypes } from 'react';


const Toolbar = ({playState, beatNumber, onPlayClick}) => {
   let playButtonIconClass = '';
   if (playState == "playing")
      playButtonIconClass = 'icon-stop';
   else if (playState == "stopped")
       playButtonIconClass = 'icon-play';
  
   return ( 
      <section className="toolbar noSelect">
         <div className="row expanded">
            <div className="shrink columns">
               <div className="icon-menu"></div>
            </div>
            <div className="small columns text-center">
               <div className="row align-center">
                  <div className="">{beatNumber}</div>
                  {/* <div className="">/32</div> */}
               </div>
            </div>
            <div className="shrink columns text-right" onClick={onPlayClick}>
               <div className={playButtonIconClass} ></div>
            </div>
         </div>
      </section>
   );
}

Toolbar.propTypes = {
  playState: PropTypes.string.isRequired,
  beatNumber: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
}
export default Toolbar;
