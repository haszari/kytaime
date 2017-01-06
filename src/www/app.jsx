
// styles
require('./styles/app.scss');

import React from 'react';
import {render} from 'react-dom';

import { Provider } from 'react-redux'

import sequencer from './sequencer';

import store from './stores/store';
import * as actions from './stores/actions';

import Toolbar from './components/container/toolbar.jsx';
import PatternGridLine from './components/container/pattern-grid-line.jsx';

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

sequencer.setPattern({ 
   kick: kick, 
   beat: beat, 
   hats: hats, 
   bassline: bassline, 
   lead: lead,
   filter: filter,
   send: send
});

store.dispatch(actions.addPattern({ id: 'kick', channel: 1 }));
store.dispatch(actions.addPattern({ id: 'beat', channel: 1 }));
store.dispatch(actions.addPattern({ id: 'hats', channel: 1 }));
store.dispatch(actions.addPattern({ id: 'bassline', channel: 2 }));
store.dispatch(actions.addPattern({ id: 'lead', channel: 3 }));

store.dispatch(actions.togglePatternTrigger({ id: 'bassline' }));

store.dispatch(actions.patternPlayState({ id: 'beat', playing: true }));




// file import is temporarily broken

// import importMidiFile from './import-midi-file';

// function onFileSelected(input) {
//    var reader = new FileReader();
//    reader.readAsArrayBuffer(input.files[0]);
//    reader.onloadend = function(event) {
//       var importedMidiFile = importMidiFile(event.target.result);
//       var lastNote = _.maxBy(importedMidiFile.notes, 'start');
//       var duration = Math.pow(2, Math.ceil(Math.sqrt(lastNote.start)));
//       window.imported = new NotePattern({
//          duration: duration,
//          channel: midiUtilities.channelMap.stab,
//          notes: importedMidiFile.notes
//       });  
//    }
// }

// window.onFileSelected = onFileSelected;


//console.log(midiUtilities);

