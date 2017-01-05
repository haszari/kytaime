import WebMidiHelper from '../../lib/web-midi-helper';
import sequencer from '../../sequencer';
import midiUtilities from '../../lib/midi-utilities';


const requestedPortName = "IAC Driver Bus 1";

import {beat, bassline, lead, filter, send} from '../../lib/example-patterns';

import store from '../../stores/store';
import { transportReadyToPlay } from '../../stores/actions';



sequencer.setPattern({ 
   beat: beat, 
   bassline: bassline, 
   lead: lead,
   filter: filter,
   send: send
});

window.sequencer = sequencer;
// window.midiOutPort = midiOutPort;

let midiOutPort = null;

function initialiseTransport() {
   if (sequencer) {
      sequencer.setOptions({
         port: midiOutPort,
         metronomeChannel: midiUtilities.channelMap.drums,
         metronomeNote: midiUtilities.drumMap.stick,
         metronomeOn: false
      });
      // transport.start();
   }
}

WebMidiHelper.openMidiOut({
   deviceName: requestedPortName, // default
   callback: function(info) {
      if (info.port) {
         midiOutPort = info.port;
         console.log("Using " + midiOutPort.name);

         initialiseTransport();

         store.dispatch(transportReadyToPlay(true));
      }
   }.bind(this)
});


import { connect } from 'react-redux';
// import transportCurrentBeat from '../../stores/actions';
import PlayButton from '../presentation/play-button.jsx';


const mapStateToProps = (state, ownProps) => {
   return {
      readyToPlay: state.transportReadyToPlay,
      beatNumber: state.transportCurrentBeat,

      // these guys directly pull state out of sequencer (app state)
      // (rather than redux/store)
      // this seems slightly wrong .. ? 
      // I think it's ok, we'll see ...
      isPlaying: sequencer.isPlaying(),
      onClick: () => {
         sequencer.togglePlay();
      }
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      // we'll hook up toggle play here??
      // onBeatTick: () => {
      //    dispatch(transportCurrentBeat(ownProps.beatNumber + 1))
      // }
   }
}


const SequencerApp = connect(
   mapStateToProps,
   mapDispatchToProps
)(PlayButton);

export default SequencerApp;