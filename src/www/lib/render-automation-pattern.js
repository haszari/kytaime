import _ from 'lodash'; 

import midiUtilities from './midi-utilities';
import * as bpmUtilities from './bpm-utilities';

const ccTimeResolution = 0.05; // beats
function ceilBeats(beats) {
   return Math.ceil(beats / ccTimeResolution) * ccTimeResolution;  
}
function floorBeats(beats) {
   return Math.floor(beats / ccTimeResolution) * ccTimeResolution;  
}


let renderSingleCC = function(channel, patternData, renderRange, beatsPerMinute, midiOutPort) {
   // start and end of render range in pattern-beats
   var renderStart = (renderRange.start.beat % patternData.duration);
   var renderEnd = (renderRange.end.beat % patternData.duration);

   for (
      var renderMiddle = ceilBeats(renderStart); 
      renderMiddle <= floorBeats(renderEnd); 
      renderMiddle += ccTimeResolution) {
   
      var sortedPoints = _.sortBy(patternData.points, 'start');

      var firstPointIndex = _.findLastIndex(sortedPoints, point => {
         return (point.start <= renderMiddle);
      });
      var lastPointIndex = _.findIndex(sortedPoints, point => {
         return (point.start >= renderMiddle);
      });

      if ((firstPointIndex != -1) && (lastPointIndex != -1)) {
         var firstPoint = sortedPoints[firstPointIndex];
         var lastPoint = sortedPoints[lastPointIndex];
         var at = firstPoint.start, bt = lastPoint.start;
         var deltaBeats = bt - at;
         var av = firstPoint.value, bv = lastPoint.value;
         var timestamp = bpmUtilities.beatsToMs(beatsPerMinute, renderMiddle - renderStart); 
         var interpRemainBeats = deltaBeats - (renderMiddle - at);
         var nextPart = interpRemainBeats / deltaBeats;
         nextPart = 1 - nextPart;
         var value = av + nextPart * (bv - av);
         var automation = {
            port: midiOutPort, 

            channel: channel,

            controller: patternData.controller,
            value: Math.round(value), 

            timestamp: renderRange.start.time + timestamp
         };
         midiUtilities.renderController(automation);
      }
   }
}

const renderAutomationPattern = function(
   renderRange, beatsPerMinute, midiOutPort, 
   patternData, // {controller, points, duration, startBeats, endBeats }
   channel, triggered, playing
) {
   let isPlaying = playing;

   if (!midiOutPort)
      return isPlaying;

   if (!playing && !triggered) 
      return isPlaying;

   var patternDuration = patternData.duration;

   // start and end of render range in pattern-beats
   var renderStart = (renderRange.start.beat % patternData.duration);
   var renderEnd = (renderRange.end.beat % patternData.duration);

   // the start and end of notes we will allow to play (used to implement drop-on-0, cut-on-end/0)
   var unmuteStart = renderStart;
   var unmuteEnd = renderEnd;

   // see if we are going to drop (% duration) this render buffer
   if (!playing && triggered) {
      var triggerStart = _.find(patternData.startBeats, function(startBeat) {
         return bpmUtilities.valueInWrappedBeatRange(startBeat, renderStart, renderEnd, patternDuration);
      });
      if (!_.isUndefined(triggerStart)) {
         unmuteStart = triggerStart;
         isPlaying = true; // strictly, this becomes true part way through..
      }
   }
   
   // see if we are going to undrop (% duration) this render buffer
   if (playing && !triggered) {
      var triggerEnd = _.find(patternData.endBeats, function(beat) {
         return bpmUtilities.valueInWrappedBeatRange(beat, renderStart, renderEnd, patternDuration);
      });
      if (!_.isUndefined(triggerEnd)) {
         unmuteEnd = triggerEnd;
         isPlaying = false;
      }
   }

   // trigger not happening yet
   if (!isPlaying) {
      return isPlaying;
   }

   renderSingleCC(channel, patternData, renderRange, beatsPerMinute, midiOutPort);      

   return isPlaying;
}

export default renderAutomationPattern;
