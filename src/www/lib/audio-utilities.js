
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
