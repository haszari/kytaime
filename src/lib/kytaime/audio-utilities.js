/*
Audio utilities:

- loading & decoding audio samples
- routing audio to stereo pair of a multi-out device (aka mixer channels)
- routing audio by convention based on part name (aka instrument => mixer channel)
*/

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

export default {
  loadSample,
  connectToStereoOutChannel,
}