import store from './stores/store';

import * as throwdownActions from './components/throwdown/actions';

store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'squelcherisation' }));


const goodHatBeat = 1.5;

store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'squelcherisation', 
  slug: 'beat-sliced', 
  audio: {
    file: encodeURI('/Media/Unknown Artist/Samples/AmenBreak-edited.m4a'),
    tempo: 137.4,
  },
  data: {
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
      // {
      //   start: 2, 
      //   duration: 0.5,
      //   beat: 2,
      // },
      // {
      //   start: 5, 
      //   duration: 0.5,
      //   beat: 0,
      // },
      // {
      //   start: 6, 
      //   duration: 0.5,
      //   beat: 2,
      // },
    ]
    // part: 'alpine',
    // startBeats: [0, 3],
    // endBeats: [0.5],
  } 
}));


store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'squelcherisation', 
  slug: 'bass', 
  data: {
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
    // part: 'alpine',
    // startBeats: [0, 3],
    // endBeats: [0.5],
  } 
}));


store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'squelcherisation', 
  slug: 'lead', 
  data: {
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
