import store from './stores/store';

import * as deckActions from './components/decks/actions';

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
store.dispatch(deckActions.throwdown_addDeck());
store.dispatch(deckActions.throwdown_addDeck());

// let's add some playable sections to the first deck
store.dispatch(deckActions.throwdown_addSection({ 
  deckId: 0,
  parts: [{
    slug: 'beat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/Media/Unknown Artist/Samples/AmenBreak-edited.m4a'),
        tempo: 137.4,
      },
      pattern: beatPatterns.dnb,
    }
  }, {
    slug: 'voc', 
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

}));
store.dispatch(deckActions.throwdown_addSection({ 
  deckId: 0, 
  parts: [{
    slug: 'beat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/Media/Unknown Artist/Samples/AmenBreak-edited.m4a'),
        tempo: 137.4,
      },
      pattern: beatPatterns.straight,
    }
  }, {
    slug: 'voc', 
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
}));
store.dispatch(deckActions.throwdown_addSection({ deckId: 0, parts: [] }));

store.dispatch(deckActions.throwdown_setTriggeredSection({ deckId: 0, sectionId: 0 }));

// let's add some cool stuff to the second deck
store.dispatch(deckActions.throwdown_addSection({ 
  deckId: 1,
  parts: [{
    slug: 'chord', 
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
    slug: 'arp', 
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
}));
store.dispatch(deckActions.throwdown_addSection({ 
  deckId: 1,
  parts: [{
    slug: 'chord', 
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
    slug: 'arp2', 
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
}));


// more test actions
// store.dispatch(deckActions.throwdown_addDeck());
// store.dispatch(deckActions.throwdown_addDeck());
// store.dispatch(deckActions.throwdown_addDeck());
// store.dispatch(deckActions.throwdown_removeDeck({ deckId: 3 }));


