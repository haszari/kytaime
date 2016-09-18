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

      this.playing = false;
      // this.triggered = false;
   }

   transportRender(renderRange, beatsPerMinute, midiOutPort) {
      if (!midiOutPort)
         return;

      if (!this.playing) 
         return;
      
      var patternNotes = this.notes || [];

      // start and end of render range in beats
      const renderStart = (renderRange.start.beat % this.duration);
      const renderEnd = (renderRange.end.beat % this.duration);

      // get the notes that happen this render buffer
      var notes = _.filter(patternNotes, _.partial(function(noteEvent, patternDuration) {
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