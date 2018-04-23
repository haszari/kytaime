import _ from 'lodash'; 

import { midiUtilities, bpmUtilities } from './sequencer';

const renderNotePattern = function(
   renderRange, beatsPerMinute, currentPhraseLength,
   midiOutPort, 
   patternData, // {notes, duration, startBeats, endBeats }
   channel, triggered, playing
) {
   // let isPlaying = playing;

   if (!midiOutPort)
      return false;

   if (!playing && !triggered) 
      return false;

   let patternDuration = patternData.duration;

   // start and end of render range in pattern-beats
   var renderStart = (renderRange.start.beat % patternData.duration);
   var renderEnd = (renderRange.end.beat % patternData.duration);

   let startStopInfo = bpmUtilities.renderPatternStartStop(
      renderRange, currentPhraseLength,
      playing, triggered, 
      renderStart, renderEnd,
      patternData.startBeats, patternData.endBeats
   );

   // trigger not happening yet
   if (!startStopInfo.isPlaying) {
      return startStopInfo.isPlaying;
   }

   var notes = patternData.notes || [];

   // get the notes that happen this render buffer
   notes = _.filter(notes, function(noteEvent) {
      return bpmUtilities.valueInWrappedBeatRange(
         noteEvent.start, 
         startStopInfo.unmuteStart, startStopInfo.unmuteEnd, 
         patternDuration
      );
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

         channel: patternChannel - 1,
         note: noteEvent.note,

         velocity: noteEvent.velocity, 
         duration: bpmUtilities.beatsToMs(beatsPerMinute, noteEvent.duration), 
         timestamp: renderRange.start.time + timestamp
      };
      // console.log(note.timestamp);

      midiUtilities.renderNote(note);
   }, _, patternData.duration, channel));

   return startStopInfo.isPlaying;
}

export default renderNotePattern;
