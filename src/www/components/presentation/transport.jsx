import React from 'react';

import WebMidiHelper from '../../web-midi-helper';
import transport from '../../transport';
import midiUtilities from '../../midi-utilities';


const requestedPortName = "IAC Driver Logic MIDI In";

import {beat, bassline, lead, filter, send} from '../../example-patterns';


transport.setPattern({ 
   beat: beat, 
   bassline: bassline, 
   lead: lead,
   filter: filter,
   send: send
});

window.transport = transport;
// window.midiOutPort = midiOutPort;


class Transport extends React.Component {
   // todo document prop types - beatNumber is int

   constructor(props) {
      super(props);
      this.state = {
         readyToPlay: false,
         isPlaying: false,
         beatNumber: ''
      };
      this.handlePlay = this.handlePlay.bind(this);
      this.handleStop = this.handleStop.bind(this);
   }

   componentDidMount() {
      let midiOutPort = null;

      function initialiseTransport() {
         if (transport) {
            transport.setOptions({
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

               this.setState({ readyToPlay: true });
            }
         }.bind(this)
      });

   }

   componentWillUnmount() {
      //  .... ideally we'd free the transport (and its web worker!!) here.
      transport.stop();
   }

   handlePlay() {
      this.setState({
         isPlaying: true
      });
      transport.start();
   }

   handleStop() {
      this.setState({
         isPlaying: false

      });
      transport.stop();
   }

   render () {
      const buttonText = this.state.isPlaying ? "Stop" : "Play";
      // doing this dance so the click handler isn't setting state in terms of previous state
      // that's a react no-no as updates may get coalesced
      // (could also use setState with function arg)
      const onClick = this.state.isPlaying ? this.handleStop : this.handlePlay;
      return ( 
         <div>
            <div>{this.props.beatNumber}</div>
            <button onClick={onClick}  disabled={!this.state.readyToPlay}>{buttonText}</button>
         </div>
      )
   }
}


export default Transport;
