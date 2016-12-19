
// styles
require('./styles/app.scss');

import React from 'react';
import {render} from 'react-dom';

import { Provider } from 'react-redux'

import store from './stores/store';

import TickingTransport from './components/ticking-transport.jsx';

function App() {
   return (
      <Provider store={store}>
         {/* Provider likes to wrap a single element */}
         <div>

            {/* main top toolbar - import/export menu, transport, loop status */}
            <section className="toolbar noSelect">
               <div className="row expanded">
                  <div className="shrink columns">
                     <div className="icon-menu"></div>
                  </div>
                  <div className="small columns text-center">
                     <div className="row align-center">
                        <div className="">3</div>
                        <div className="">/32</div>
                     </div>
                  </div>
                  <div className="shrink columns text-right">
                     <div className="icon-play"></div>
                  </div>
               </div>
            </section>

            {/* pattern lines - each line goes to a channel */}
            <section id="patternLines">
               <div className="row expanded align-middle patternRow patternRow-a">
                  <div className="">
                     <div className="pattern playing"></div>
                  </div>
                  <div className="">
                     <div className="pattern"></div>
                  </div>
                  <div className="small columns">
                     <div className="patternLine-addPattern">+</div>
                  </div>
                  <div className="">
                     <div className="patternLine-channel">1</div>
                  </div>
               </div>

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

