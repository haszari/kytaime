
import moment from 'moment';

import FileSaver from 'file-saver';

import React, { PropTypes } from 'react';

import colours from '../../styles/colours';

import sequencer from '../../sequencer';

import WebMidiHelper from '../../lib/web-midi-helper';

class Toolbar extends React.Component {
   constructor(props) {
      super(props);
      let currentMidiOut = sequencer.getMidiOut();
      this.state = {
         proposedMidiOut: currentMidiOut,
         proposedTempo: undefined,
         showExportModal: false,
         showTempoPopover: false,
      };
   }

   render() {
      let { 
         tempo, 
         onApplyTempoClicked, 
         projectName, projectTag, 
         playState, beatNumber, 
         onPlayClick, onToggleEditMode, 
         onChangeProjectName, onChangeProjectTag,
         editMode, 
         exportData 
      } = this.props;

      let midiOuts = WebMidiHelper.getOutputs();

      let playButtonIconClass = '';
      if (playState == "playing")
         playButtonIconClass = 'icon-stop';
      else if (playState == "stopped")
          playButtonIconClass = 'icon-play';
      let editButtonStyle = {};
      if (editMode)
         editButtonStyle = { color: colours.enabledButtonForeground };

      let displayBeatNumber = beatNumber ? beatNumber : '-';

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

      let onChangeProposedTempo = (event) => {
         this.setState({
            proposedTempo: event.target.value
         })
      };

      let onSelectMidiOut = (event) => {
         this.setState({
            proposedMidiOut: event.target.value
         })
      };

      let onApplyMidiOut = (event) => {
         sequencer.setMidiOut(this.state.proposedMidiOut);
      };

      let nextTempoValue = this.state.proposedTempo ? this.state.proposedTempo : tempo;

      let optionsPopover = (
         <div className="popover" id="optionsPopover">
            <form>
               <select onChange={onSelectMidiOut} value={this.state.proposedMidiOut}>
                  {
                     midiOuts.map((midiOut, index) =>
                        <option key={index} value={midiOut.name}>
                           {midiOut.name}
                        </option>
                     )
                  }
               </select>
               <div className="row align-right">
                  <div className="shrink columns text-right">
                     <div className="icon-tick"
                        onClick={onApplyMidiOut}></div>
                  </div>
               </div>
            </form>
         </div>
      );

      let tempoPopover = (
         <div className="popover" id="tempoPopover">
            <form>
               <div className="row">
                  <div className="medium-6 columns">
                    <label>Current Tempo
                      <input type="number" value={tempo} readOnly />
                    </label>
                  </div>
                  <div className="medium-6 columns">
                    <label>Tempo
                      <input type="number" value={nextTempoValue} onChange={onChangeProposedTempo} />
                    </label>
                  </div>
               </div>
               <div className="row align-right">
                  <div className="shrink columns text-right">
                     <div className="icon-tick"
                        onClick={onApplyTempoClicked.bind(null, nextTempoValue)}></div>
                  </div>
               </div>
            </form>
         </div>
      );
        
      let onOptionsClicked = () => {
         this.setState({
            showOptionsModal: !this.state.showOptionsModal 
         });
      }

      let onExportClicked = () => {
         this.setState({
            showExportModal: !this.state.showExportModal 
         });
      }

      let onBeatDisplayClicked = () => {
         this.setState({
            showTempoPopover: !this.state.showTempoPopover 
         });
      }


      return ( 
         <section className="toolbar noSelect">
            <div className="row expanded">
               <div className="shrink columns">
                  <div className="icon-menu"
                     onClick={onOptionsClicked}></div>
                  { this.state.showOptionsModal ? optionsPopover : undefined }
               </div>
               <div className="shrink columns">
                  <div className="icon-floppy"
                     onClick={onExportClicked}></div>
                  { this.state.showExportModal ? exportProjectPopover : undefined }
               </div>
               <div className="shrink columns">
                  <div className="icon-pencil" style={editButtonStyle} 
                     onClick={onToggleEditMode}></div>
               </div>
               <div className="small columns text-center">
                  <div className="row align-center">
                     <div className="" onClick={onBeatDisplayClicked}>{displayBeatNumber}</div>
                     {/* <div className="">/32</div> */}
                  </div>
                  { this.state.showTempoPopover ? tempoPopover : undefined }
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
  tempo: PropTypes.number.isRequired,
  projectName: PropTypes.string.isRequired,
  projectTag: PropTypes.string.isRequired,
  playState: PropTypes.string.isRequired,
  beatNumber: PropTypes.number.isRequired,
  onPlayClick: PropTypes.func.isRequired,
  onToggleEditMode: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  exportData: PropTypes.string.isRequired,
  onApplyTempoClicked: PropTypes.func.isRequired,
  onChangeProjectName: PropTypes.func.isRequired,
  onChangeProjectTag: PropTypes.func.isRequired,
}
export default Toolbar;
