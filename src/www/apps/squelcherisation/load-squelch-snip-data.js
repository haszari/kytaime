import store from './stores/store';

import * as throwdownActions from './components/throwdown/actions';

store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'squelcherisation' }));


store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'squelcherisation', 
  slug: 'beat', 
  data: {
    audio: encodeURI('/Media/Unknown Artist/Samples/AmenBreak-edited.m4a'),
    tempo: 137.4,
    duration: 16, // I think
    // part: 'alpine',
    // startBeats: [0, 3],
    // endBeats: [0.5],
  } 
}));


// we need a "set"; we don't know what toggle does if we don't know current state
store.dispatch(throwdownActions.throwdown_toggleSnipStemTrigger({ 
  snip: 'squelcherisation', 
  slug:'beat',
}));