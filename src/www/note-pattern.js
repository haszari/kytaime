import _ from 'lodash'; 

import midiUtilities from './midi-utilities';
import * as bpmUtilities from './bpm-utilities';

function valueInModBeatRange(value, renderStart, renderEnd) {
   // standard case, end is after start
   var inRange = (
      (value >= renderStart) && 
      (value < renderEnd)
   );
   // loop case, end is before start because of loop
   if ((renderEnd < renderStart) && !inRange) {
      inRange = (
         ( (noteEvent.start >= 0) && (noteEvent.start < renderEnd) ) ||
         ( (noteEvent.start >= renderStart) && (noteEvent.start < patternDuration) )
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

      this.playing = false;
      this.triggered = false;
   }

   transportRender(renderRange, beatsPerMinute, midiOutPort) {
      if (!midiOutPort)
         return;

      if (!this.playing && !this.triggered) 
         return;

      // start and end of render range in pattern-beats
      var renderStart = (renderRange.start.beat % this.duration);
      var renderEnd = (renderRange.end.beat % this.duration);

      // the start and end of notes we will allow to play (used to implement drop-on-0, cut-on-end/0)
      var unmuteStart = renderStart;
      var unmuteEnd = renderEnd;

      // see if we are going to drop (% duration) this render buffer
      if (!this.playing && this.triggered) {
         // this is a cheaty test for "is 0 within render range"
         // in future I'll want "is 0 or other valid drop start pos in render range" 
         // so will need a isWithinRange thing
         if (renderStart > renderEnd) {
            unmuteStart = 0;
            this.playing = true; // strictly, this becomes true part way through..
         }
      }
      
      // see if we are going to undrop (% duration) this render buffer
      if (this.playing && !this.triggered) {
         if (renderStart > renderEnd) {
            unmuteEnd = 0;
            this.playing = false;
         }
      }

      // trigger not happening yet
      if (!this.playing) {
         return;
      }

      var notes = this.notes || [];

      // filter out the notes that are before we are dropped (or after we are cut)
      // ahem, exact same logic as filtering the notes to play for the renderbuffer below
      // factor this logic into a function
      notes = _.filter(notes, _.partial(function(noteEvent, patternDuration) {
         var inRange = (
            (noteEvent.start >= unmuteStart) && 
            (noteEvent.start < unmuteEnd)
         );
         // account for crossing loop boundary
         if ((unmuteEnd < unmuteStart) && !inRange) {
            inRange = (
               ( (noteEvent.start >= 0) && (noteEvent.start < unmuteEnd) ) ||
               ( (noteEvent.start >= unmuteStart) && (noteEvent.start < patternDuration) )
            );
         }
         return inRange;
      }, _, this.duration));

      // get the notes that happen this render buffer
      notes = _.filter(notes, _.partial(function(noteEvent, patternDuration) {
         var inRange = (
            (noteEvent.start >= renderStart) && 
            (noteEvent.start < renderEnd)
         );

         // account for crossing loop boundary
         if ((renderEnd < renderStart) && !inRange) {
            inRange = (
               ( (noteEvent.start >= 0) && (noteEvent.start < renderEnd) ) ||
               ( (noteEvent.start >= renderStart) && (noteEvent.start < patternDuration) )
            );
         }

         // console.log(noteEvent.start, inRange);
         return inRange;
      }, _, this.duration));

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

   }
};

export default NotePattern;