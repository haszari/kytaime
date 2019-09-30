import MIDIMessage from 'midimessage';

import midiPorts from '@kytaime/midi-ports';

import store from '../../store/store';

import transportActions from '../transport/actions';
import throwdownActions from '../throwdown/actions';

function getSpread64OffsetValue( value ) {
  if ( value > 63 && value < 128 ) { return -( 128 - value ); }
  if ( value > 0 && value < 64 ) { return ( value ); }
  return 0;
}

function onMidiMessage( event ) {
  const message = MIDIMessage( event );
  console.log( message );

  if ( message.messageType == 'noteon' ) {
    switch ( message.key ) {
      case 91:
        store.dispatch(
          transportActions.togglePlayback()
        );
        break;
      case 93:
        store.dispatch(
          throwdownActions.toggleDeferAllTriggers()
        );
        break;
    }

    if ( message.key >= 53 && message.key <= 57 ) {
      store.dispatch(
        throwdownActions.toggleDeckTriggeredSection( {
          deckIndex: message.key - 53,
          sectionIndex: message.channel,
        } )
      );
    }
  }

  if ( message.messageType == 'controlchange' ) {
    switch ( message.controllerNumber ) {
      case 47: {
        store.dispatch(
          transportActions.adjustNextTempo(
            getSpread64OffsetValue( message.controllerValue ) * 0.1
          )
        );
      }
    }
  }
}

function openMidiInput( requestedPortName ) {
  let midiInPort;
  midiPorts.openMidiInput( {
    deviceName: requestedPortName,
    callback: function( info ) {
      if ( info.port ) {
        midiInPort = info.port;

        midiInPort.onmidimessage = onMidiMessage;

        console.log( 'Mapping from ' + midiInPort.name );
      // midiOutDevice = midiOutPort.name;
      }
    },
  } );
}

openMidiInput( 'Akai APC40' );
