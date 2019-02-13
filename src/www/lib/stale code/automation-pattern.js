

class AutomationPattern {
   constructor(options) {
      options = options || {};
      this.duration = options.duration || 4;
      this.controller = options.controller || 0;
      this.points = options.points || [
         { start: 0, value: 20 },
         { start: 3.9, value: 100 },
      ];

      this.startBeats = options.startBeats || [ 0 ];
      this.endBeats = options.endBeats || [ 0 ];
   }
}

export default AutomationPattern;