//module.exports.Note = class Note {} ?

import midiUtilities from './midi-utilities';
import * as bpmUtilities from './bpm-utilities';

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
   }

   transportRender(renderRange, beatsPerMinute, midiOutPort) {
      if (!midiOutPort)
         return;
      // console.log(renderRange);

      var patternNotes = this.notes || [];

      // get the notes that happen this render buffer
      var notes = _.filter(patternNotes, _.partial(function(noteEvent, patternDuration) {
         var loopStart = (renderRange.start.beat % patternDuration);
         var loopEnd = (renderRange.end.beat % patternDuration);

         var inRange = (
            (noteEvent.start >= loopStart) && 
            (noteEvent.start < loopEnd)
         );

         // account for crossing loop boundary
         if ((loopEnd < loopStart) && !inRange) {
            inRange = (
               ( (noteEvent.start >= 0) && (noteEvent.start < loopEnd) ) ||
               ( (noteEvent.start >= loopStart) && (noteEvent.start < patternDuration) )
            );
         }

         // console.log(noteEvent.start, inRange);
         return inRange;
      }, _, this.duration));

      // play em
      _.each(notes, _.partial(function(noteEvent, patternDuration, patternChannel) {
         var loopStart = (renderRange.start.beat % patternDuration);
         var loopEnd = (renderRange.end.beat % patternDuration);
         // console.log({
         //    loopStart: loopStart,
         //    loopEnd: loopEnd
         // })

         var beatOffset = noteEvent.start - loopStart;

         // account for crossing loop boundary
         if ((loopEnd < loopStart) && (noteEvent.start < loopStart)) {
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