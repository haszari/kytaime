
import * as midiUtilities from '../../lib/sequencer/midi-utilities';
import * as patternSequencer from '../../lib/sequencer/pattern-sequencer';

const swing = 0.14;

let pattern = {
  duration: 4,
  startBeats: [0, 0.98], // start on first kick or snare
  endBeats: [0.49], // always end on a 1
  notes: [
    { 
      start: 0, 
      duration: 1, 
      note: 36, 
      velocity: 100 
      },
    { 
      start: 1, 
      duration: 1, 
      note: 36, 
      velocity: 100 
      },
    { 
      start: 2, 
      duration: 1, 
      note: 36, 
      velocity: 100 
      },
    { 
      start: 3, 
      duration: 1, 
      note: 36, 
      velocity: 100 
      },

    { 
      start: 0.5, 
      duration: 0.25, 
      note: 42, 
      velocity: 100 
      },
    { 
      start: 1.5, 
      duration: 0.25, 
      note: 42, 
      velocity: 100 
      },
    { 
      start: 2.5, 
      duration: 0.25, 
      note: 42, 
      velocity: 100 
      },
    { 
      start: 3.5, 
      duration: 0.25, 
      note: 42, 
      velocity: 100 
      },


    { 
      start: 0.98, 
      duration: 1, 
      note: 39, 
      velocity: 100 
      },
    { 
      start: 2.98, 
      duration: 1, 
      note: 39, 
      velocity: 100 
      },

    { 
      start: 3, 
      duration: 1, 
      note: 37, 
      velocity: 110 
    },
  ]
};

let patternTriggerState = {
  triggered: true,
  playing: false,
}

const renderTestPattern = function(renderRange, midiOutPort, channel) {

  let triggerInfo = patternSequencer.renderPatternTrigger(
    renderRange, 
    patternTriggerState.triggered,
    patternTriggerState.playing, 
    pattern.duration,
    pattern.startBeats,
    pattern.endBeats,
  );

  let scheduledNotes = patternSequencer.renderPatternEvents(renderRange.start.time, triggerInfo, pattern.duration, pattern.notes);

  _.map(scheduledNotes, (item) => {
    var note = { 
      port: midiOutPort, 

      channel: channel + 1,
      note: item.event.note,

      velocity: item.event.velocity, 
      duration: item.duration, 
      timestamp: item.start
    };
    midiUtilities.renderNote(note);    
  });

  patternTriggerState.playing = triggerInfo.isPlaying;
  console.log(`test render: beats=${renderRange.start.beat.toFixed(2)} start=${triggerInfo.startBeat.toFixed(2)}, end=${triggerInfo.endBeat.toFixed(2)}`);
}

export default renderTestPattern;
