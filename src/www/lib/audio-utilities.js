
function loadSample (url, audioContext, callback) {
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

export {
 loadSample
};
  
