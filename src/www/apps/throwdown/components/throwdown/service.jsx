
import * as bpmUtilities from '../../../../lib/sequencer/bpm-utilities';
import * as patternSequencer from '../../../../lib/sequencer/pattern-sequencer';

import _ from 'lodash';
import Hjson from 'hjson';


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


class ThrowdownAudioStem {
  constructor(options) {
    this.audioFile = options.audio;
    this.tempo = options.tempo;
    this.sampleLengthBeats = options.duration;
    this.audioContext = options.audioContext;
    this.secPerBeat = (60 / this.tempo);

    this.startBeats = options.startBeats || [0];
    this.endBeats = options.endBeats || [0];

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

  playAt(startTimestamp, startBeat, transportBpm, audioDestinationNode) {
    let rate = transportBpm / this.tempo;
    // console.log(rate, this.audioContext.currentTime, time);

    this.player = this.audioContext.createBufferSource();
    this.player.buffer = this.buffer;
    
    this.player.playbackRate.value = rate;

    this.player.loop = true;
    this.player.loopStart = 0 * this.secPerBeat;

    this.player.loopEnd = this.sampleLengthBeats * this.secPerBeat;

    this.player.connect(audioDestinationNode);

    // this.player.start();
    this.player.start(startTimestamp, startBeat * this.secPerBeat);
  }

  stopAt(stopTimestamp) {
    if (this.player) {
      this.player.stop(stopTimestamp);
    }
    this.playing = false;
  }

  updateAndRender(renderRange, triggerState, audioDestinationNode) {
    if (!this.loaded) 
      return;

    this.triggered = triggerState;

    let triggerInfo = patternSequencer.renderPatternTrigger(
      renderRange, 
      this.triggered,
      this.playing, 
      this.sampleLengthBeats,
      this.startBeats,
      this.endBeats,
    );
    this.playing = triggerInfo.isPlaying;

    // here we "render" a single note-like event for the onset or offset of the audio stem
    // the API supports this but makes it feel strange .. 
    // e.g. fake ignored duration value
    let triggerEvents = [];
    if (triggerInfo.triggerOnset >= 0) {
      triggerEvents = patternSequencer.renderPatternEvents(renderRange, this.sampleLengthBeats, [{ start: triggerInfo.triggerOnset, duration: -1 }]);
      let time = (triggerEvents[0].start + renderRange.audioContextTimeOffsetMsec) / 1000;
      let beat = triggerInfo.triggerOnset;
      console.log(`audio  onset t=${time.toFixed(2)} b=${beat.toFixed(2)} c=${this.audioContext.currentTime} ~c=${renderRange.audioContextTimeOffsetMsec}`)

      this.playAt(time, triggerInfo.triggerOnset, renderRange.tempoBpm, audioDestinationNode);
    }
    else if (triggerInfo.triggerOffset >= 0) {
      triggerEvents = patternSequencer.renderPatternEvents(renderRange, this.sampleLengthBeats, [{ start: triggerInfo.triggerOffset, duration: -1 }]);
      let time = (triggerEvents[0].start + renderRange.audioContextTimeOffsetMsec) / 1000;
      let beat = triggerInfo.triggerOffset;
      console.log(`audio offset t=${time.toFixed(2)} b=${beat.toFixed(2)} c=${this.audioContext.currentTime} ~c=${renderRange.audioContextTimeOffsetMsec}`)

      this.stopAt(time);    
    }
  }
}

class Throwdown {
  constructor(options) {
    this.name = options.name || 'test';
    this.tempo = options.tempo || 120;
    this.key = options.key || 'C';
    this.audioContext = options.audioContext;

    this.audioStems = _.filter(options.patterns, (patternData) => {
      return patternData.audio && (patternData.audio.length > 0);
    }).map((patternData) => {
    
      return new ThrowdownAudioStem({
        tempo: this.tempo, 
        audioContext: this.audioContext,
        ...patternData
      });
    });
  }

  updateAndRender(renderRange, triggerState, midiOutPort, audioDestinationNode) {
    _.map(this.audioStems, (audioStem) => {
      audioStem.updateAndRender(renderRange, triggerState, audioDestinationNode);
    });
  }

  stop() {
    _.map(this.audioStems, (audioStem) => {
      audioStem.stopAt(0);
    });
  }
}


let mivova;
let throwdownData;


// load default data
function loadThrowdownMetadata() {
  fetch('/throwdown/default.hjson')
    .then(function(response) {
      return response.text();
    })
    .then(function(bodyText) {
      return Hjson.parse(bodyText);
    })
    .then(function(throwdowns) {
      console.log('default throwdown data loaded');
      throwdownData = throwdowns;
    });
}

const renderThrowdown = (renderRange, triggerState, midiOutPort) => {
  const audioDestinationNode = renderRange.audioContext.destination;

  // lazy initialise whole throwdown on first playback (temporary)
  if (!mivova)
    mivova = new Throwdown({
      audioContext: renderRange.audioContext,
      ...throwdownData.mivova
    });

  mivova.updateAndRender(renderRange, triggerState, midiOutPort, audioDestinationNode);
}

loadThrowdownMetadata();

const stopThrowdown = () => {
  if (mivova)
    mivova.stop();
}

export default {
  render: renderThrowdown,
  stop: stopThrowdown
}
