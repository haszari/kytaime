
// styles
require('./styles/app.scss');

import React from 'react';
import {render} from 'react-dom';

import { Provider } from 'react-redux'

import sequencer from './sequencer';

import store from './stores/store';
import * as actions from './stores/actions';

import Toolbar from './components/container/toolbar.js';
import PatternGridLine from './components/container/pattern-grid-line.js';

function App() {
   return (
      <Provider store={store}>
         {/* Provider likes to wrap a single element */}
         <div>

            <Toolbar /> 

            <section id="patternLines">

               <PatternGridLine channel={1} />

               <PatternGridLine channel={2} />

               <PatternGridLine channel={3} />

               <PatternGridLine channel={4} />

               <PatternGridLine channel={5} />

               <PatternGridLine channel={6} />

            </section>
         </div>
      </Provider>
   );
}

var appDiv = document.createElement('div');
document.body.appendChild(appDiv);

render(<App/>, appDiv);



import {hats, kick, beat, bassline, lead, filter, send} from './lib/example-patterns';

let importPattern = (channel, patternObject) => {
   store.dispatch(actions.addPattern({ 
      channel: channel,
      duration: patternObject.duration,
      notes: patternObject.notes,
      startBeats: patternObject.startBeats,
      endBeats: patternObject.endBeats
   }));
}

importPattern(1, kick);
importPattern(1, hats);
importPattern(1, beat);
importPattern(2, bassline);
importPattern(3, lead);
importPattern(3, filter);
