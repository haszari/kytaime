document.write("Sequencer coming soon!");

import WebMidiHelper from './web-midi-helper';

WebMidiHelper.openMidiOut({
   deviceName: "", // default
   callback: function() {
      console.log("We have MIDI out!");
   }
});