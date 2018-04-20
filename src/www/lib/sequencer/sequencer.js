var WorkerSetInterval = require('worker!./worker-setInterval')

import _ from 'lodash'; 

import WebMidiHelper from './web-midi-helper';
import midiUtilities from './midi-utilities';
import * as bpmUtilities from './bpm-utilities';


// this metronome stuff is like a mini client; not core sequencer
var metronomeChannel = 0;
var metronomeNote = 37;
var metronomeOn = true;

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
   _.map(renderCallbacks, (renderFunc, id) => {
      renderFunc(renderRange);
   } );
   // kytaimeSequencerCallback(renderRange);


   // update state
   state.lastRenderEndBeat = renderRange.end.beat;
   state.lastRenderEndTime = state.lastRenderEndTime + chunkMs;
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

// function initialiseTransport() {
//    setOptions({
//       port: midiOutPort,
//    });
//    // transport.start();
// }




/// EXPORTS
// which of these exports are core (library) sequencer and which are kytaime patterns reality?

// core / lib
module.exports.start = startTempoClock;
module.exports.stop = stopTempoClock;
module.exports.isPlaying = isPlaying;
// module.exports.setOptions = setOptions;
// module.exports.getMidiOut = getMidiOut;
// module.exports.setMidiOut = setMidiOut;
module.exports.setRenderCallback = setRenderCallback;
module.exports.removeRenderCallback = removeRenderCallback;

