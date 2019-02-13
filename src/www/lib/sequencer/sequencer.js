
import _ from 'lodash'; 

// import WebMidiHelper from './web-midi-helper';
// import midiUtilities from './midi-utilities';
// import * as bpmUtilities from './bpm-utilities';
// import * as midiOutputs from './web-midi-helper';

var WorkerSetInterval = require('./setInterval.worker');

let AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;
audioContext = new AudioContext(); // this will start "paused"

// this metronome stuff is like a mini client; not core sequencer
// var metronomeChannel = 0;
// var metronomeNote = 37;
// var metronomeOn = true;

// how often we ideally want to call our note renderer
var renderInterval = 200;
// longer period of notes to render to cover potential sloppy timing between render callbacks
var renderOverlap = renderInterval * 0.2;

let renderCallbacks = {};

function setRenderCallback(callbackId, callbackFunction) {
   renderCallbacks[callbackId] = callbackFunction;
}


function removeRenderCallback(callbackId) {
   setRenderCallback(callbackId, undefined);
}

// var midiOutPort = null;
// let midiOutDevice = "";

// function getMidiOut() { return midiOutDevice; };
// function setMidiOut(requestedPortName) {
//   midiOutputs.openMidiOutput({
//     deviceName: requestedPortName,
//     callback: function(info) {
//      if (info.port) {
//       midiOutPort = info.port;
//       console.log("Using " + midiOutPort.name);
//       midiOutDevice = midiOutPort.name;
//       }
//     }.bind(this)
//   });
// }


// sequencer state that is carried between render callbacks
var state = {
   isPlaying: false,
   // lastRenderEndBeat: 0,
   lastRenderEndTime: 0,
   intervalId: null,
   
   // tempo was previously stored in client app redux store; we need to take control of it
   // clients will have to schedule events to update the transport tempo
   // tempoBpm: 121, 
};
var updateTransport = function() {
  audioContext.resume().then(function() {

    // get the current time in milliseconds (since page/app began)
    var now = window.performance.now();

    // determine the period we need to render
    // start & end, duration in milliseconds
    var renderStart = state.lastRenderEndTime;
    var renderEnd = now + renderInterval + renderOverlap;
    var chunkMs = renderEnd - renderStart;

    // 
    if (chunkMs <= 0)
      return;

    var audioNow = audioContext.currentTime;
    var offsetMilliseconds = audioNow * 1000 - now;

    var renderRange = {
      // midiOutPort: midiOutPort,
      audioContext: audioContext,

      audioContextTimeOffsetMsec: offsetMilliseconds, 

      start: renderStart,
      end: renderEnd,
    };

    // tell the client(s) to do their thing
    _.map(renderCallbacks, (renderFunc, id) => {
      renderFunc(renderRange);
    } );

    // update state
    state.lastRenderEndTime = renderRange.end;
  });
};

var worker = new WorkerSetInterval;
// worker.postMessage();
worker.addEventListener('message', function(e) {
   // console.log('Worker said: ', e.data);
   if (e.data == 'updateMetronome') {
      updateTransport();
   }
}, false);

// var setTempo = function( newTempo ) {
//   state.tempoBpm = newTempo;
// }

// var getTempo = function(  ) {
//   return state.tempoBpm;
// }


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
};

var isPlaying = function() {
   return state.isPlaying;
};

export default {
  start: startTempoClock,
  stop: stopTempoClock,
  // setTempo: setTempo,
  // getTempo: getTempo,
  isPlaying: isPlaying,
  setRenderCallback: setRenderCallback,
  removeRenderCallback: removeRenderCallback,
  audioContext: audioContext,
  // setMidiOut: setMidiOut,
  // getMidiOut: getMidiOut,
};
