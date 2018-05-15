
import renderNotePattern from '../../lib/render-note-pattern';

const swing = 0.14;

let pattern = {
  duration: 4,
  startBeats: 0.52,
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
  let curPhraseLength = 4;

  patternTriggerState.playing = renderNotePattern(
    renderRange, renderRange.tempoBpm, curPhraseLength,
    midiOutPort, 
    pattern,
    1, 
    patternTriggerState.playing, 
    patternTriggerState.triggered      
  );
}

export default renderTestPattern;
