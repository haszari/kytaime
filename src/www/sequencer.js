var WorkerSetInterval = require('worker!./lib/worker-setInterval')

import _ from 'lodash'; 

import WebMidiHelper from './lib/web-midi-helper';
import midiUtilities from './lib/midi-utilities';
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

var beatsPerMinute = 120;
var setBeatsPerMinute = function(newBpm) {
   beatsPerMinute = newBpm;
};

var updateUI = function(renderRange) {
   // this loop and timestamp calc is duplicated around here - should factor it out
   for (var beat=Math.ceil(renderRange.start.beat); beat<renderRange.end.beat; beat++) {
      var beatOffset = beat - renderRange.start.beat;
      var timestamp = bpmUtilities.beatsToMs(beatsPerMinute, beatOffset);

      // dispatch UI update
      // (this "callback on beat x" is generally useful)
      setTimeout(() => {
         store.dispatch(actions.transportCurrentBeat(beat));
      }, timestamp);
   }
};

var renderMetronome = function(renderRange) {
   if (!midiOutPort)
      return;

   for (var beat=Math.ceil(renderRange.start.beat); beat<renderRange.end.beat; beat++) {
      var beatOffset = beat - renderRange.start.beat;
      var timestamp = bpmUtilities.beatsToMs(beatsPerMinute, beatOffset);
      var note = { 
         port: midiOutPort, 

         channel: metronomeChannel, // channelMap.drums, 
         note: metronomeNote, //drumMap.hat, 

         velocity: 80, 
         duration: 200, 
         timestamp: renderRange.start.time + timestamp
      };
      // console.log(note.timestamp);

      midiUtilities.renderNote(note);
   }
};
var renderPattern = function(renderRange, pattern, triggered, playing) {
   if (pattern && pattern.transportRender) {
      
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
         beat: state.lastRenderEndBeat + bpmUtilities.msToBeats(beatsPerMinute, chunkMs)
      }
   };

   updateUI(renderRange);

   // render click(s)
   if (metronomeOn)
      renderMetronome(renderRange);

   // render patterns
   let appState = store.getState();
   _.each(patterns, (pattern, patternId) => {
      let patternState = _.find(appState.patterns, { id: patternId });
      let isStillPlaying = false;
      if (patternState && pattern && pattern.transportRender) {
         isStillPlaying = pattern.transportRender(
            renderRange, beatsPerMinute, midiOutPort, 
            patternState.channel, 
            patternState.triggered, 
            patternState.playing
         );
         if (isStillPlaying != patternState.playing)
            store.dispatch(actions.patternPlayState({ id: patternId, playing: isStillPlaying }));
      }
   });

   // update state
   state.lastRenderEndBeat = renderRange.end.beat;
   state.lastRenderEndTime = state.lastRenderEndTime + chunkMs;
};

var setOptions = function(options) {
   midiOutPort = options.port;
   metronomeNote = options.metronomeNote || 37; 
   metronomeChannel = options.metronomeChannel || 0; 
   if (options.metronomeOn != undefined)
      metronomeOn = options.metronomeOn; 
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
      metronomeChannel: midiUtilities.channelMap.drums,
      metronomeNote: midiUtilities.drumMap.stick,
      metronomeOn: false
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
module.exports.setBeatsPerMinute = setBeatsPerMinute;
module.exports.setOptions = setOptions;
module.exports.setPattern = setPattern;
