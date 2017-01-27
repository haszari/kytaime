
import moment from 'moment';

import FileSaver from 'file-saver';

import React, { PropTypes } from 'react';

import colours from '../../styles/colours';

class Toolbar extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         showExportModal: false
      };
   }

   render() {
      let { 
         projectName, projectTag, 
         playState, beatNumber, 
         onPlayClick, onToggleEditMode, 
         onChangeProjectName, onChangeProjectTag,
         editMode, 
         exportData 
      } = this.props;

      let playButtonIconClass = '';
      if (playState == "playing")
         playButtonIconClass = 'icon-stop';
      else if (playState == "stopped")
          playButtonIconClass = 'icon-play';
      let editButtonStyle = {};
      if (editMode)
         editButtonStyle = { color: colours.enabledButtonForeground };

      let onExportSessionClicked = () => {
         let name = projectName || 'kytaime';
         let tag = projectTag ? ('-' + projectTag) : '';
         let sessionFileName = name + tag + '-' + moment().format('YYYYMMDD-hhmmss') + '.kytaime';
         let dataURI = 'data:Application/octet-stream,' + encodeURIComponent(exportData);
         var blob = new Blob([exportData], {type: "text/hjson;charset=utf-8"});
         FileSaver.saveAs(blob, sessionFileName);

         this.setState({
            showExportModal: false 
         });
      }

      let exportProjectPopover = (
         <div className="popover" id="exportSessionDropdown">
            <form>
               <div className="row">
                  <div className="medium-6 columns">
                    <label>Name
                      <input type="text" placeholder="kytaime" onChange={onChangeProjectName} value={projectName} />
                    </label>
                  </div>
                  <div className="medium-6 columns">
                    <label>Tag
                      <input type="text" placeholder="banger" onChange={onChangeProjectTag} value={projectTag} />
                    </label>
                  </div>
               </div>
               <div className="row align-right">
                  <div className="shrink columns text-right">
                     <div className="icon-floppy"
                        onClick={onExportSessionClicked}></div>
                  </div>
               </div>
            </form>
         </div>
      );
     
      let onMenuClicked = () => {
         this.setState({
            showExportModal: !this.state.showExportModal 
         });
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
                     onClick={onMenuClicked}></div>
                  { this.state.showExportModal ? exportProjectPopover : undefined }
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
  projectName: PropTypes.string.isRequired,
  projectTag: PropTypes.string.isRequired,
  playState: PropTypes.string.isRequired,
  beatNumber: PropTypes.number.isRequired,
  onPlayClick: PropTypes.func.isRequired,
  onToggleEditMode: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  exportData: PropTypes.string.isRequired,
  onChangeProjectName: PropTypes.func.isRequired,
  onChangeProjectTag: PropTypes.func.isRequired,
}
export default Toolbar;
