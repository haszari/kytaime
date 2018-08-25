import store from './stores/store';

import * as deckActions from './components/decks/actions';

////---------------------------------------
//// Yeritoejy

store.dispatch(deckActions.throwdown_addDeck());

const yeritoejy = {
  tempo: 125,
  deckId: 0,
};


store.dispatch(deckActions.throwdown_addSection({ 
  deckId: yeritoejy.deckId,
  parts: [{
    slug: 'beat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170709-padscape-yeritoejy--drums-alpine.m4a'),
        tempo: yeritoejy.tempo,
      },
      pattern: {
        duration: 4,
      },
    }
  }, {
    slug: 'bass', 
    part: 'bass',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170709-padscape-yeritoejy--bass-ridge.m4a'),
        tempo: yeritoejy.tempo,
      },
      pattern: {
        duration: 32,
      },
    }
  }, {
    slug: 'blicks', 
    part: 'synth',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170709-padscape-yeritoejy--blicks-hills.m4a'),
        tempo: yeritoejy.tempo,
      },
      pattern: {
        duration: 32,
      },
    }
  }, {
    slug: 'perc', 
    part: 'perc',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170709-padscape-yeritoejy--perc-uplands.m4a'),
        tempo: yeritoejy.tempo,
      },
      pattern: {
        duration: 4,
      },
    }
  }]
}));

////---------------------------------------
//// Saehaija

store.dispatch(deckActions.throwdown_addDeck());

const saehaija = {
  tempo: 117,
  deckId: 1,
};


store.dispatch(deckActions.throwdown_addSection({ 
  deckId: saehaija.deckId,
  parts: [{
    slug: 'beat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems/20180701--saehaija--beat.mp3'),
        tempo: saehaija.tempo,
      },
      pattern: {
        duration: 4,
      },
    }
  }, {
    slug: 'bass', 
    part: 'bass',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems/20180701--saehaija--bass.mp3'),
        tempo: saehaija.tempo,
      },
      pattern: {
        duration: 4,
      },
    }
  }, {
    slug: 'lead', 
    part: 'synth',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems/20180701--saehaija--lead.mp3'),
        tempo: saehaija.tempo,
      },
      pattern: {
        duration: 4,
      },
    }
  }]
}));


////---------------------------------------
//// Hivaofi

store.dispatch(deckActions.throwdown_addDeck());

const hivaofi = {
  tempo: 120,
  deckId: 2,
};


store.dispatch(deckActions.throwdown_addSection({ 
  deckId: hivaofi.deckId,
  parts: [{
    slug: 'beat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems/06-12-2014-hivaofi-drums.m4a'),
        tempo: hivaofi.tempo,
      },
      pattern: {
        duration: 8,
      },
    }
  }, {
    slug: 'bass', 
    part: 'bass',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems/06-12-2014-hivaofi-bass.m4a'),
        tempo: hivaofi.tempo,
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
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems/06-12-2014-hivaofi-chords.m4a'),
        tempo: hivaofi.tempo,
      },
      pattern: {
        duration: 8,
      },
    }
  }]
}));



////---------------------------------------
//// Radial Head

store.dispatch(deckActions.throwdown_addDeck());

const radialhead = {
  tempo: 129,
  deckId: 3,
};


store.dispatch(deckActions.throwdown_addSection({ 
  deckId: radialhead.deckId,
  parts: [{
    slug: 'beat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems/20180825--tubasy-newsounds-drumbeat-stems.mp3'),
        tempo: 122,
      },
      pattern: {
        duration: 4,
      },
    }
  }, {
    slug: 'sub', 
    part: 'sub',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170709-padscape--radialhead-sub-ridge.m4a'),
        tempo: radialhead.tempo,
      },
      pattern: {
        duration: 64,
      },
    }
  }, {
    slug: 'synth', 
    part: 'lead',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170709-padscape--radialhead-uplands-gliss.m4a'),
        tempo: radialhead.tempo,
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
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170709-padscape--radialhead-hils-trash.m4a'),
        tempo: radialhead.tempo,
      },
      pattern: {
        duration: 64,
      },
    }
  }]
}));


////---------------------------------------
//// Manas

store.dispatch(deckActions.throwdown_addDeck());

const manas = {
  tempo: 132,
  deckId: 4,
};


store.dispatch(deckActions.throwdown_addSection({ 
  deckId: manas.deckId,
  parts: [{
    slug: 'beat', 
    part: 'drums',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170709-padscape--manas-beat-alpine.m4a'),
        tempo: manas.tempo,
      },
      pattern: {
        duration: 4,
      },
    }
  }, {
    slug: 'bass', 
    part: 'bass',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170709-padscape--manas-sub-ridge2.mp3'),
        tempo: manas.tempo,
      },
      pattern: {
        duration: 8,
      },
    }
  }, {
    slug: 'synth', 
    part: 'lead',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170709-padscape--manas-lead-uplands.m4a'),
        tempo: manas.tempo,
      },
      pattern: {
        duration: 16,
      },
    }
  }, {
    slug: 'voc', 
    part: 'voc',
    data: {  
      audio: {
        file: encodeURI('/media/Haszari/Haszari Renders - Snips Stems Padded Landscape/20170709-padscape--manas-voc-hills.m4a'),
        tempo: manas.tempo,
      },
      pattern: {
        duration: 32,
      },
    }
  }]
}));
