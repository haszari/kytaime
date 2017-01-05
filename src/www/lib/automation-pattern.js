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


class AutomationPattern {
   constructor(options) {
      options = options || {};
      this.duration = options.duration || 4;
      this.channel = options.channel || 0;
      this.controller = options.controller || 0;
      this.points = options.points || [
         { start: 0, value: 0 },
         { start: 4, value: 127 }
      ];

      // this.startBeats = options.startBeats || [ 0 ];
      // this.endBeats = options.endBeats || [ 0 ];

      this.playing = true;
      this.triggered = true;
   }

   renderSingleCC(ccPoints, renderRange, beatsPerMinute, midiOutPort) {
      // start and end of render range in pattern-beats
      var renderStart = (renderRange.start.beat % this.duration);
      var renderEnd = (renderRange.end.beat % this.duration);

      for (
         var renderMiddle = ceilBeats(renderStart); 
         renderMiddle <= floorBeats(renderEnd); 
         renderMiddle += ccTimeResolution) {
      
         var sortedPoints = _.sortBy(ccPoints, 'start');

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

               channel: this.channel,

               controller: this.controller,
               value: Math.round(value), 

               timestamp: renderRange.start.time + timestamp
            };
            midiUtilities.renderController(automation);
            // console.log(timestamp, value);
         }
      }
   }

   transportRender(renderRange, beatsPerMinute, midiOutPort) {
      if (!midiOutPort)
         return;

      if (!this.playing && !this.triggered) 
         return;

      this.renderSingleCC(this.points, renderRange, beatsPerMinute, midiOutPort);      
   }
};

export default AutomationPattern;