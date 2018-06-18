
import * as bpmUtilities from '../../lib/sequencer/bpm-utilities';
import * as midiUtilities from '../../lib/sequencer/midi-utilities';
import * as patternSequencer from '../../lib/sequencer/pattern-sequencer';

const swing = 0.03;

let mivovaPattern = {
  duration: 16,
  startBeats: [0], 
  endBeats: [0], 
  notes: [
    { 
      start: 0, 
      duration: 4, 
      note: 55, 
      velocity: 100 
    },
    { 
      start: 4, 
      duration: 4, 
      note: 51, 
      velocity: 100 
    },
    { 
      start: 8, 
      duration: 4, 
      note: 47, 
      velocity: 100 
    },
    { 
      start: 12, 
      duration: 4, 
      note: 48, 
      velocity: 100 
    },

  ]
};

let melodyPattern = {
  duration: 8,
  startBeats: [0, 1, 4.5], 
  endBeats: [0.1, 4.51, 7.1], 
  notes: [
    { 
      start: 0, 
      duration: 1, 
      note: 50, 
      velocity: 100 
    },
    { 
      start: 1, 
      duration: 1, 
      note: 52, 
      velocity: 100 
    },
    { 
      start: 2, 
      duration: 1, 
      note: 53, 
      velocity: 100 
    },
    { 
      start: 3, 
      duration: 1, 
      note: 55, 
      velocity: 100 
    },
    { 
      start: 0+4.5, 
      duration: 0.5, 
      note: 50, 
      velocity: 100 
    },
    { 
      start: 1+4, 
      duration: 1, 
      note: 52, 
      velocity: 100 
    },
    { 
      start: 2+4, 
      duration: 1, 
      note: 53, 
      velocity: 100 
    },
    { 
      start: 3+4, 
      duration: 1, 
      note: 55, 
      velocity: 100 
    },  
  ]
};

let beatPattern = {
  duration: 4,
  startBeats: [0.98], // start on first kick or snare
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

let pattern = mivovaPattern;


let patternTriggerState = {
  triggered: true,
  playing: false,
}

function beepAt(time, freq, context) {
   var RAMP_DURATION = 0.2;

   if (time < 0) time = 0;

   // var currentTime = context.currentTime;
   var osc = context.createOscillator();
   var gain = context.createGain();

   osc.connect(gain);
   gain.connect(context.destination);

   gain.gain.setValueAtTime(0.1, time);
   gain.gain.exponentialRampToValueAtTime(0.001, time + RAMP_DURATION);

   osc.onended = function () {
      gain.disconnect(context.destination)
      osc.disconnect(gain)
   }

   osc.type = 'sawtooth';
   osc.frequency.value = freq;
   osc.start(time);
   osc.stop(time + RAMP_DURATION)
} 


const renderTestPattern = function(renderRange, triggerState, midiOutPort, channel) {
  patternTriggerState.triggered = triggerState;

  let triggerInfo = patternSequencer.renderPatternTrigger(
    renderRange, 
    patternTriggerState.triggered,
    patternTriggerState.playing, 
    pattern.duration,
    pattern.startBeats,
    pattern.endBeats,
  );

  console.log(`trigger p=${patternTriggerState.playing} b=${triggerInfo.startBeat}…${triggerInfo.endBeat}`);

  // filter out events that are not within the (triggered-on) render range
  // should this happen in renderPatternEvents or outside?
  // do we need to factor out the core of event rendering from renderPatternEvents so we can use it without the filter??
  let filteredNotes = _.filter(pattern.notes, function(noteEvent) {
    return bpmUtilities.valueInWrappedBeatRange(
      noteEvent.start, 
      triggerInfo.startBeat % pattern.duration, 
      triggerInfo.endBeat % pattern.duration, 
      pattern.duration
    );
  });


  let scheduledNotes = patternSequencer.renderPatternEvents(renderRange, pattern.duration, filteredNotes);

  _.map(scheduledNotes, (item) => {
    var note = { 
      port: midiOutPort, 

      channel: channel,
      note: item.event.note,

      velocity: item.event.velocity, 
      duration: item.duration, 
      timestamp: item.start
    };
    midiUtilities.renderNote(note);
    
  });
/*
  let beeps = [
    { start: 0, duration: 1, freq: 200, },
    { start: 3.5, duration: 1, freq: 230, },
  ];
  let filteredBeeps = _.filter(beeps, function(noteEvent) {
      return bpmUtilities.valueInWrappedBeatRange(
        noteEvent.start, 
        triggerInfo.startBeat % 4, 
        triggerInfo.endBeat % 4, 
        4
      );
    });

  let scheduledBeeps = patternSequencer.renderPatternEvents(renderRange, 4, filteredBeeps, false);
  _.map(scheduledBeeps, (item) => {
    let time = (item.start + renderRange.audioContextTimeOffsetMsec)  / 1000;
    // console.log(`beep t=${time} b=${item.event.start}`)
    beepAt(time, item.event.freq, renderRange.audioContext);
  });
*/
  patternTriggerState.playing = triggerInfo.isPlaying;
}

export default renderTestPattern;
