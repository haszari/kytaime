var WorkerSetInterval = require('worker!./lib/worker-setInterval')

import _ from 'lodash'; 

import WebMidiHelper from './lib/web-midi-helper';
import midiUtilities from './lib/midi-utilities';
import renderNotePattern from './lib/render-note-pattern';
import renderAutomationPattern from './lib/render-automation-pattern';
import * as bpmUtilities from './lib/bpm-utilities';

import store from './stores/store';
import * as actions from './stores/actions';


var midiOutPort = null;
var metronomeChannel = 0;
var metronomeNote = 37;
var metronomeOn = true;

// dictionary of name: pattern
var patterns = {};

// how often we ideally want to call our note renderer
var renderInterval = 200;
// longer period of notes to render to cover potential sloppy timing between render callbacks
var renderOverlap = renderInterval * 0.2;

var updateUI = function(renderRange) {
   let appState = store.getState();

   // this loop and timestamp calc is duplicated around here - should factor it out
   for (var beat=Math.ceil(renderRange.start.beat); beat<renderRange.end.beat; beat++) {
      var beatOffset = beat - renderRange.start.beat;
      var timestamp = bpmUtilities.beatsToMs(appState.project.tempo, beatOffset);

      // dispatch UI update
      // (this "callback on beat x" is generally useful)
      setTimeout(() => {
         store.dispatch(actions.transportCurrentBeat(beat));
      }, timestamp);
   }
};

var state = {
   isPlaying: false,
   lastRenderEndBeat: 0,
   lastRenderEndTime: 0,
   intervalId: null
};
var updateTransport = function() {
   // console.log('render at ' + window.performance.now() + ' last finished at ' + state.lastRenderEndTime);

   let appState = store.getState();

   var now = window.performance.now();
   var renderStart = state.lastRenderEndTime;
   var renderEnd = now + renderInterval + renderOverlap;
   var chunkMs = renderEnd - renderStart;
   if (chunkMs <= 0)
      return;

   var renderRange = {
      start: {
         time: renderStart,
         beat: state.lastRenderEndBeat
      },
      end: {
         time: renderEnd,
         beat: state.lastRenderEndBeat + 
            bpmUtilities.msToBeats(appState.project.tempo, chunkMs)
      }
   };

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

   updateUI(renderRange);

   // render patterns
   _.each(appState.patterngrid, (patternGridLine, rowIndex) => {
      _.each(patternGridLine.patternCells, 
         (cell, cellIndex) => {
            let pattern = _.find(appState.patterns, { id: cell.patternId });
            let isStillPlaying = false;

            if (_.isArray(pattern.notes)) {         
               // render NotePatterns
               isStillPlaying = renderNotePattern(
                  renderRange, appState.project.tempo, curPhraseLength,
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
                  renderRange, appState.project.tempo, curPhraseLength,
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
   store.dispatch(actions.transportPlayState("playing"));
};

var stopTempoClock = function() {
   worker.postMessage({
      type: "stop"
   });
   state = {
      isPlaying: false,
      lastRenderEndBeat: 0,
      lastRenderEndTime: 0,
      intervalId: null
   };
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

var setPattern = function(patternDictionary) {
   patterns = _.extend(patterns, patternDictionary);
};


const requestedPortName = "IAC Driver Bus 1";

function initialiseTransport() {
   setOptions({
      port: midiOutPort,
   });
   // transport.start();
}

WebMidiHelper.openMidiOut({
   deviceName: requestedPortName, // default
   callback: function(info) {
      if (info.port) {
         midiOutPort = info.port;
         console.log("Using " + midiOutPort.name);

         initialiseTransport();

         store.dispatch(actions.transportPlayState("stopped"));
      }
   }.bind(this)
});


module.exports.start = startTempoClock;
module.exports.stop = stopTempoClock;
module.exports.togglePlay = togglePlay;
module.exports.isPlaying = isPlaying;
module.exports.setOptions = setOptions;
module.exports.setPattern = setPattern;
