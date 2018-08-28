import store from './stores/store';

import * as deckActions from './components/decks/actions';

////---------------------------------------
//// The Jacket

store.dispatch(deckActions.throwdown_addDeck());

const theJacket = {
  tempo: 128,
  deckId: 0,
  zeroBeat: "7.5s"
};


store.dispatch(deckActions.throwdown_addSection({ 
  deckId: theJacket.deckId,
  slug: "intro",
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
        zeroBeat: theJacket.zeroBeat,
        startOffset: 160,
      },
    }
  }]
}));


store.dispatch(deckActions.throwdown_addSection({ 
  deckId: theJacket.deckId,
  slug: "main",
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

