
// styles
require('./styles/app.scss');

import React from 'react';
import {render} from 'react-dom';

import { Provider } from 'react-redux'

import shortid from 'shortid';

import kytaimePatternSequencer from './kytaime-pattern-sequencer';

import store from './stores/store';
import * as actions from './stores/actions';

import Toolbar from './components/container/toolbar.js';
import PatternGrid from './components/container/pattern-grid.js';

function App() {
   return (
      <Provider store={store}>
         {/* Provider likes to wrap a single element */}
         <div>
            <Toolbar /> 
            <PatternGrid />
         </div>
      </Provider>
   );
}

var appDiv = document.createElement('div');
document.body.appendChild(appDiv);

// block file drop redirect
document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())

// initial state 
let numRows = 6;
store.dispatch(actions.setGridNumRows(numRows));
for (let i=0; i<numRows; i++)
   store.dispatch(actions.setGridRowMidiChannel({ rowIndex: i, midiChannel: i+1 }));


render(<App/>, appDiv);

// budgo ui
window.shortid = shortid;

window.ui = { 
   setGridRows: (numRows) => {
      store.dispatch(actions.setGridNumRows(numRows));
   },
   setRowChannel: (rowIndex, midiChannel) => {
      store.dispatch(actions.setGridRowMidiChannel({ rowIndex, midiChannel }))
   }
}
window.exportProject = () => {
   return JSON.stringify(store.getState());
}
window.importProject = (json) => {
   let stateTree = JSON.parse(json);
   store.dispatch(actions.importRehydrate(stateTree)); 
} 


let importPattern = (channel, patternObject) => {
   store.dispatch(actions.addPattern({ 
      channel: channel,
      duration: patternObject.duration,
      notes: patternObject.notes,
      startBeats: patternObject.startBeats,
      endBeats: patternObject.endBeats
   }));
}

// import {hats, kick, beat, bassline, lead, filter, send} from './lib/example-patterns';

// importPattern(1, kick);
// importPattern(1, hats);
// importPattern(1, beat);
// importPattern(2, bassline);
// importPattern(3, lead);
// importPattern(3, filter);
