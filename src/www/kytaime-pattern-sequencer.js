
import { sequencer, bpmUtilities, midiOutputs } from './lib/sequencer';

import store from './stores/store';
import * as actions from './stores/actions';

import renderNotePattern from './lib/render-note-pattern';
import renderAutomationPattern from './lib/render-automation-pattern';


// dictionary of name: pattern
var patterns = {};

var setPattern = function(patternDictionary) {
   patterns = _.extend(patterns, patternDictionary);
};

// update the bpm display in the UI
var updateUI = function(renderRange) {
   // let appState = store.getState();

   // this loop and timestamp calc is duplicated around here - should factor it out
   for (var beat=Math.ceil(renderRange.start.beat); beat<renderRange.end.beat; beat++) {
      var beatOffset = beat - renderRange.start.beat;
      var timestamp = bpmUtilities.beatsToMs(renderRange.tempoBpm, beatOffset);

      // dispatch UI update
      // (this "callback on beat x" is generally useful)
      setTimeout(() => {
         store.dispatch(actions.transportCurrentBeat(beat));
      }, timestamp);
   }
};

var renderKytaimePatterns = function(renderRange) {
   let appState = store.getState();

   // determine current phrase length (.. in future, only if auto mode)
   const minimumPhraseLength = appState.project.minPhraseLength;
   const maximumPhraseLength = appState.project.maxPhraseLength;
   let curPhraseLength = minimumPhraseLength;
   curPhraseLength = _.reduce(appState.patterngrid, (curPhraseLength, patternGridLine) => {
      return _.reduce(patternGridLine.patternCells, (curPhraseLength, cell) => {
         let pattern = _.find(appState.patterns, { id: cell.patternId });
         if (!_.isUndefined(pattern.includeInPhrase) && !pattern.includeInPhrase)
            return curPhraseLength;
         return (
               (cell.playing || cell.triggered) && 
               (pattern.duration > curPhraseLength)
            ) ? 
            pattern.duration : curPhraseLength;
      }, curPhraseLength);
   }, curPhraseLength);
   curPhraseLength = Math.min(curPhraseLength, maximumPhraseLength);

   // render patterns
   _.each(appState.patterngrid, (patternGridLine, rowIndex) => {
      _.each(patternGridLine.patternCells, 
         (cell, cellIndex) => {
            let pattern = _.find(appState.patterns, { id: cell.patternId });
            let isStillPlaying = false;

            if (_.isArray(pattern.notes)) {         
               // render NotePatterns
               isStillPlaying = renderNotePattern(
                  renderRange, renderRange.tempoBpm, curPhraseLength,
                  midiOutPort, 
                  pattern,
                  patternGridLine.midiChannel, 
                  cell.triggered, 
                  cell.playing
               );
            }
            else if (_.isArray(pattern.points)) {         
               // render AutomationPatterns
               isStillPlaying = renderAutomationPattern(
                  renderRange, renderRange.tempoBpm, curPhraseLength,
                  midiOutPort, 
                  pattern,
                  patternGridLine.midiChannel, 
                  cell.triggered, 
                  cell.playing
               );
            }

            // update play state in store/ui
            if (isStillPlaying != cell.playing)
               store.dispatch(actions.setCellPlayState({ 
                  rowIndex: rowIndex, 
                  cellIndex: cellIndex, 
                  playing: isStillPlaying 
               }));
         }
      );
   });
}

var kytaimeSequencerCallback = function(renderRange) {
   // we should use some kind of chain tech thing here to make this generic!
   updateUI(renderRange)
   renderKytaimePatterns(renderRange);
}


var togglePlay = function() {
   var currentPlayState = sequencer.isPlaying();
   if (!currentPlayState) {
      sequencer.start();
      store.dispatch(actions.transportPlayState("playing"));
   }
   else {
      sequencer.stop();
      store.dispatch(actions.transportPlayState("stopped"));
   }

}

var midiOutPort = null;
let midiOutDevice = "";

// var setOptions = function(options) {
//    midiOutPort = options.port;
// };


function getMidiOut() { return midiOutDevice; };
function setMidiOut(requestedPortName) {
   midiOutputs.openMidiOutput({
      deviceName: requestedPortName, // default
      callback: function(info) {
         if (info.port) {
            midiOutPort = info.port;
            console.log("Using " + midiOutPort.name);
            midiOutDevice = midiOutPort.name;

            // initialiseTransport();
         }
      }.bind(this)
   });   
}

setMidiOut("IAC Driver Bus 1");


// script main thing

store.dispatch(actions.transportPlayState("stopped"));

sequencer.setRenderCallback('kytaime', kytaimeSequencerCallback);



module.exports.setPattern = setPattern;
module.exports.togglePlay = togglePlay;
module.exports.getMidiOut = getMidiOut;
module.exports.setMidiOut = setMidiOut;
