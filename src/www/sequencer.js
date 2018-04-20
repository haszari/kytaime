var WorkerSetInterval = require('worker!./lib/worker-setInterval')

import _ from 'lodash'; 

import WebMidiHelper from './lib/web-midi-helper';
import midiUtilities from './lib/midi-utilities';
import * as bpmUtilities from './lib/bpm-utilities';


var midiOutPort = null;

// this metronome stuff is like a mini client; not core sequencer
var metronomeChannel = 0;
var metronomeNote = 37;
var metronomeOn = true;

// how often we ideally want to call our note renderer
var renderInterval = 200;
// longer period of notes to render to cover potential sloppy timing between render callbacks
var renderOverlap = renderInterval * 0.2;

// sequencer state that is carried between render callbacks
var state = {
   isPlaying: false,
   lastRenderEndBeat: 0,
   lastRenderEndTime: 0,
   intervalId: null,
   
   // tempo is currently stored in kytaime redux; we need to take control of it
   // clients will have to schedule events to update the transport tempo
   tempoBpm: 120, 
};
var updateTransport = function() {
   // console.log('render at ' + window.performance.now() + ' last finished at ' + state.lastRenderEndTime);

   var now = window.performance.now();
   var renderStart = state.lastRenderEndTime;
   var renderEnd = now + renderInterval + renderOverlap;
   var chunkMs = renderEnd - renderStart;
   if (chunkMs <= 0)
      return;

   var renderRange = {
      // we now provide tempo of render range to clients
      tempoBpm: state.tempoBpm,
      start: {
         time: renderStart,
         beat: state.lastRenderEndBeat
      },
      end: {
         time: renderEnd,
         beat: state.lastRenderEndBeat + 
            bpmUtilities.msToBeats(state.tempoBpm, chunkMs)
      }
   };

   // tell the client(s) to do their thing
   kytaimeSequencerCallback(renderRange);


   // update state
   state.lastRenderEndBeat = renderRange.end.beat;
   state.lastRenderEndTime = state.lastRenderEndTime + chunkMs;
};

var setOptions = function(options) {
   midiOutPort = options.port;
};

var worker = new WorkerSetInterval;
// worker.postMessage();
worker.addEventListener('message', function(e) {
   // console.log('Worker said: ', e.data);
   if (e.data == 'updateMetronome') {
      updateTransport();
   }
}, false);

var startTempoClock = function() {
   state.isPlaying = true;

   // let's start the tempoclock NOW      
   state.lastRenderEndTime = window.performance.now();
   updateTransport();

   // now loop forever
   worker.postMessage({
      type: "start", 
      interval: renderInterval,
      message: "updateMetronome"
   });

   // these need to factor out to kytaime
   store.dispatch(actions.transportPlayState("playing"));
};

var stopTempoClock = function() {
   worker.postMessage({
      type: "stop"
   });
   state = {
      tempoBpm: state.tempoBpm,
      isPlaying: false,
      lastRenderEndBeat: 0,
      lastRenderEndTime: 0,
      intervalId: null
   };

   // these need to factor out to kytaime
   store.dispatch(actions.transportPlayState("stopped"));
};

var togglePlay = function() {
   if (!state.isPlaying)
      startTempoClock();
   else
      stopTempoClock();
}

var isPlaying = function() {
   return state.isPlaying;
};

function initialiseTransport() {
   setOptions({
      port: midiOutPort,
   });
   // transport.start();
}

let midiOutDevice = "IAC Driver Bus 1";
function getMidiOut() { return midiOutDevice; };
function setMidiOut(requestedPortName) {
   WebMidiHelper.openMidiOut({
      deviceName: requestedPortName, // default
      callback: function(info) {
         if (info.port) {
            midiOutPort = info.port;
            console.log("Using " + midiOutPort.name);
            midiOutDevice = midiOutPort.name;

            initialiseTransport();

            // this needs to factor out to client
            store.dispatch(actions.transportPlayState("stopped"));
         }
      }.bind(this)
   });   
}

setMidiOut(midiOutDevice);


/// EXPORTS
// which of these exports are core (library) sequencer and which are kytaime patterns reality?

// core / lib
module.exports.start = startTempoClock;
module.exports.stop = stopTempoClock;
module.exports.togglePlay = togglePlay;
module.exports.isPlaying = isPlaying;
module.exports.setOptions = setOptions;
module.exports.getMidiOut = getMidiOut;
module.exports.setMidiOut = setMidiOut;





// start kytaime --------------------- 
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
                  renderRange, state.tempoBpm, curPhraseLength,
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
                  renderRange, state.tempoBpm, curPhraseLength,
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
// --------------------- end kytaime 


// pattern sequencer example client kytaime
module.exports.setPattern = setPattern;
