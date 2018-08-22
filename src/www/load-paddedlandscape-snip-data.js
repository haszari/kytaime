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
        startBeats: [2],
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

store.dispatch(deckActions.throwdown_addDeck());

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

