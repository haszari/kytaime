import MIDIMessage from 'midimessage';

import midiPorts from '@kytaime/midi-ports';

import store from '../../store/store';

import transportActions from '../transport/actions';

function onMidiMessage( event ) {
  const message = MIDIMessage( event );
  console.log( message );

  switch ( message.messageType ) {
    case 'noteon': {
      switch ( message.key ) {
        case 91: {
          store.dispatch( 
            transportActions.togglePlayback()
          );
        }
      }
    }
  }
}

function openMidiInput( requestedPortName ) {
  let midiInPort;
  midiPorts.openMidiInput({
    deviceName: requestedPortName,
    callback: function(info) {
     if (info.port) {
      midiInPort = info.port;
      
      midiInPort.onmidimessage = onMidiMessage;

      console.log("Mapping from " + midiInPort.name);
      // midiOutDevice = midiOutPort.name;
      }
    }.bind(this)
  });
}

openMidiInput( 'Akai APC40' );