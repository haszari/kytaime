
var bpmToMsPerBeat = function(bpm) {
   return (60 / bpm) * 1000;
};

var msToBeats = function(bpm, ms) {
   return (ms / 1000) / (60 / bpm);
};

var beatsToMs = function(bpm, beats) {
   return beats * (60 / bpm) * 1000;
};

export {
   bpmToMsPerBeat,
   msToBeats,
   beatsToMs
};