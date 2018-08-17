import store from './stores/store';

import * as throwdownActions from './components/throwdown/actions';

//// some useful pattern data

const goodHatBeat = 1.5;
const beatPatterns = {
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
        duration: 0.5,
        beat: 0,
      },
      {
        start: 1, 
        duration: 0.5,
        beat: 1,
      },
    ]
  }
}

//// hard-coded patterns



// we have two lines, because we're like a DJ, and they are like decks
store.dispatch(throwdownActions.throwdown_addDeck());
store.dispatch(throwdownActions.throwdown_addDeck());

// let's add some playable sections to the first deck
store.dispatch(throwdownActions.throwdown_addSection({ 
  deckId: 0,
  data: {
    parts: [{
      label: 'beat', 
      part: 'drums',
      data: {  
        audio: {
          file: encodeURI('/Media/Unknown Artist/Samples/AmenBreak-edited.m4a'),
          tempo: 137.4,
        },
        pattern: beatPatterns.dnb,
      }
    }, {
      label: 'voc', 
      part: 'voc',
      data: {  
        audio: {
          file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems/20180425--mivova--padscape--voc.mp3'),
          tempo: 122,
        },
        pattern: {
          duration: 16,
          slices: [
            {
              start: 0, 
              duration: 1,
              beat: 0,
            },
            {
              start: 15, 
              duration: 1,
              beat: 63,
            }
          ],
        },
      }
    }]
  }
}));
store.dispatch(throwdownActions.throwdown_addSection({ 
  deckId: 0, 
  data: {
    parts: [{
      label: 'beat', 
      part: 'drums',
      data: {  
        audio: {
          file: encodeURI('/Media/Unknown Artist/Samples/AmenBreak-edited.m4a'),
          tempo: 137.4,
        },
        pattern: beatPatterns.straight,
      }
    }, {
      label: 'voc', 
      part: 'voc',
      data: {  
        audio: {
          file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems/20180425--mivova--padscape--voc.mp3'),
          tempo: 122,
        },
        pattern: {
          duration: 8,
          slices: [
            {
              start: 3, 
              duration: 1,
              beat: 1.5,
            },
            {
              start: 6.5, 
              duration: 1,
              beat: 31,
            }
          ],
        },
      }
    }]
  }
}));
store.dispatch(throwdownActions.throwdown_addSection({ deckId: 0, data: {} }));

store.dispatch(throwdownActions.throwdown_setTriggeredSection({ deckId: 0, sectionId: 0 }));

// let's add some cool stuff to the second deck
store.dispatch(throwdownActions.throwdown_addSection({ 
  deckId: 1,
  data: {
    parts: [{
      label: 'chord', 
      part: 'chords',
      data: {  
        audio: {
          file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170703-stemcells-padscape-a3-stemprep--maenyb-chords.mp3'),
          tempo: 133,
        },
        pattern: {
          duration: 4,
          slices: [
            {
              start: 1, 
              duration: 1,
              beat: 1,
            },
            {
              start: 3, 
              duration: 1,
              beat: 1,
            },
          ]
        },
      }
    }, {
      label: 'arp', 
      part: 'pad',
      data: {  
        audio: {
          file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems/20180425--mivova--padscape--lead.mp3'),
          tempo: 122,
        },
        pattern: {
          duration: 16,
          slices: [
            {
              start: 0, 
              duration: 1,
              beat: 16,
            },
            {
              start: 3, 
              duration: 1,
              beat: 0,
            },
            {
              start: 6, 
              duration: 1,
              beat: 0,
            },
            {
              start: 9, 
              duration: 1,
              beat: 32,
            },
            {
              start: 12, 
              duration: 1,
              beat: 48,
            },
            {
              start: 15, 
              duration: 1,
              beat: 48,
            },
          ],
        },
      }
    }]
  }
}));
store.dispatch(throwdownActions.throwdown_addSection({ 
  deckId: 1,
  data: {
    parts: [{
      label: 'chord', 
      part: 'chords',
      data: {  
        audio: {
          file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170703-stemcells-padscape-a3-stemprep--maenyb-chords.mp3'),
          tempo: 133,
        },
        pattern: {
          duration: 8,
          slices: [
            {
              start: 7, 
              duration: 0.25,
              beat: 5,
            },
            {
              start: 7.25, 
              duration: 0.25,
              beat: 5,
            },
            {
              start: 7.5, 
              duration: 0.25,
              beat: 1,
            },
            {
              start: 7.75, 
              duration: 0.25,
              beat: 1,
            },
          ]
        },
      }
    }, {
      label: 'arp2', 
      part: 'pad',
      data: {  
        audio: {
          file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems/20180425--mivova--padscape--lead.mp3'),
          tempo: 122,
        },
        pattern: {
          duration: 8,
          slices: [
            {
              start: 0, 
              duration: 3,
              beat: 16,
            },
            {
              start: 3, 
              duration: 5,
              beat: 48,
            },
          ],
        },
      }
    }]
  }
}));


// more test actions
// store.dispatch(throwdownActions.throwdown_addDeck());
// store.dispatch(throwdownActions.throwdown_addDeck());
// store.dispatch(throwdownActions.throwdown_addDeck());
// store.dispatch(throwdownActions.throwdown_removeDeck({ deckId: 3 }));



/// returning soon...

store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'squelcherisation' }));



store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  part: 'drums',
  snip: 'squelcherisation', 
  slug: 'beat-sliced', 
  audio: {
    file: encodeURI('/Media/Unknown Artist/Samples/AmenBreak-edited.m4a'),
    tempo: 137.4,
  },
  pattern: beatPatterns.dnb,
  variation: {} // coming soon
}));


store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  part: 'bass',
  snip: 'squelcherisation', 
  slug: 'bass', 
  pattern: {
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
      { // is this one for real?
        start: 15, 
        duration: 1,
        note: 18 + 24,
      },
    ],
    duration: 16, 
    // startBeats: [0, 3],
    // endBeats: [0.5],
  } 
}));


store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  part: 'lead',
  snip: 'squelcherisation', 
  slug: 'lead', 
  pattern: {
    notes: [
      { 
        start: 1, 
        duration: 0.3,
        note: -5 + 64,
      },
      { 
        start: 2.5, 
        duration: 0.3,
        note: -5 + 64,
      },
    ],
    duration: 8, 
  } 
}));

// we need a "set"; we don't know what toggle does if we don't know current state
store.dispatch(throwdownActions.throwdown_toggleSnipStemTrigger({ 
  snip: 'squelcherisation', 
  slug: 'beat-sliced',
}));
store.dispatch(throwdownActions.throwdown_toggleSnipStemTrigger({ 
  snip: 'squelcherisation', 
  slug: 'bass',
}));
store.dispatch(throwdownActions.throwdown_toggleSnipStemTrigger({ 
  snip: 'squelcherisation', 
  slug: 'lead',
}));
