
import moment from 'moment';

import FileSaver from 'file-saver';

import React, { PropTypes } from 'react';

import colours from '../../styles/colours';

class Toolbar extends React.Component {
   render() {
      let { playState, beatNumber, onPlayClick, onToggleEditMode, editMode, exportData } = this.props;

      let playButtonIconClass = '';
      if (playState == "playing")
         playButtonIconClass = 'icon-stop';
      else if (playState == "stopped")
          playButtonIconClass = 'icon-play';
      let editButtonStyle = {};
      if (editMode)
         editButtonStyle = { color: colours.enabledButtonForeground };

      let onExportSessionClicked = () => {
         let projectName = 'kytaime';
         let sessionFileName = projectName + '-' + moment().format('YYYYMMDD-hhmmss') + '.kytaime';
         let dataURI = 'data:Application/octet-stream,' + encodeURIComponent(exportData);
         var blob = new Blob([exportData], {type: "text/hjson;charset=utf-8"});
         FileSaver.saveAs(blob, sessionFileName);
      }
     
      return ( 
         <section className="toolbar noSelect">
            <div className="row expanded">
               <div className="shrink columns">
                  <div className="icon-pencil" style={editButtonStyle} 
                     onClick={onToggleEditMode}></div>
               </div>
               <div className="shrink columns">
                  <div className="icon-menu"
                     onClick={onExportSessionClicked}></div>
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
}

Toolbar.propTypes = {
  playState: PropTypes.string.isRequired,
  beatNumber: PropTypes.number.isRequired,
  onPlayClick: PropTypes.func.isRequired,
  onToggleEditMode: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  exportData: PropTypes.string.isRequired,
}
export default Toolbar;
