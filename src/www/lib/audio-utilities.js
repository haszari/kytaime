
import { getZeroChannelForPart } from './sequencer/midi-utilities';

export function loadSample (url, audioContext, callback) {
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
