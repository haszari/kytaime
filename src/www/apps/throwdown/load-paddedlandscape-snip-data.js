import store from './stores/store';

import * as throwdownActions from './components/throwdown/actions';

store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'mivova' }));


store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'mivova', 
  slug: 'beat', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20180425--mivova--padscape--beat.mp3',
    tempo: 122,
    duration: 8,
    part: 'alpine',
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
    part: 'ridge',
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
    part: 'uplands',
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
    part: 'hills',
    // startBeats: [0, 3],
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
    part: 'alpine',
    startBeats: [0, 1, 3.5],
    endBeats: [0, 0.5, 3.5],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'opsehg', 
  slug: 'bass', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/17_02_2015-Opsehg-Stems-Bass.m4a',
    tempo: 117,
    duration: 16,
    part: 'ridge',
    startBeats: [0],
    endBeats: [2],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'opsehg', 
  slug: 'daa', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/17_02_2015-Opsehg-Stems-Daa.m4a',
    tempo: 117,
    duration: 32,
    part: 'uplands',
    startBeats: [0],
    endBeats: [3.25],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'opsehg', 
  slug: 'tiddle', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/17_02_2015-Opsehg-Stems-Tiddle.m4a',
    tempo: 117,
    duration: 16,
    part: 'hills',
    startBeats: [1.5, 3],
    endBeats: [0],
  } 
}));




store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'maenyb' }));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'maenyb', 
  slug: 'beat', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--maenyb-beat-alpine.m4a',
    tempo: 133,
    duration: 4,
    part: 'alpine',
    startBeats: [0, 1, 2, 3],
    endBeats: [0, 1],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'maenyb', 
  slug: 'bass', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170703-stemcells-padscape-a3-stemprep--maenyb-sub.mp3',
    tempo: 133,
    duration: 8,
    part: 'ridge',
    startBeats: [0],
    endBeats: [1.5, 6.5],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'maenyb', 
  slug: 'chords', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170703-stemcells-padscape-a3-stemprep--maenyb-chords.mp3',
    tempo: 133,
    duration: 8,
    part: 'uplands',
    startBeats: [1, 7],
    endBeats: [0, 2],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'maenyb', 
  slug: 'lead', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170703-stemcells-padscape-a3-stemprep--maenyb-lead.mp3',
    tempo: 133,
    duration: 32,
    part: 'hills',
    startBeats: [1],
    endBeats: [1], // this accounts for some tail, rather than an actual note
  } 
}));








store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'manas' }));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'manas', 
  slug: 'beat', 
  data: {
    // audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-beat-alpine.m4a',
    // startBeats: [0, 3],
    // endBeats: [0.5],
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-beat-step-alpine.m4a',
    startBeats: [0, 3, 3.5],
    endBeats: [0, 1],
    tempo: 132,
    duration: 4,
    part: 'alpine',
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'manas', 
  slug: 'bass', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-sub-ridge2.mp3',
    tempo: 132,
    duration: 8,
    part: 'ridge',
    startBeats: [1],
    endBeats: [0],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'manas', 
  slug: 'lead', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-lead-uplands.m4a',
    tempo: 132,
    duration: 16,
    part: 'uplands',
    startBeats: [0.5],
    endBeats: [0],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'manas', 
  slug: 'lead', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--manas-voc-hills.m4a',
    tempo: 132,
    duration: 32,
    part: 'hills',
    startBeats: [16, 30],
    endBeats: [0, 17],
  } 
}));





























/*


store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'TEMPLATE' }));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'TEMPLATE', 
  slug: 'beat', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/20170709-padscape--TEMPLATE-beat-alpine.m4a',
    tempo: 117,
    duration: 4,
    part: 'alpine',
    // startBeats: [0, 3],
    // endBeats: [0.5],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'TEMPLATE', 
  slug: 'bass', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/17_02_2015-Opsehg-Stems-Bass.m4a',
    tempo: 117,
    duration: 16,
    part: 'ridge',
    // startBeats: [0],
    // endBeats: [0.5],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'TEMPLATE', 
  slug: 'chords', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/17_02_2015-Opsehg-Stems-Daa.m4a',
    tempo: 117,
    duration: 32,
    part: 'uplands',
    // startBeats: [0],
    // endBeats: [0.5],
  } 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'TEMPLATE', 
  slug: 'lead', 
  data: {
    audio: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems%20Padded%20Landscape/17_02_2015-Opsehg-Stems-Tiddle.m4a',
    tempo: 117,
    duration: 16,
    part: 'hills',
    // startBeats: [0],
    // endBeats: [0.5],
  } 
}));

*/
