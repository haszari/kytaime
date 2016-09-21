import _ from 'lodash'; 

import midiUtilities from './midi-utilities';
import * as bpmUtilities from './bpm-utilities';

class AutomationPattern {
   constructor(options) {
      options = options || {};
      this.duration = options.duration || 4;
      this.channel = options.channel || 0;
      this.points = options.notes || [
         { start: 0, controller: 0, value: 0 },
         { start: 4, controller: 0, value: 127 }
      ];

      // this.startBeats = options.startBeats || [ 0 ];
      // this.endBeats = options.endBeats || [ 0 ];

      this.playing = true;
      this.triggered = true;
   }

   transportRender(renderRange, beatsPerMinute, midiOutPort) {
      if (!midiOutPort)
         return;

      if (!this.playing && !this.triggered) 
         return;

      var patternDuration = this.duration;

      // start and end of render range in pattern-beats
      var renderStart = (renderRange.start.beat % this.duration);
      var renderEnd = (renderRange.end.beat % this.duration);

      // let's just render one point for each transportRender (for now!)
      var renderMiddle = ((renderEnd - renderStart) / 2) + renderStart;

      var sortedPoints = _.sortBy(this.points, 'start');

      var firstPointIndex = _.findIndex(sortedPoints, point => {
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
         var timestamp = (renderRange.end.time - renderRange.start.time) / 2;
         var interpRemainBeats = deltaBeats - (renderMiddle - at);
         var nextPart = interpRemainBeats / deltaBeats;
         nextPart = 1 - nextPart;
         var value = av + nextPart * (bv - av);
         var automation = {
            port: midiOutPort, 

            channel: 0, // tbc

            controller: 1, // tbc
            value: value, 

            timestamp: renderRange.start.time + timestamp
         };
         midiUtilities.renderController(automation);
         console.log(timestamp, value);
      }


      
   }
};

export default AutomationPattern;