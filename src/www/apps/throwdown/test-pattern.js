
import renderNotePattern from '../../lib/render-note-pattern';

const renderTestPattern = function(renderRange, midiOutPort, channel) {
   let curPhraseLength = 4;
   let pattern = {
      duration: 4,
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
          start: 0.64, 
          duration: 0.25, 
          note: 42, 
          velocity: 100 
          },
        { 
          start: 1.64, 
          duration: 0.25, 
          note: 42, 
          velocity: 100 
          },
        { 
          start: 2.64, 
          duration: 0.25, 
          note: 42, 
          velocity: 100 
          },
        { 
          start: 3.64, 
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
   renderNotePattern(
      renderRange, renderRange.tempoBpm, curPhraseLength,
      midiOutPort, 
      pattern,
      1, 
      true, 
      true      
   );
}

export default renderTestPattern;
