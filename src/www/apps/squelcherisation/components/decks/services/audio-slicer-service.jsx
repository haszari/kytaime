
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';


import store from '../../../stores/store';

import * as throwdownActions from '../actions';

// I should use an @alias for these?
import * as audioUtilities from '../../../../../lib/audio-utilities';
import * as bpmUtilities from '../../../../../lib/sequencer/bpm-utilities';
import * as patternSequencer from '../../../../../lib/sequencer/pattern-sequencer';



const mapStateToProps = (state, ownProps) => {
  return {
    transportPlayState: state.transport.playState,
    renderRange: state.transport.renderRange,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { 
  };
}

class AudioSlicerServiceComponent extends React.Component {
  constructor(props) {
    super(props);

    this.audioFile = props.audio;
    this.tempo = props.tempo;

    this.audioContext = props.audioContext;
    this.secPerBeat = (60 / this.tempo);

    this.part = props.part || "drums";

    this.triggered = false;
    this.playing = false;

    this.buffer = undefined;

    this.loaded = new Promise((resolve, reject) => {      
      audioUtilities.loadSample(this.audioFile, this.audioContext, (buffer) => {
        console.log('sample decoded, ready to play');
        this.buffer = buffer;
        resolve();
      });
    });

    this.startBeats = props.startBeats || [0];
    this.endBeats = props.endBeats || [0];

    this.slices = props.slices;
    this.duration = props.duration;
  }

  // componentWillMount() {
  //   this.audioContext = new AudioContext();
  // }
  
  // componentWillUnmount() {
  //   // what audio objects do we need to free?
  //   this.stopAt();
  // }
  
  // shouldComponentUpdate(props) {
  //   return props.events.length > 0;
  // }
  
  componentWillUpdate(props) {
    const { snip, slug, triggered, renderRange, lastRenderEndTime, transportPlayState } = props;

    if (transportPlayState == "stopped") {// need a selector alert!! (hard coded string)
      // this.stopAt();
      return;
    }

    if (lastRenderEndTime >= _.get(renderRange, 'end.time', 0))
      return;

    // console.log('update audio stem', slug, renderRange.start.time, lastRenderEndTime);

    const triggerState = triggered;
    const audioDestinationNode = renderRange.audioContext.destination;
    this.updateAndRenderAudio(renderRange, triggerState, audioDestinationNode);

    store.dispatch(throwdownActions.throwdown_updateSnipStemRenderPosition({
      snip: snip,
      slug: slug,
      time: renderRange.end.time,
    }));
  }

  connectToChannelForPart(audioContext, audioSourceNode, audioDestinationNode, partName) {
    // default - drums, percussion, etc
    let outputChannelPairOffset = 0;

    if (_.includes(['sub', 'bass', 'ridge'], partName)) 
      outputChannelPairOffset = 1;
    else if (_.includes(['synth', 'chords', 'uplands'], partName)) 
      outputChannelPairOffset = 2;
    if (_.includes(['lead', 'pad', 'fx', 'voc', 'vocal', 'hills'], partName)) 
      outputChannelPairOffset = 3;

    this.connectToStereoOutChannel(this.audioContext, this.player, audioDestinationNode, outputChannelPairOffset);    
  }

  connectToStereoOutChannel(audioContext, audioSourceNode, audioDestinationNode, channelPairIndex) {
    // is there a problem with maxChannelCount??
    this.merger = audioContext.createChannelMerger(audioDestinationNode.maxChannelCount);
    this.splitter = audioContext.createChannelSplitter(2);
    audioSourceNode.connect(this.splitter);
    this.merger.connect(audioDestinationNode);
    this.splitter.connect(this.merger, 0, (channelPairIndex * 2) + 0);
    this.splitter.connect(this.merger, 1, (channelPairIndex * 2) + 1);
  }

  playSliceAt(startTimestamp, stopTimestamp, startBeat, transportBpm, audioDestinationNode) {
    let rate = transportBpm / this.tempo;
    // console.log(rate, this.audioContext.currentTime, time);

    // possibly keep a reference to all these players in case we want to stopAllNow()?
    let player = this.audioContext.createBufferSource();
    player.buffer = this.buffer;
    
    player.playbackRate.value = rate;

    player.loop = false;

    if (audioDestinationNode.channelCount > 2)
      this.connectToChannelForPart(this.audioContext, player, audioDestinationNode, this.part);    
    else
      player.connect(audioDestinationNode);
 
    // this.player.start();
    player.start(startTimestamp, startBeat * this.secPerBeat);
    player.stop(stopTimestamp);
  }

  updateAndRenderAudio(renderRange, triggerState, audioDestinationNode) {
    const { duration } = this;
    if (!this.loaded) 
      return;

    this.triggered = triggerState;

    let triggerInfo = patternSequencer.renderPatternTrigger(
      renderRange, 
      this.triggered,
      this.playing, 
      duration,
      this.startBeats,
      this.endBeats,
    );
    this.playing = triggerInfo.isPlaying;

    let filteredSlices = _.filter(this.slices, function(sliceEvent) {
      return bpmUtilities.valueInWrappedBeatRange(
        sliceEvent.start, 
        triggerInfo.startBeat % duration, 
        triggerInfo.endBeat % duration, 
        duration
      );
    });


    let scheduledSlices = patternSequencer.renderPatternEvents(renderRange, duration, filteredSlices);

    _.map(scheduledSlices, (sliceRenderInfo) => {
      let startTime = (sliceRenderInfo.start + renderRange.audioContextTimeOffsetMsec) / 1000,
        stopTime = (sliceRenderInfo.start + sliceRenderInfo.duration + renderRange.audioContextTimeOffsetMsec) / 1000;
      this.playSliceAt(startTime, stopTime, sliceRenderInfo.event.beat, renderRange.tempoBpm, audioDestinationNode);
    });
  }
  
  render() {
    // we are an audio component, not an HTML element/DOM component
    return null;
  }
}

// export default AudioStemService;

const AudioSlicerService = connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioSlicerServiceComponent);

export default AudioSlicerService;