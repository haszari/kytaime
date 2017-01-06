import _ from 'lodash'; 

import midiUtilities from './midi-utilities';
import * as bpmUtilities from './bpm-utilities';

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

class NotePattern {
   constructor(options) {
      options = options || {};
      this.duration = options.duration || 4;
      this.channel = options.channel || 0;
      this.notes = options.notes || [
         { start: 0, duration: 1, note: 42, velocity: 100 },
         { start: 1, duration: 1, note: 42, velocity: 100 },
         { start: 2, duration: 1, note: 42, velocity: 100 },
         { start: 3, duration: 1, note: 42, velocity: 100 }
      ];

      this.startBeats = options.startBeats || [ 0 ];
      this.endBeats = options.endBeats || [ 0 ];

      // this.playing = true;
      // this.triggered = true;
   }

   transportRender(renderRange, beatsPerMinute, midiOutPort, triggered, playing) {
      let isPlaying = playing;

      if (!midiOutPort)
         return isPlaying;

      if (!playing && !triggered) 
         return isPlaying;

      var patternDuration = this.duration;

      // start and end of render range in pattern-beats
      var renderStart = (renderRange.start.beat % this.duration);
      var renderEnd = (renderRange.end.beat % this.duration);

      // the start and end of notes we will allow to play (used to implement drop-on-0, cut-on-end/0)
      var unmuteStart = renderStart;
      var unmuteEnd = renderEnd;

      // see if we are going to drop (% duration) this render buffer
      if (!playing && triggered) {
         var triggerStart = _.find(this.startBeats, function(startBeat) {
            return valueInWrappedBeatRange(startBeat, renderStart, renderEnd, patternDuration);
         });
         if (!_.isUndefined(triggerStart)) {
            unmuteStart = triggerStart;
            isPlaying = true; // strictly, this becomes true part way through..
         }
      }
      
      // see if we are going to undrop (% duration) this render buffer
      if (playing && !triggered) {
         var triggerEnd = _.find(this.endBeats, function(beat) {
            return valueInWrappedBeatRange(beat, renderStart, renderEnd, patternDuration);
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

      var notes = this.notes || [];

      // get the notes that happen this render buffer
      notes = _.filter(notes, function(noteEvent) {
         return valueInWrappedBeatRange(noteEvent.start, unmuteStart, unmuteEnd, patternDuration);
      });

      // play em
      _.each(notes, _.partial(function(noteEvent, patternDuration, patternChannel) {
         var beatOffset = noteEvent.start - renderStart;

         // account for crossing loop boundary
         if ((renderEnd < renderStart) && (noteEvent.start < renderStart)) {
            beatOffset += patternDuration;
         }

         var timestamp = bpmUtilities.beatsToMs(beatsPerMinute, beatOffset);
         var note = { 
            port: midiOutPort, 

            channel: patternChannel,
            note: noteEvent.note,

            velocity: noteEvent.velocity, 
            duration: bpmUtilities.beatsToMs(beatsPerMinute, noteEvent.duration), 
            timestamp: renderRange.start.time + timestamp
         };
         // console.log(note.timestamp);

         midiUtilities.renderNote(note);
      }, _, this.duration, this.channel));

      return isPlaying;
   }
};

export default NotePattern;