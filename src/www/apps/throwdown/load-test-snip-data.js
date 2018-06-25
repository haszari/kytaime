import store from './stores/store';

import * as throwdownActions from './components/throwdown/actions';

store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'mivova' }));


// test destroy actions work 
setTimeout(() => {
  // store.dispatch(throwdownActions.throwdown_removeSnip({ slug: 'mivova' }));
  // store.dispatch(throwdownActions.throwdown_removeSnipStem({ snip: 'mivova', slug: 'beat' }));
}, 5000);


store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'mivova', 
  slug: 'beat', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20180425--mivova--padscape--beat.mp3',
    tempo: 122,
    duration: 8,
    part: 'drums',
    startBeats: [0, 3],
    endBeats: [0.5],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'mivova', 
  slug: 'bass', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20180425--mivova--padscape--sub.mp3',
    tempo: 122,
    duration: 8,
    part: 'bass',
    // startBeats: [0],
    // endBeats: [0.5],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'mivova', 
  slug: 'voc', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20180425--mivova--padscape--voc.mp3',
    tempo: 122,
    duration: 64,
    part: 'voc',
    startBeats: [0, 6, 16, 23, 32, 39, 55, 62],
    endBeats: [0, 6, 16, 23, 32, 39, 55, 63],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'mivova', 
  slug: 'synth', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20180425--mivova--padscape--lead.mp3',
    tempo: 122,
    duration: 64,
    part: 'synth',
    // startBeats: [0, 3],
    // endBeats: [0.5],
  } 
}));



store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'gemare' }));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'gemare', 
  slug: 'beat', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20170709-padscape--gemare-beat-alpine.m4a',
    tempo: 120,
    duration: 4,
    part: 'drums',
    // startBeats: [0, 3],
    // endBeats: [0.5],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'gemare', 
  slug: 'sub', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20170709-padscape--gemare-sub-ridge.m4a',
    tempo: 120,
    duration: 16,
    part: 'sub',
    // startBeats: [0],
    // endBeats: [0.5],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'gemare', 
  slug: 'perc', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20170709-padscape--gemare-perc-uplands.m4a',
    tempo: 120,
    duration: 4,
    part: 'perc',
    // startBeats: [0, 6, 16, 23, 32, 39, 55, 62],
    // endBeats: [0, 6, 16, 23, 32, 39, 55, 63],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'gemare', 
  slug: 'synth', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20170709-padscape--gemare-lead-hills-dry.m4a',
    tempo: 120,
    duration: 32,
    part: 'synth',
    // startBeats: [0, 3],
    // endBeats: [0.5],
  } 
}));





store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'guxovy' }));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'guxovy', 
  slug: 'beat', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20170505-beatschool-guxovy-drumparts--minimalistic-kit.m4a',
    tempo: 124,
    duration: 4,
    part: 'drums',
    // startBeats: [0, 3],
    // endBeats: [0.5],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'guxovy', 
  slug: 'sub', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20170505-beatschool-guxovy-sub.m4a',
    tempo: 124,
    duration: 4,
    part: 'sub',
    // startBeats: [0],
    // endBeats: [0.5],
  } 
}));



store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'opsehg' }));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'opsehg', 
  slug: 'beat', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/17_02_2015-Opsehg-Stems-Beat.m4a',
    tempo: 117,
    duration: 4,
    part: 'drums',
    // startBeats: [0, 3],
    // endBeats: [0.5],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'opsehg', 
  slug: 'bass', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/17_02_2015-Opsehg-Stems-Bass.m4a',
    tempo: 117,
    duration: 16,
    part: 'bass',
    // startBeats: [0],
    // endBeats: [0.5],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'opsehg', 
  slug: 'daa', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/17_02_2015-Opsehg-Stems-Daa.m4a',
    tempo: 117,
    duration: 32,
    part: 'synth',
    // startBeats: [0],
    // endBeats: [0.5],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'opsehg', 
  slug: 'tiddle', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/17_02_2015-Opsehg-Stems-Tiddle.m4a',
    tempo: 117,
    duration: 16,
    part: 'synth',
    // startBeats: [0],
    // endBeats: [0.5],
  } 
}));


























// store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'kytaime' }));
// store.dispatch(throwdownActions.throwdown_addSnipStem({ 
//   snip: 'kytaime', 
//   slug: 'beat', 
// }));
// store.dispatch(throwdownActions.throwdown_addSnipStem({ 
//   snip: 'kytaime', 
//   slug: 'bass', 
// }));
// store.dispatch(throwdownActions.throwdown_addSnipStem({ 
//   snip: 'kytaime', 
//   slug: 'lead', 
// }));
// store.dispatch(throwdownActions.throwdown_addSnipStem({ 
//   snip: 'kytaime', 
//   slug: 'lead', 
// }));
// store.dispatch(throwdownActions.throwdown_removeSnipStem({ 
//   snip: 'kytaime', 
//   slug: 'lead', 
// }));



// testing snip actions
// store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'mary' }));
// store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'steve' }));
// store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'helen' }));
// store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'pete' }));
// store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'helen' }));
// store.dispatch(throwdownActions.throwdown_removeSnip({ slug: 'helen' }));
// store.dispatch(throwdownActions.throwdown_renameSnip({ slug: 'steve', newSlug: 'dave' }));
