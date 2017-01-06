
// styles
require('./styles/app.scss');

import React from 'react';
import {render} from 'react-dom';

import { Provider } from 'react-redux'

import sequencer from './sequencer';

import store from './stores/store';
import * as actions from './stores/actions';

import SequencerApp from './components/container/sequencer-app.jsx';
import SequenceGrid from './components/container/pattern-grid.jsx';

function App() {
   return (
      <Provider store={store}>
         {/* Provider likes to wrap a single element */}
         <div>

            {/* ahem, this is toolbar */} 
            <SequencerApp /> 

            {/* FAKE  pattern lines - each line goes to a channel */}
            <section id="patternLines">

               <SequenceGrid />

               <div className="row expanded align-middle patternRow patternRow-b">
                  <div className="shrink columns">
                     <div className="pattern"></div>
                  </div>
                  <div className="shrink columns">
                     <div className="pattern playing"></div>
                  </div>
                  <div className="shrink columns">
                     <div className="pattern"></div>
                  </div>
                  <div className="shrink columns">
                     <div className="pattern"></div>
                  </div>
               </div>

               <div className="row expanded align-middle patternRow patternRow-c">
                  <div className="shrink columns">
                     <div className="pattern"></div>
                  </div>
               </div>
            </section>
         </div>
      </Provider>
   );
}

var appDiv = document.createElement('div');
document.body.appendChild(appDiv);

render(<App/>, appDiv);



import {beat, bassline, lead, filter, send} from './lib/example-patterns';

sequencer.setPattern({ 
   beat: beat, 
   bassline: bassline, 
   lead: lead,
   filter: filter,
   send: send
});

store.dispatch(actions.addPattern({ id: 'beat' }));
store.dispatch(actions.addPattern({ id: 'bassline' }));
store.dispatch(actions.addPattern({ id: 'lead' }));

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

