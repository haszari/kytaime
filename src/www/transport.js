
var midiOutPort = null;
var metronomeChannel = 0;
var metronomeNote = 37;
var metronomeOn = true;

var WorkerSetInterval = require('worker!./worker-setInterval')

import midiUtilities from './midi-utilities';
import _ from 'lodash'; 

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

var bpmToMsPerBeat = function(bpm) {
   return (60 / bpm) * 1000;
};

var msToBeats = function(bpm, ms) {
   return (ms / 1000) / (60 / bpm);
};

var beatsToMs = function(bpm, beats) {
   return beats * (60 / bpm) * 1000;
};

var renderMetronome = function(renderRange) {
   if (!midiOutPort)
      return;

   for (var beat=Math.ceil(renderRange.start.beat); beat<renderRange.end.beat; beat++) {
      var beatOffset = beat - renderRange.start.beat;
      var timestamp = beatsToMs(beatsPerMinute, beatOffset);
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

var mapHitsToNotes = function(hitPattern, noteValue) {
   return _.map(hitPattern, function(noteEvent) {
      return _.extend({ 
         note: noteValue
      }, noteEvent);
   });
};
var renderPattern = function(renderRange, pattern) {
   if (!midiOutPort || !pattern)
      return;
   // console.log(renderRange);

   var patternNotes = pattern.notes || [];

   // map drum patterns to standard note patterns
   patternNotes = patternNotes.concat(mapHitsToNotes(pattern.kick, midiUtilities.drumMap.kick));
   patternNotes = patternNotes.concat(mapHitsToNotes(pattern.hat, midiUtilities.drumMap.hat));
   patternNotes = patternNotes.concat(mapHitsToNotes(pattern.clap, midiUtilities.drumMap.clap));
   patternNotes = patternNotes.concat(mapHitsToNotes(pattern.snare, midiUtilities.drumMap.snare));
   patternNotes = patternNotes.concat(mapHitsToNotes(pattern.stick, midiUtilities.drumMap.stick));

   // get the notes that happen this render buffer
   var notes = _.filter(patternNotes, _.partial(function(noteEvent, patternDuration) {
      var loopStart = (renderRange.start.beat % patternDuration);
      var loopEnd = (renderRange.end.beat % patternDuration);

      var inRange = (
         (noteEvent.start >= loopStart) && 
         (noteEvent.start < loopEnd)
      );

      // account for crossing loop boundary
      if ((loopEnd < loopStart) && !inRange) {
         inRange = (
            ( (noteEvent.start >= 0) && (noteEvent.start < loopEnd) ) ||
            ( (noteEvent.start >= loopStart) && (noteEvent.start < patternDuration) )
         );
      }

      // console.log(noteEvent.start, inRange);
      return inRange;
   }, _, pattern.duration));

   // play em
   _.each(notes, _.partial(function(noteEvent, patternDuration, patternChannel) {
      var loopStart = (renderRange.start.beat % patternDuration);
      var loopEnd = (renderRange.end.beat % patternDuration);
      // console.log({
      //    loopStart: loopStart,
      //    loopEnd: loopEnd
      // })

      var beatOffset = noteEvent.start - loopStart;

      // account for crossing loop boundary
      if ((loopEnd < loopStart) && (noteEvent.start < loopStart)) {
         beatOffset += patternDuration;
      }

      var timestamp = beatsToMs(beatsPerMinute, beatOffset);
      var note = { 
         port: midiOutPort, 

         channel: patternChannel,
         note: noteEvent.note,

         velocity: noteEvent.velocity, 
         duration: beatsToMs(beatsPerMinute, noteEvent.duration), 
         timestamp: renderRange.start.time + timestamp
      };
      // console.log(note.timestamp);

      midiUtilities.renderNote(note);
   }, _, pattern.duration, pattern.channel));
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
         beat: state.lastRenderEndBeat + msToBeats(beatsPerMinute, chunkMs)
      }
   };

   // render click(s)
   if (metronomeOn)
      renderMetronome(renderRange);

   // render patterns
   _.each(patterns, renderPattern.bind(null, renderRange));

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
};

var isPlaying = function() {
   return state.isPlaying;
};

var setPattern = function(patternDictionary) {
   patterns = _.extend(patterns, patternDictionary);
};

module.exports.start = startTempoClock;
module.exports.stop = stopTempoClock;
module.exports.isPlaying = isPlaying;
module.exports.setBeatsPerMinute = setBeatsPerMinute;
module.exports.setOptions = setOptions;
module.exports.setPattern = setPattern;
