import store from './stores/store';

import * as deckActions from './components/decks/actions';

////---------------------------------------
//// Noyu

store.dispatch(deckActions.throwdown_addDeck());

const noyu = {
  tempo: 120,
  deckId: 0,
};


store.dispatch(deckActions.throwdown_addSection({ 
  deckId: noyu.deckId,
  parts: [{
    slug: 'beat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170816--padscape-stemprep--noyu-alpine-beat.mp3'),
        tempo: noyu.tempo,
      },
      pattern: {
        duration: 32,
      },
    }
  }, {
    slug: 'bass', 
    part: 'bass',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170816--padscape-stemprep--noyu-ridge-bass.mp3'),
        tempo: noyu.tempo,
      },
      pattern: {
        duration: 8,
      },
    }
  }, {
    slug: 'chords', 
    part: 'chords',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170816--padscape-stemprep--noyu-uplands-chords.mp3'),
        tempo: noyu.tempo,
      },
      pattern: {
        duration: 64,
      },
    }
  }, {
    slug: 'piano', 
    part: 'lead',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170816--padscape-stemprep--noyu-hills-piano.mp3'),
        tempo: noyu.tempo,
      },
      pattern: {
        endBeats: [63.5],
        duration: 64,
      },
    }
  }]
}));


////---------------------------------------
//// Kufca

const kufca = {
  tempo: 126,
  deckId: 1,
};

store.dispatch(deckActions.throwdown_addDeck());

store.dispatch(deckActions.throwdown_addSection({ 
  deckId: kufca.deckId,
  parts: [{
    slug: 'beat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170806-kufca-padscape-beat-alpine.mp3'),
        tempo: kufca.tempo,
      },
      pattern: {
        startBeats: [0, 2],
        duration: 64,
      },
    }
  }, {
    slug: 'sub', 
    part: 'bass',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170806-kufca-padscape-sub-ridge.mp3'),
        tempo: kufca.tempo,
      },
      pattern: {
        duration: 16,
      },
    }
  }, {
    slug: 'lead', 
    part: 'synth',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170806-kufca-padscape-lead-uplands.mp3'),
        tempo: kufca.tempo,
      },
      pattern: {
        duration: 64,
      },
    }
  }, {
    slug: 'texture', 
    part: 'texture',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170806-kufca-padscape-texture-hills.mp3'),
        tempo: kufca.tempo,
      },
      pattern: {
        duration: 64,
      },
    }
  }]
}));

////---------------------------------------
//// Peaches (Stickity)

const peaches = {
  tempo: 132,
  deckId: 1,
};

// store.dispatch(deckActions.throwdown_addDeck());

store.dispatch(deckActions.throwdown_addSection({ 
  deckId: peaches.deckId,
  parts: [{
    slug: 'beat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170816--padscape-stemprep--peaches-alpine-beat.mp3'),
        tempo: peaches.tempo,
      },
      pattern: {
        startBeats: [1],
        duration: 16,
      },
    }
  }, {
    slug: 'sub', 
    part: 'bass',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170816--padscape-stemprep--peaches-ridge-sub.mp3'),
        tempo: peaches.tempo,
      },
      pattern: {
        duration: 16,
      },
    }
  }, {
    slug: 'lead', 
    part: 'synth',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170816--padscape-stemprep--peaches-uplands-lead.mp3'),
        tempo: peaches.tempo,
      },
      pattern: {
        duration: 64,
      },
    }
  }, {
    slug: 'texture', 
    part: 'texture',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170816--padscape-stemprep--peaches-hills-texture.mp3'),
        tempo: peaches.tempo,
      },
      pattern: {
        duration: 32,
      },
    }
  }]
}));


////---------------------------------------
//// Squelcherisation + Gemare

const goodHatBeat = 1.5;
const squelch = {
  tempo: 137.4,
  deckId: 2,
  patterns: {
    dnb: {
      duration: 4, 
      slices: [
        {
          start: 0, 
          duration: 0.5,
          beat: 0,
        },
        {
          start: 0.5, 
          duration: 0.25,
          beat: goodHatBeat,
        },
        {
          start: 1, 
          duration: 0.5,
          beat: 1,
        },
        {
          start: 1.5, 
          duration: 0.25,
          beat: goodHatBeat,
        },
        {
          start: 2, 
          duration: 0.25,
          beat: goodHatBeat,
        },
        {
          start: 2.5, 
          duration: 0.5,
          beat: 0,
        },
        {
          start: 3, 
          duration: 0.5,
          beat: 1,
        },
        {
          start: 3.5, 
          duration: 0.25,
          beat: goodHatBeat,
        },
      ]
    },
    straight: {
      duration: 2, 
      slices: [
        {
          start: 0, 
          duration: 1.5,
          beat: 0,
        },
        {
          start: 1, 
          duration: 1.5,
          beat: 1,
        },
      ]
    },
    normal: {
      duration: 16, 
      slices: [
        {
          start: 0, 
          duration: 4,
          beat: 0,
        },
        {
          start: 4, 
          duration: 4,
          beat: 4,
        },
        {
          start: 8, 
          duration: 4,
          beat: 8,
        },
        {
          start: 12, 
          duration: 4,
          beat: 12,
        },
      ]
    },
  },
};

store.dispatch(deckActions.throwdown_addDeck());

store.dispatch(deckActions.throwdown_addSection({ 
  deckId: squelch.deckId,
  parts: [{
    slug: 'beat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/Media/Unknown Artist/Samples/AmenBreak-edited.m4a'),
        tempo: squelch.tempo,
      },
      pattern: squelch.patterns.normal,
    },
  }, {
    slug: 'bass', 
    part: 'bass',
    data: {  
      pattern: {
        duration: 16, 
        notes: [
          { 
            start: 0, 
            duration: 1.1,
            note: 27 + 24,
          },
          { 
            start: 1.5, 
            duration: 0.5,
            note: 22 + 24,
          },
          { 
            start: 3, 
            duration: 0.5,
            note: 22 + 24,
          },
          { 
            start: 4, 
            duration: 3,
            note: 15 + 24,
          },
          { 
            start: 9, 
            duration: 1,
            note: 25 + 24,
          },
          { 
            start: 11, 
            duration: 1,
            note: 25 + 24,
          },
          { 
            start: 12, 
            duration: 3,
            note: 16 + 24,
          },
          { 
            start: 15, 
            duration: 1,
            note: 18 + 24,
          },
        ]
      },
    },
  }, {
    slug: 'synth', 
    part: 'lead',
    data: {  
      pattern: {
        duration: 4, 
        notes: [
          { 
            start: 0.5, 
            duration: 0.5,
            note: 27 + 36,
          },
          { 
            start: 1.5, 
            duration: 0.5,
            note: 27 + 36,
          },
          { 
            start: 3, 
            duration: 0.5,
            note: 22 + 36,
          },
          { 
            start: 3.5, 
            duration: 0.5,
            note: 15 + 36,
          },
        ]
      },
    },  
  }, {
    slug: 'arpeggio', 
    part: 'lead',
    data: {
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems/20170709-padscape--gemare-lead-hills-dry.m4a'),
        tempo: 120,
      },
      pattern: {
        duration: 2, 
        slices: [{
          start: 0, 
          duration: 0.15,
          beat: 0
        }, {
          start: 0.5, 
          duration: 0.15,
          beat: 1.5
        }, {
          start: 1, 
          duration: 0.15,
          beat: 3
        }, {
          start: 1.5, 
          duration: 0.15,
          beat: 13
        }]
      }
    }
  }]
}));


