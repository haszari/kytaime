/*
Some fundamental bpm / tempo utilities.
*/

var bpmToMsPerBeat = function(bpm) {
   return (60 / bpm) * 1000;
};

var msToBeats = function(bpm, ms) {
   return (ms / 1000) / (60 / bpm);
};

var beatsToMs = function(bpm, beats) {
   return beats * (60 / bpm) * 1000;
};

// Determine whether a given beat position (value) occurs within a 
// beat range (renderStart - renderEnd), accounting for wrapping (looping).
// So for example:
// true = valueInWrappedBeatRange( 1.0, 3.97, 4.435, 4 )
// true = valueInWrappedBeatRange( 1.0, 3.97, 4.435, 8 )
function valueInWrappedBeatRange(value, renderStart, renderEnd, wrapDuration) {
   // standard case, end is after start
   var inRange = (
      (value >= renderStart) && 
      (value < renderEnd)
   );
   // loop case, end is before start because of loop
   // (this is probably dumb/naive maths ..)
   if ((renderEnd < renderStart) && !inRange) {
      inRange = (
         ( (value >= 0) && (value < renderEnd) ) ||
         ( (value >= renderStart) && (value < wrapDuration) )
      );
   }
   return inRange;
}

export default {
   valueInWrappedBeatRange,
   bpmToMsPerBeat,
   msToBeats,
   beatsToMs
};