
// styles
// require('./styles/app.scss');

import React from 'react';
import {render} from 'react-dom';

import { Provider } from 'react-redux'

import shortid from 'shortid';

import store from './stores/store';
// import * as actions from './stores/actions';

import Transport from './components/transport/component.jsx';
import ThrowdownList from  './components/throwdown/component.jsx';

function App() {
   return (
      <Provider store={store}>
         {/* Provider likes to wrap a single element */}
         <div>
            <Transport />
            <ThrowdownList />
         </div>
      </Provider>
   );
}

var appDiv = document.createElement('div');
document.body.appendChild(appDiv);

render(<App/>, appDiv);


import throwdownCoreApp from './throwdown-app';


// test / bootstrap actions
import * as throwdownActions from './components/throwdown/actions';

store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'mivova' }));

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
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'mivova', 
  slug: 'voc', 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'mivova', 
  slug: 'synth', 
}));

store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'kytaime' }));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'kytaime', 
  slug: 'beat', 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'kytaime', 
  slug: 'bass', 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'kytaime', 
  slug: 'lead', 
}));
store.dispatch(throwdownActions.throwdown_addSnipStem({ 
  snip: 'kytaime', 
  slug: 'lead', 
}));
store.dispatch(throwdownActions.throwdown_removeSnipStem({ 
  snip: 'kytaime', 
  slug: 'lead', 
}));



// testing snip actions
// store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'mary' }));
// store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'steve' }));
// store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'helen' }));
// store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'pete' }));
// store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'helen' }));
// store.dispatch(throwdownActions.throwdown_removeSnip({ slug: 'helen' }));
// store.dispatch(throwdownActions.throwdown_renameSnip({ slug: 'steve', newSlug: 'dave' }));
