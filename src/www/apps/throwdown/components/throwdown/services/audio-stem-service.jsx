
import _ from 'lodash';

import React from 'react';


function getSample (url, audioContext, cb) {
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.responseType = 'arraybuffer';
  request.onload = function () {
    console.log('sample loaded, decoding');
    audioContext.decodeAudioData(request.response, cb);
  };
  console.log('loading sample');
  request.send();
}

// this routine is probably part of what we want from sequencer/bpm-utilities
function getTimeOffsetForBeat(eventBeat, renderStart, renderEnd, transportBpm, wrapBeats) {  
  let beatOffset = eventBeat - renderStart;
  if ((renderEnd < renderStart) && (eventBeat < renderStart)) {
      beatOffset += wrapBeats;
  }
  var offsetMs = bpmUtilities.beatsToMs(transportBpm, beatOffset);
  return offsetMs;
}


class AudioStemService extends React.Component {
  constructor(props) {
    super(props);

    this.audioFile = props.audio;
    this.tempo = props.tempo;
    this.sampleLengthBeats = props.duration;
    this.audioContext = props.audioContext;
    this.secPerBeat = (60 / this.tempo);

    this.startBeats = props.startBeats || [0];
    this.endBeats = props.endBeats || [0];

    this.triggered = true;
    this.playing = false;

    this.buffer = undefined;

    this.loaded = new Promise((resolve, reject) => {      
      getSample(this.audioFile, this.audioContext, (buffer) => {
        console.log('sample decoded, ready to play');
        this.buffer = buffer;
        resolve();
      });
    });
  }

  // componentWillMount() {
  //   this.audioContext = new AudioContext();
  // }
  
  // componentWillUnmount() {
  //   this.audioContext.close();
  // }
  
  // shouldComponentUpdate(props) {
  //   return props.events.length > 0;
  // }
  
  // componentWillUpdate(props) {
  //   props.events.forEach(this.processEvent.bind(this));
  //   props.dispatch({
  //     type: "CLEAR_EVENT_QUEUE"
  //   });
  // }
  
  render() {
    return null;
  }
}

export default AudioStemService;