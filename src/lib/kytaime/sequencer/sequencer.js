/*
Kytaime sequencer core.

Doesn't sequence anything on its own, but sets up everything so an app
can sequence midi and audio reliably and accurately.

This doesn't provide any tempo / beat / pattern sequencing. Use this in
conjunction with pattern-sequencer.
*/

import _ from 'lodash';

import WorkerSetInterval from './setInterval.worker';

const AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;
audioContext = new AudioContext(); // this will start "paused"

// -----------------------------------------------
// --- render interval settings ---

// How often we ideally want to call our note renderer (milliseconds).
const renderInterval = 200;
// We render a slightly longer period of notes to cover any potential
// sloppy timing between render callbacks.
const renderOverlap = renderInterval * 0.2;

// A string message used to identify our web worker interval callback.
const webWorkerTimerMessage = 'kytaime-sequencer-update';

// -----------------------------------------------
// --- render callbacks ---

// Client app can set up as many render callbacks as they like.
// This library will call these, and pass them all they need to
// render accurately sequenced midi and audio.

// Render callback is passed an object:
// {
//   audioContext: audioContext, // there can only be one, and we need it to implement accurate timing, so we own it, and pass to clients
//   audioContextTimeOffsetMsec: offsetMilliseconds, // the difference in timing between midi and audio events; add this to any scheduled audio events
//   start: renderStart, // render period start time in milliseconds
//   end: renderEnd, // render period end time in milliseconds
// }

const renderCallbacks = {};

function setRenderCallback( callbackId, callbackFunction ) {
  renderCallbacks[callbackId] = callbackFunction;
}

function removeRenderCallback( callbackId ) {
  setRenderCallback( callbackId, undefined );
}

// -----------------------------------------------
// --- internal sequencer state ---

var state = {
  isPlaying: false,
  lastRenderEndTime: 0,
  intervalId: null,
};

// -----------------------------------------------
// --- internal sequencer render callback ---

// Determines the exact time period that should be rendered and
// calls through to any registered renderCallbacks.

var updateTransport = function() {
  audioContext.resume().then( function() {
    // determine difference between midi now and audio now, so midi and audio events line up
    const perfNow = window.performance.now();
    const audioNow = audioContext.currentTime;
    // this delay will be applied to midi notes
    const audioContextOffsetSec = ( perfNow / 1000.0 ) - audioNow;

    // determine the period we need to render
    // start & end, duration in milliseconds
    var renderStart = state.lastRenderEndTime;
    var renderEnd = perfNow + renderInterval + renderOverlap;
    var chunkMs = renderEnd - renderStart;

    // we're getting ahead of ourselves, chill out
    // time keeps on slipping, slipping
    // into the future
    if ( chunkMs <= 0 ) { return; }

    // tell the client(s) to do their thing
    _.map( renderCallbacks, ( renderFunc ) => {
      renderFunc( {
        audioContext: audioContext,

        // All the following values are in msec.

        // The start & end time to render in msec - these are in the future.
        start: renderStart,
        end: renderEnd,

        // The actual current time in msec - used to update UI in sync with scheduled audio/midi.
        actualNow: perfNow,

        // An offset to apply to midi events to keep them in sync with audio.
        // This is the effective latency.
        midiEventOffset: audioContextOffsetSec * 1000,
      } );
    } );

    // update state
    state.lastRenderEndTime = renderEnd;
  } );
};

// -----------------------------------------------
// --- timer machinery ---

// this calls us reliably often - like setInterval but more reliable & consistent

var worker = new WorkerSetInterval();
// worker.postMessage();
worker.addEventListener( 'message', function( e ) {
  // console.log('Worker said: ', e.data);
  if ( e.data === webWorkerTimerMessage ) {
    updateTransport();
  }
}, false );

// -----------------------------------------------
// --- sequencer interface – start & stop, play state ---

// note that 'start' & 'stop' are hard-coded in setInterval.worker.js

var startTempoClock = function() {
  state.isPlaying = true;

  // let's start the tempoclock NOW
  state.lastRenderEndTime = window.performance.now();
  updateTransport();

  // now loop forever
  worker.postMessage( {
    type: 'start',
    interval: renderInterval,
    message: webWorkerTimerMessage,
  } );
};

var stopTempoClock = function() {
  // kill timer
  worker.postMessage( {
    type: 'stop',
  } );

  // reset state
  state = {
    isPlaying: false,
    lastRenderEndTime: 0,
    intervalId: null,
  };
};

var isPlaying = function() {
  return state.isPlaying;
};

// -----------------------------------------------
// --- export quality ---

export default {
  start: startTempoClock,
  stop: stopTempoClock,
  isPlaying: isPlaying,
  setRenderCallback: setRenderCallback,
  removeRenderCallback: removeRenderCallback,
  audioContext: audioContext,
};
