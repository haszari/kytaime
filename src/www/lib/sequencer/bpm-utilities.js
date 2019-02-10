
import _ from 'lodash'; 


var bpmToMsPerBeat = function(bpm) {
   return (60 / bpm) * 1000;
};

var msToBeats = function(bpm, ms) {
   return (ms / 1000) / (60 / bpm);
};

var beatsToMs = function(bpm, beats) {
   return beats * (60 / bpm) * 1000;
};

function valueInWrappedBeatRange(value, renderStart, renderEnd, wrapDuration) {
   // standard case, end is after start
   var inRange = (
      (value >= renderStart) && 
      (value < renderEnd)
   );
   // loop case, end is before start because of loop
   if ((renderEnd < renderStart) && !inRange) {
      inRange = (
         ( (value >= 0) && (value < renderEnd) ) ||
         ( (value >= renderStart) && (value < wrapDuration) )
      );
   }
   return inRange;
}

// I pasted this method aroujnd the place but I don't think anyone's using it?
//  in  throwdown & squelcherisation at least
// function getWrappedTimeOffsetForBeat(eventBeat, renderStart, renderEnd, transportBpm, wrapBeats) {  
//   let beatOffset = eventBeat - renderStart;
//   if ((renderEnd < renderStart) && (eventBeat < renderStart)) {
//       beatOffset += wrapBeats;
//   }
//   var offsetMs = beatsToMs(transportBpm, beatOffset);
//   return offsetMs;
// }



const renderPatternStartStop = function(
   renderRange, patternDropStopModulus,
   isPlaying, isTriggered, 
   renderStart, renderEnd, 
   startBeats, endBeats
) {
   startBeats = startBeats || [ 0 ];
   endBeats = endBeats || [ 0 ];


   let startStopInfo = {
      isPlaying: isPlaying,
   
      // the start and end of notes we will allow to play (used to implement drop-on-0, cut-on-end/0)
      unmuteStart: renderStart,
      unmuteEnd: renderEnd
   }

   // render range in terms of phrase length
   var phrase = {
      renderStart: (renderRange.start.beat % patternDropStopModulus),
      renderEnd: (renderRange.end.beat % patternDropStopModulus)
   };

   // see if we are going to drop (% duration) this render buffer
   if (!startStopInfo.isPlaying && isTriggered) {
      var triggerStart = _.find(startBeats, function(startBeat) {
         // might need to express start & stop relative to loop/phrase, i.e. negative for mute early, positive to stop during next bar/phrase
         return valueInWrappedBeatRange(
            startBeat, phrase.renderStart, phrase.renderEnd, 
            patternDropStopModulus
         );
      });
      if (!_.isUndefined(triggerStart)) {
         startStopInfo.unmuteStart = triggerStart;
         startStopInfo.isPlaying = true; // strictly, this becomes true part way through..
      }
   }
   
   // see if we are going to undrop (% duration) this render buffer
   if (startStopInfo.isPlaying && !isTriggered) {
      var triggerEnd = _.find(endBeats, function(beat) {
         return valueInWrappedBeatRange(beat, 
            phrase.renderStart, phrase.renderEnd, 
            patternDropStopModulus
         );
      });
      if (!_.isUndefined(triggerEnd)) {
         startStopInfo.unmuteEnd = triggerEnd;
         startStopInfo.isPlaying = false;
      }
   }
   return startStopInfo;
}


export {
   renderPatternStartStop,
   valueInWrappedBeatRange,
   // getWrappedTimeOffsetForBeat,
   bpmToMsPerBeat,
   msToBeats,
   beatsToMs
};