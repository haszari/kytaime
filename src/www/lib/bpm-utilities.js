
var bpmToMsPerBeat = function(bpm) {
   return (60 / bpm) * 1000;
};

var msToBeats = function(bpm, ms) {
   return (ms / 1000) / (60 / bpm);
};

var beatsToMs = function(bpm, beats) {
   return beats * (60 / bpm) * 1000;
};

function valueInWrappedBeatRange(value, renderStart, renderEnd, patternDuration) {
   // standard case, end is after start
   var inRange = (
      (value >= renderStart) && 
      (value < renderEnd)
   );
   // loop case, end is before start because of loop
   if ((renderEnd < renderStart) && !inRange) {
      inRange = (
         ( (value >= 0) && (value < renderEnd) ) ||
         ( (value >= renderStart) && (value < patternDuration) )
      );
   }
   return inRange;
}


export {
   valueInWrappedBeatRange,
   bpmToMsPerBeat,
   msToBeats,
   beatsToMs
};