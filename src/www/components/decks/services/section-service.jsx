
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';


// should I hook up the actions using redux instead - mapDispatchToProps?
import store from '../../../stores/store';

import * as actions from '../actions';
import * as selectors from '../selectors';


// I should use an @alias for these?
import * as audioUtilities from '@kytaime/lib/audio-utilities';
import * as bpmUtilities from '@kytaime/lib/sequencer/bpm-utilities';
import * as patternSequencer from '@kytaime/lib/sequencer/pattern-sequencer';


class AudioSlicePlayer {
  constructor(props) {
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

  connectToChannelForPart(audioContext, audioSourceNode, audioDestinationNode, partName) {
    // default - drums, percussion, etc
    let outputChannelPairOffset = 0;

    if (_.includes(['sub', 'bass', 'ridge'], partName)) 
      outputChannelPairOffset = 1;
    else if (_.includes(['synth', 'chords', 'uplands'], partName)) 
      outputChannelPairOffset = 2;
    if (_.includes(['lead', 'pad', 'fx', 'voc', 'vox', 'vocal', 'hills'], partName)) 
      outputChannelPairOffset = 3;

    this.connectToStereoOutChannel(this.audioContext, audioSourceNode, audioDestinationNode, outputChannelPairOffset);    
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

  updateAndRenderAudio(renderRange, triggerState, triggerPhraseDuration, audioDestinationNode) {
    const { duration } = this;
    if (!this.loaded) 
      return;

    this.triggered = triggerState;

    let triggerInfo = patternSequencer.renderPatternTrigger(
      renderRange, 
      this.triggered,
      this.playing, 
      triggerPhraseDuration,
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
}



const mapStateToProps = (state, ownProps) => {
  const ownSection = selectors.getSection(state, { 
    deckId: ownProps.deckId,
    sectionId: ownProps.id,
  });
  return { 
    transportPlayState: state.transport.playState,
    renderRange: state.transport.renderRange,
    lastRenderEndTime: ownSection ? ownSection.renderPosition : null,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { };
}

// class DeckServiceComponent extends React.Component {
class SectionServiceComponent extends React.Component {
  constructor(props) {
    super(props);

    const { audioContext, parts } = props;

    this.slicePlayers = _.filter(parts, (part) => {
      return (part.data.audio && part.data.pattern);
    }).map((part) => {
      const { audio, pattern } = part.data;
      return new AudioSlicePlayer({
        key: part.slug,

        audioContext: audioContext,
        
        part: part.part,

        audio: audio.file,
        tempo: audio.tempo, 

        duration: pattern.duration,
        startBeats: pattern.startBeats, 
        endBeats: pattern.endBeats, 
        slices: pattern.slices,

      });
    });
  }

  componentWillUpdate(props) {
    const { deckId, id, triggered, playing, triggerPhraseDuration, renderRange, lastRenderEndTime, transportPlayState } = props;

    if (lastRenderEndTime >= _.get(renderRange, 'end.time', 0))
      return;


    const isThisSectionTriggered = triggered;

    let triggerInfo = patternSequencer.renderPatternTrigger(
      renderRange, 
      triggered,
      playing, 
      triggerPhraseDuration,
    );

    const isThisSectionPlaying = triggerInfo.isPlaying;
    // if (triggered || isThisSectionPlaying) 
    //   console.log(`beat=${Math.round(renderRange.start.beat * 100) / 100} sec${id} trig=${triggered} p=${isThisSectionPlaying} %=${triggerPhraseDuration}`);

    if (isThisSectionPlaying) {      
      const audioDestinationNode = renderRange.audioContext.destination;
      _.map(this.slicePlayers, (player) => {
        const isThisPartTriggered = triggered;
        player.updateAndRenderAudio(renderRange, isThisPartTriggered, triggerPhraseDuration, audioDestinationNode);
      });
    }

    store.dispatch(actions.throwdown_updateSectionRenderPosition({
      deckId: deckId,
      sectionId: id,
      time: renderRange.end.time,
    }));
    if (isThisSectionPlaying) {
      store.dispatch(actions.throwdown_setPlayingSection({
        deckId: deckId,
        sectionId: id,
      }));
    }
  }


  render() {
    // we are a service component!
    return null;
  }
}

const SectionService = connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionServiceComponent);

export default SectionService;