/*
Import a midi file and convert it into JS midi data that we can play.

see also NotePattern, renderNotePattern
*/

import MIDIFile from 'midifile';
import MIDIEvents from 'midievents';
import _ from 'lodash';

/*
// we want to convert our midi to something like this
{
   duration: 16,
   notes: [
      { start: 0, duration: 7, note: 36, velocity: 50 },
      { start: 4, duration: 7, note: 42, velocity: 50 },
      { start: 8, duration: 7, note: 48, velocity: 50 },
      { start: 12 + halfOff, duration: 0.5, note: 46, velocity: 60 },
      { start: 15 + halfOff, duration: 0.5, note: 43, velocity: 60 },
   ],
   startBeats: [ 0, 12 ],
   endBeats: [ 12 ]
}
*/

// Process a MIDIFile ('midifile' 3rd party lib) into something we can play.
// - converts time to beats
// - filters out events that aren't notes
// - pairs up note on and note off events, calculates duration
// - if specified, offset (beats) is subtracted from the start of every event (if your midi file starts later in the timeline)
// returns something that looks like a NotePattern
function convertMidiToObject( midiFile, offset ) {
  const beatOffset = offset || 0;
  var pattern = {
    duration: 4,
    notes: [],
  };
  var allEvents = midiFile.getMidiEvents();
  var ticksPerBeat = midiFile.header.getTicksPerBeat();
  var current = 0;
  allEvents = _.map( allEvents, event => {
    current += event.delta;
    event.beats = current / ticksPerBeat;
    return event;
  } );
  var noteOns = _.filter( allEvents, event => {
    return ( event.subtype === MIDIEvents.EVENT_MIDI_NOTE_ON );
  } );
  var noteOffs = _.filter( allEvents, event => {
    if ( event.subtype === MIDIEvents.EVENT_MIDI_NOTE_OFF ) { return true; }
    return (
      ( event.subtype === MIDIEvents.EVENT_MIDI_NOTE_ON ) &&
         ( event.param2 === 0 )
    );
  } );
  _.each( noteOns, noteOnEvent => {
    var subsequentNoteOffs = _.filter( noteOffs, noteOffEvent => {
      if ( noteOffEvent.param1 !== noteOnEvent.param1 ) { return false; }
      return ( noteOffEvent.playTime > noteOnEvent.playTime );
    } );
    subsequentNoteOffs = _.sortBy( subsequentNoteOffs, 'playTime' );
    if ( subsequentNoteOffs.length > 0 ) {
      var noteOffEvent = subsequentNoteOffs[0];
      pattern.notes.push( {
        note: noteOnEvent.param1,
        velocity: noteOnEvent.param2,
        duration: noteOffEvent.beats - noteOnEvent.beats,
        start: noteOnEvent.beats - beatOffset,
      } );
    }
  } );
  // determine pattern length, by the start of the last note
  pattern.duration = _.reduce( pattern.notes, ( state, note ) => {
    return Math.max( state, note.start );
  }, pattern.duration );
  // round to a power of 2 (1 / 2 / 4 / 8 / 16) beats
  pattern.duration = Math.pow( 2, Math.ceil( Math.log( pattern.duration ) / Math.log( 2 ) ) );
  return pattern;
}

function importMidiFile( buffer, offset ) {
  var midiFile = new MIDIFile( buffer );
  return convertMidiToObject( midiFile, offset );
}

export default importMidiFile;
