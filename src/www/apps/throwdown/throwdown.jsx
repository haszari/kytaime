
import * as bpmUtilities from '../../lib/sequencer/bpm-utilities';

import _ from 'lodash';

// audio is outside source code this time ??
// const audioPath = '/Users/rua/Music/iTunes/iTunes Media/Music/Haszari/Haszari Renders - Snips Stems/';
const audioPath = '/audio/stems/';

const throwdowns = {
  mivova: {
    name: 'mivova',
    tempo: 116,
    key: 'Am',
    patterns: {
      beat: {
        audio: audioPath + '20180425--mivova--padscape--beat.mp3',
        tempo: 122,
        duration: 8,
        part: 'drums',
        starts: [0, 3],
        ends: [0, 0.1],
      }
    }   
  }
};


function getSample (url, audioContext, cb) {
   var request = new XMLHttpRequest();
   request.open('GET', url);
   request.responseType = 'arraybuffer';
   request.onload = function () {
      audioContext.decodeAudioData(request.response, cb);
   };
   request.send();
}

// this routine is probable part of what we want from sequencer/bpm-utilities
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

    this.loaded = new Promise((resolve, reject) => {      
       getSample(this.audioFile, this.audioContext, (buffer) => {
          this.buffer = buffer;
          resolve();
       });
    });
  }

  playAt(startTime, transportBpm, audioDestinationNode) {
    let rate = transportBpm / this.tempo;
    // console.log(rate, this.audioContext.currentTime, time);

    this.player = this.audioContext.createBufferSource();
    this.player.buffer = this.buffer;
    
    this.player.playbackRate.value = rate;

    this.player.loop = true;
    this.player.loopStart = 0 * this.secPerBeat;

    this.player.loopEnd = this.sampleLengthBeats * this.secPerBeat;

    this.player.connect(audioDestinationNode);

    this.player.start(startTime);
  }

  updateAndRender(renderRange, audioDestinationNode) {
    if (!this.loaded) 
      return;

    // just need to work out when the render range crosses our start point, then trigger the thing
    const ourStartTime = 0;
    if (bpmUtilities.valueInWrappedBeatRange(ourStartTime, renderRange.start.beat, renderRange.end.beat, this.sampleLengthBeats)) {
      const startTime = getTimeOffsetForBeat(ourStartTime, renderRange.start.beat, renderRange.end.beat, renderRange.tempoBpm, this.sampleLengthBeats);
      this.playAt(startTime, renderRange.tempoBpm, audioDestinationNode);
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
      return patternData.audio.length > 0;
    }).map((patternData) => {
      return new ThrowdownAudioStem({
        tempo: this.tempo, 
        audioContext: this.audioContext,
        ...patternData
      });
    });
  }

  updateAndRender(renderRange, midiOutPort, audioDestinationNode) {
    _.map(this.audioStems, (audioStem) => {
      audioStem.updateAndRender(renderRange, audioDestinationNode);
    });
  }
}

let mivova;

const renderThrowdown = (renderRange, midiOutPort, audioDestinationNode) => {
  if (!mivova)
    mivova = new Throwdown({
      audioContext: audioDestinationNode.context,
      ...throwdowns.mivova
    });
  mivova.updateAndRender(renderRange, midiOutPort, audioDestinationNode);
}

export default renderThrowdown;
