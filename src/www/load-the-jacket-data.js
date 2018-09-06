import store from './stores/store';

import * as deckActions from './components/decks/actions';

////---------------------------------------
//// The Jacket

store.dispatch(deckActions.throwdown_addDeck());

const theJacket = {
  tempo: 128,
  deckId: 0,
  zeroBeat: "7.5s",
  hitPoints: {
    okay: 3.652,
    kay: 3.749,
  }
};


store.dispatch(deckActions.throwdown_addSection({ 
  deckId: theJacket.deckId,
  slug: "intro",
  // repeat: 2,
  parts: [{
    slug: 'beat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Stems/The Jacket - Drums.m4a'),
        tempo: theJacket.tempo,
      },
      pattern: {
        duration: 8,
        zeroBeat: theJacket.zeroBeat,
        variation: [{
          type: 'audio-mute',
          basis: 'section', // what are these numbers in relation to – pattern or section?
          events: [{
            // in beats, like note events or slices
            start: 0, 
            duration: 1, 
          }],
          every: {
            multiple: 1, 
            offset: 0.5, 
          }
        }]
      },
    }
  }, {
    slug: 'sub-intro', 
    part: 'sub',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Stems/The Jacket - Sub.m4a'),
        tempo: theJacket.tempo,
      },
      pattern: {
        duration: 16,
        zeroBeat: theJacket.zeroBeat,
        startOffset: 64,
        slices: [{
          start: 0, 
          duration: 3,
        }]
      },
    }
  }, {
    slug: 'hihat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Stems/The Jacket - HiHats.m4a'),
        tempo: theJacket.tempo,
      },
      pattern: {
        duration: 8,
        zeroBeat: theJacket.zeroBeat,
      },
    }
  }, {
    slug: 'bass', 
    part: 'synth',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Stems/The Jacket - Bass.m4a'),
        tempo: theJacket.tempo,
      },
      pattern: {
        duration: 4,
        // attack: 0.6,
        // release: 0.7,
        zeroBeat: theJacket.zeroBeat,
        startOffset: 160,
      },
    }
  }, {
    slug: 'sample', 
    part: 'sample',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Samples/The Jacket - vocal sample (ft. Curb Your Enthusiasm).m4a'),
      },
      pattern: {
        duration: 32,
        gain: 0.35,
        slices: [{
          seconds: theJacket.hitPoints.kay,
          duration: 1,
          start: 31,
        }]
      },
    }
  }]
}));


store.dispatch(deckActions.throwdown_addSection({ 
  deckId: theJacket.deckId,
  slug: "main",
  // repeat: 4, 
  parts: [{
    slug: 'beat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Stems/The Jacket - Drums.m4a'),
        tempo: theJacket.tempo,
      },
      pattern: {
        duration: 8,
        zeroBeat: theJacket.zeroBeat,
        variation: [{
          type: 'audio-mute',
          basis: 'section', // what are these numbers in relation to – pattern or section?
          events: [{
            // in beats, like note events or slices
            // in relation to basis – section!
            start: 30, // really we want -2 here
            duration: 2, 
          }],
          every: {
            multiple: 2, // only once every 2 loops
            offset: 1, // on the second loop
          }
        }]
      },
    }
  }, {
    slug: 'sub', 
    part: 'sub',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Stems/The Jacket - Sub.m4a'),
        tempo: theJacket.tempo,
      },
      pattern: {
        duration: 32,
        zeroBeat: theJacket.zeroBeat,
        startOffset: 64,
      },
    }
  }, {
    slug: 'bass', 
    part: 'synth',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Stems/The Jacket - Bass.m4a'),
        tempo: theJacket.tempo,
      },
      pattern: {
        duration: 16,
        zeroBeat: theJacket.zeroBeat,
        startOffset: 160,
      },
    }
  }, {
    slug: 'pad', 
    part: 'pad',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Stems/The Jacket - Pad.m4a'),
        tempo: theJacket.tempo,
      },
      pattern: {
        duration: 16,
        zeroBeat: theJacket.zeroBeat,
        startOffset: 160,
        variation: [{
          type: 'audio-mute',
          basis: 'pattern', // what are these numbers in relation to – pattern or section?
          events: [{
            // in beats, like note events or slices
            start: 0,
            duration: 2, 
          }, {
            start: 12, // really we want -4 here
            duration: 4, 
          }],
          every: {
            multiple: 3, // only once every 3 loops
            offset: 2, // on the third loop
          }
        }]
      },
    }
  }, {
    slug: 'hihat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Stems/The Jacket - HiHats.m4a'),
        tempo: theJacket.tempo,
      },
      pattern: {
        duration: 8,
        zeroBeat: theJacket.zeroBeat,
      },
    }
  }, {
    slug: 'tabla', 
    part: 'perc',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Stems/The Jacket - Tabla.m4a'),
        tempo: theJacket.tempo,
      },
      pattern: {
        duration: 4,
        zeroBeat: theJacket.zeroBeat,
        startOffset: 64,
      },
    }
  }]
}));

store.dispatch(deckActions.throwdown_addSection({ 
  deckId: theJacket.deckId,
  slug: "build",
  // repeat: 2,
  parts: [{
    slug: 'hihat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Stems/The Jacket - HiHats.m4a'),
        tempo: theJacket.tempo,
      },
      pattern: {
        duration: 8,
        zeroBeat: theJacket.zeroBeat,
      },
    }
  }, {
    slug: 'pad', 
    part: 'pad',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Stems/The Jacket - Pad.m4a'),
        tempo: theJacket.tempo,
      },
      pattern: {
        duration: 16,
        zeroBeat: theJacket.zeroBeat,
        startOffset: 160,
      },
    }
  }, {
    slug: 'sub-intro', 
    part: 'sub',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Stems/The Jacket - Sub.m4a'),
        tempo: theJacket.tempo,
      },
      pattern: {
        duration: 32,
        zeroBeat: theJacket.zeroBeat,
        startOffset: 64,
        slices: [{
          start: 0, 
          duration: 3,
        }]
      },
    }
  }]
}));

store.dispatch(deckActions.throwdown_addSection({ 
  deckId: theJacket.deckId,
  slug: "build2",
  // repeat: 2,
  parts: [{
    slug: 'hihat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Stems/The Jacket - HiHats.m4a'),
        tempo: theJacket.tempo,
      },
      pattern: {
        attack: 0.1, // soften these hats ...
        duration: 0.5,
        zeroBeat: theJacket.zeroBeat,
        slices: [{
          start: 0, 
          duration: 0.5
        }]
      },
    }
  }, {
    slug: 'pad', 
    part: 'pad',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Stems/The Jacket - Pad.m4a'),
        tempo: theJacket.tempo,
      },
      pattern: {
        duration: 8,
        zeroBeat: theJacket.zeroBeat,
        release: 0.5,
        startOffset: 160,
        slices: [{
          start: 0, 
          duration: 3, 
        }, {
          start: 3, 
          duration: 3, 
        }, {
          start: 6, 
          duration: 2, 
        }]
      },
    }
  }, {
    slug: 'arp', 
    part: 'synth',
    data: {  
      pattern: {
        duration: 0.5,
        notes: [{
          note: 0 + 74, 
          start: 0,
          duration: 0.125, 
        }, {
          note: 3 + 74, 
          start: 0.125,
          duration: 0.25, 
        }, {
          note: 6 + 74, 
          start: 0.25,
          duration: 0.25, 
        }, {
          note: 9 + 74, 
          start: 0.375,
          duration: 0.25, 
        }]
      },
    }
  }]
}));

