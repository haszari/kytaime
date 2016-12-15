import NotePattern from './note-pattern';
import AutomationPattern from './automation-pattern';
import midiUtilities from './midi-utilities';

// default pattern is 4 x hats
export const hats = new NotePattern();

// custom bass pattern
export const bassline = new NotePattern({
   duration: 8,
   channel: midiUtilities.channelMap.bass,
   notes: [
      { start: 0, duration: 1, note: 36, velocity: 100 },
      { start: 1.5, duration: 1, note: 36, velocity: 100 },
      { start: 3, duration: 1, note: 36, velocity: 100 },

      { start: 4.55, duration: 1, note: 36, velocity: 100 },
      { start: 6, duration: 1, note: 47, velocity: 90 },
      { start: 7.59, duration: 0.5, note: 48, velocity: 80 },
   ],
   endBeats: [ 0, 7.5 ]
});

// custom beat pattern
var halfOff = 0.64;
var snarePull = -0.02;
export const beat = new NotePattern({
   duration: 4,
   channel: midiUtilities.channelMap.drums,
   notes: [
      { start: 0, duration: 1, note: midiUtilities.drumMap.kick, velocity: 100 },
      { start: 1, duration: 1, note: midiUtilities.drumMap.kick, velocity: 100 },
      { start: 2, duration: 1, note: midiUtilities.drumMap.kick, velocity: 100 },
      { start: 3, duration: 1, note: midiUtilities.drumMap.kick, velocity: 100 },

      { start: 0 + halfOff, duration: 0.25, note: midiUtilities.drumMap.hat, velocity: 100 },
      { start: 1 + halfOff, duration: 0.25, note: midiUtilities.drumMap.hat, velocity: 100 },
      { start: 2 + halfOff, duration: 0.25, note: midiUtilities.drumMap.hat, velocity: 100 },
      { start: 3 + halfOff, duration: 0.25, note: midiUtilities.drumMap.hat, velocity: 100 },

      { start: 1 + snarePull, duration: 1, note: midiUtilities.drumMap.clap, velocity: 100 },
      { start: 3 + snarePull, duration: 1, note: midiUtilities.drumMap.clap, velocity: 100 },

      { start: 3, duration: 1, note: midiUtilities.drumMap.stick, velocity: 110 },
   ],
   startBeats: [ 0, 1 + snarePull, 3 + snarePull ]   
});

// custom lead pattern
export const lead = new NotePattern({
   duration: 16,
   channel: midiUtilities.channelMap.saw,
   notes: [
      { start: 0, duration: 7, note: 36, velocity: 50 },
      { start: 4, duration: 7, note: 42, velocity: 50 },
      { start: 8, duration: 7, note: 48, velocity: 50 },
      { start: 12 + halfOff, duration: 0.5, note: 46, velocity: 60 },
      { start: 15 + halfOff, duration: 0.5, note: 43, velocity: 60 },
   ],
   startBeats: [ 0, 12 ],   
   endBeats: [ 12 ]
});

export const send = new AutomationPattern({
   duration: 128,
   controller: 0,
   points: [
      { start: 5, value: 0 },
      { start: 6, value: 120 },
      { start: 7, value: 1 },

      { start: 31, value: 1 },
      { start: 30, value: 100 },
      { start: 33, value: 1 },

      { start: 100, value: 12 },
      { start: 120, value: 127 },
      { start: 127, value: 3 },
   ]
});
export const filter = new AutomationPattern({
   duration: 32, 
   controller: 20,
   points: [
      { start: 0, value: 120 },
      { start: 16, value: 12 },
      { start: 32, value: 120 }
   ]
});

