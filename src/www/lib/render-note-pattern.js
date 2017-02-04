import _ from 'lodash'; 

import midiUtilities from './midi-utilities';
import * as bpmUtilities from './bpm-utilities';

const renderNotePattern = function(
   renderRange, beatsPerMinute, midiOutPort, 
   patternData, // {notes, duration, startBeats, endBeats }
   channel, triggered, playing
) {
   let isPlaying = playing;

   if (!midiOutPort)
      return isPlaying;

   if (!playing && !triggered) 
      return isPlaying;

   let patternDuration = patternData.duration;

   // set phrase to 32 to get phrase mod stop/start working
   // (in future calculate it from the patterns that are playing)
   let phraseDuration = 32;
   let patternDropStopModulus = phraseDuration;

   // start and end of render range in pattern-beats
   var renderStart = (renderRange.start.beat % patternData.duration);
   var renderEnd = (renderRange.end.beat % patternData.duration);

   // and in phrase-beats
   var phrase = {
      renderStart: (renderRange.start.beat % patternDropStopModulus),
      renderEnd: (renderRange.end.beat % patternDropStopModulus)
   };

   // the start and end of notes we will allow to play (used to implement drop-on-0, cut-on-end/0)
   var unmuteStart = renderStart;
   var unmuteEnd = renderEnd;

   // see if we are going to drop (% duration) this render buffer
   if (!playing && triggered) {
      var triggerStart = _.find(patternData.startBeats, function(startBeat) {
         // might need to express start & stop relative to loop/phrase, i.e. negative for mute early, positive to stop during next bar/phrase
         return bpmUtilities.valueInWrappedBeatRange(startBeat, phrase.renderStart, phrase.renderEnd, patternDropStopModulus);
      });
      if (!_.isUndefined(triggerStart)) {
         unmuteStart = triggerStart;
         isPlaying = true; // strictly, this becomes true part way through..
      }
   }
   
   // see if we are going to undrop (% duration) this render buffer
   if (playing && !triggered) {
      var triggerEnd = _.find(patternData.endBeats, function(beat) {
         return bpmUtilities.valueInWrappedBeatRange(beat, phrase.renderStart, phrase.renderEnd, patternDropStopModulus);
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

   var notes = patternData.notes || [];

   // get the notes that happen this render buffer
   notes = _.filter(notes, function(noteEvent) {
      return bpmUtilities.valueInWrappedBeatRange(noteEvent.start, unmuteStart, unmuteEnd, patternDuration);
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

   return isPlaying;
}

export default renderNotePattern;
