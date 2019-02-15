/*
Audio utilities:

- loading & decoding audio samples
- routing audio to stereo pair of a multi-out device (aka mixer channels)
- routing audio by convention based on part name (aka instrument => mixer channel)
*/

import _ from 'lodash';

// Download and decode audio from url, callback is passed an AudioBuffer.
// see also AudioContext::decodeAudioData
const loadSample =  function(url, audioContext, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.responseType = 'arraybuffer';
  request.onload = function () {
    console.log('sample loaded, decoding');
    audioContext.decodeAudioData(request.response, callback);
  };
  console.log('loading sample');
  request.send();
}

// Connect a web audio node audioSourceNode to the specified stereo pair of the audioDestinationNode.
// Used for setting up multi out for mixing externally.
const connectToStereoOutChannel = function(audioContext, audioSourceNode, audioDestinationNode, channelPairIndex) {
  // is there a problem with maxChannelCount??
  let merger = audioContext.createChannelMerger(audioDestinationNode.maxChannelCount);
  let splitter = audioContext.createChannelSplitter(2);
  audioSourceNode.connect(splitter);
  merger.connect(audioDestinationNode);
  splitter.connect(merger, 0, (channelPairIndex * 2) + 0);
  splitter.connect(merger, 1, (channelPairIndex * 2) + 1);
}

// Connect the audioSourceNode to a stereo pair on audioDestinationNode based on the part name.
// Used to set up standard instrument routings.
// TODO this logic should be factored out to a shared module & used for audio and midi.
// see also midiUtilities.channelMap
const connectToChannelForPart = function(audioContext, audioSourceNode, audioDestinationNode, partName) {
  // default - drums, percussion, etc
  let outputChannelPairOffset = 0;

  if (_.includes(['sub', 'bass', 'ridge'], partName)) 
    outputChannelPairOffset = 1;
  else if (_.includes(['synth', 'chords', 'uplands'], partName)) 
    outputChannelPairOffset = 2;
  if (_.includes(['lead', 'pad', 'fx', 'voc', 'vox', 'vocal', 'hills'], partName)) 
    outputChannelPairOffset = 3;

  connectToStereoOutChannel(audioContext, audioSourceNode, audioDestinationNode, outputChannelPairOffset);    
}

export default {
  loadSample,
  connectToStereoOutChannel,
  connectToChannelForPart,
}