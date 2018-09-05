
import { getZeroChannelForPart } from './sequencer/midi-utilities';


// We maintain a dictionary of audio files, keyed by URL
// This ensures we only download and decode one copy of each file
const audioFiles = {};

class AudioFileBufferDecoder {
  constructor({ audioContext, url, callback }) {
    this.onDecoded = this.onDecoded.bind(this);

    this.url = url;
    this.callbacks = [ callback ];
    this.buffer = null;

    this.request = new XMLHttpRequest();
    this.request.open('GET', url);
    this.request.responseType = 'arraybuffer';

    let onDecoded = this.onDecoded;
    let request = this.request;
    this.request.onload = function () {
      console.log(`decoding sample ${ url }`);
      audioContext.decodeAudioData( request.response, onDecoded );
    };

    console.log( `loading sample ${ this.url }` );
    this.request.send();
  }

  onDecoded( buffer ) {
    console.log(`decoded sample ${ this.url }`);

    this.buffer = buffer;
    const callbacks = this.callbacks;
    this.callbacks = [];

    callbacks.forEach( ( callback ) => {
      callback( this.buffer );
    });
  }

  addCallback( callback ) {
    if (this.buffer)
      callback( this.buffer );
    else
      this.callbacks.push( callback );
  }

}

export function loadSample (url, audioContext, callback) {
  if (audioFiles[url]) {
    audioFiles[url].addCallback(callback);
    return;
  }

  audioFiles[url] = new AudioFileBufferDecoder( {
    url, audioContext, callback
  } );
}


export function connectToStereoOutChannel(audioContext, audioSourceNode, audioDestinationNode, channelPairIndex) {
  // is there a problem with maxChannelCount??
  let merger = audioContext.createChannelMerger(audioDestinationNode.maxChannelCount);
  let splitter = audioContext.createChannelSplitter(2);
  audioSourceNode.connect(splitter);
  merger.connect(audioDestinationNode);
  splitter.connect(merger, 0, (channelPairIndex * 2) + 0);
  splitter.connect(merger, 1, (channelPairIndex * 2) + 1);
}


export function connectToChannelForPart(audioContext, audioSourceNode, audioDestinationNode, partName) {
  const outputChannelPairOffset = getZeroChannelForPart(partName);
  connectToStereoOutChannel(audioContext, audioSourceNode, audioDestinationNode, outputChannelPairOffset);    
}
