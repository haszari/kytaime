
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';


import store from '../../../stores/store';

import * as throwdownActions from '../actions';

// I should use an @alias for these?
import * as bpmUtilities from '../../../../../lib/sequencer/bpm-utilities';
import * as patternSequencer from '../../../../../lib/sequencer/pattern-sequencer';


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


const mapStateToProps = (state, ownProps) => {
  return {
    transportPlayState: state.transport.playState,
    renderRange: state.transport.renderRange,
    triggered: _.get(state.throwdown[ownProps.snip].stems[ownProps.slug], 'trigger', false),
    lastRenderEndTime: _.get(state.throwdown[ownProps.snip].stems[ownProps.slug], 'renderPosition', 0),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { 
  };
}

class AudioStemServiceComponent extends React.Component {
  constructor(props) {
    super(props);

    this.audioFile = props.audio;
    this.tempo = props.tempo;
    this.sampleLengthBeats = props.duration;
    this.audioContext = props.audioContext;
    this.secPerBeat = (60 / this.tempo);

    this.startBeats = props.startBeats || [0];
    this.endBeats = props.endBeats || [0];

    this.triggered = false;
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
  
  componentWillUnmount() {
    // what audio objects do we need to free?
    this.stopAt();
  }
  
  // shouldComponentUpdate(props) {
  //   return props.events.length > 0;
  // }
  
  componentWillUpdate(props) {
    const { snip, slug, triggered, renderRange, lastRenderEndTime, transportPlayState } = props;

    if (transportPlayState == "stopped") {// need a selector alert!! (hard coded string)
      this.stopAt();
      return;
    }

    if (lastRenderEndTime >= _.get(renderRange, 'end.time', 0))
      return;

    console.log('update audio stem', slug, renderRange.start.time, lastRenderEndTime);

    const triggerState = triggered;
    const audioDestinationNode = renderRange.audioContext.destination;
    this.updateAndRenderAudio(renderRange, triggerState, audioDestinationNode);

    store.dispatch(throwdownActions.throwdown_updateSnipStemRenderPosition({
      snip: snip,
      slug: slug,
      time: renderRange.end.time,
    }));
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
    stopTimestamp = stopTimestamp || 0;
    if (this.player) {
      this.player.stop(stopTimestamp);
    }
    this.playing = false;
  }

  updateAndRenderAudio(renderRange, triggerState, audioDestinationNode) {
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
  
  render() {
    // we are an audio component, not an HTML element/DOM component
    return null;
  }
}

// export default AudioStemService;

const AudioStemService = connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioStemServiceComponent);

export default AudioStemService;