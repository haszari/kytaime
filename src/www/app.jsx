import importMidiFile from './import-midi-file';

// render our main template/html
var template = require("./templates/main.html");
var templateDiv = document.createElement('div');
document.body.appendChild(templateDiv);
document.addEventListener("DOMContentLoaded", function() {
   templateDiv.innerHTML = template;
});

// file import is temporarily broken

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


import React from 'react';
import {render} from 'react-dom';

// no app state yet, so no redux (we'll see..)
// import { createStore } from 'redux'
// import kytaimeApp from './reducers'
// let store = createStore(kytaimeApp)

import Transport from './components/transport.jsx';

class App extends React.Component {
   render () {
      return (
         <div className="app">
            <p> Hello Kytaime!</p>
            <Transport />
         </div>
      );
   }
}

var appDiv = document.createElement('div');
document.body.appendChild(appDiv);

render(<App/>, appDiv);