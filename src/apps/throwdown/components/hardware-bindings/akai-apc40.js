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
  console.log( `APC40 ch${ message.channel } ${ message.messageType } number=${ message._data[1] } amount=${ message._data[2] }` );

  if ( message.messageType === 'noteon' ) {
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

    // For now all our hardware mapping will affect first deck.
    // In future we could have a "focus" deck and up/down navigation.
    const deckIndex = 0;

    // 53-57 (ch0) are scene launch buttons
    if ( message.key >= 82 && message.key <= 86 && message.channel === 0 ) {
      // toggleDeckTriggeredSection
      store.dispatch(
        throwdownActions.toggleDeckTriggeredSection( {
          deckIndex: deckIndex,
          sectionIndex: message.key - 82,
        } )
      );
    }

    // 53-57 are clip launch buttons across ch0-7
    if ( message.key >= 53 && message.key <= 57 ) {
      //
    }

    // 52 is clip stop buttons across ch0-7
    if ( message.key === 52 ) {
      //
    }
  }

  if ( message.messageType === 'controlchange' ) {
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
