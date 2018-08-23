
import _ from 'lodash';

import * as audioUtilities from '@kytaime/lib/audio-utilities';
import * as bpmUtilities from '@kytaime/lib/sequencer/bpm-utilities';
import * as patternSequencer from '@kytaime/lib/sequencer/pattern-sequencer';


class AudioSlicePlayer {
  constructor(props) {
    this.slug = props.slug;

    this.part = props.part || "drums";
    
    this.audioFile = props.audio;
    this.tempo = props.tempo;

    this.audioContext = props.audioContext;
    this.secPerBeat = (60 / this.tempo);

    this.triggered = true;
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
    // this.autosliced = false;
    this.duration = props.duration;

    if ( ! this.slices || ! this.slices.length ) {
      // this.autosliced = true;
      // default to full slice
      this.slices = [{
          start: 0, 
          duration: this.duration,
          beat: 0,
      }];
    }

    this.updatePlayingState = props.updatePlayingState;
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
      audioUtilities.connectToChannelForPart(this.audioContext, player, audioDestinationNode, this.part);    
    else
      player.connect(audioDestinationNode);
 
    // this.player.start();
    player.start(startTimestamp, startBeat * this.secPerBeat);
    player.stop(stopTimestamp);
    this.player = player;
  }
  
  stopAt(stopTimestamp) {
    if (this.player) {
      this.player.stop(stopTimestamp);
      this.player = null;
      // todo  .. send this after the timestamp
      this.updatePlayingState( false );
    }
  }


  stop() {
    this.stopAt(0);
  }

  updateAndRenderAudio(renderRange, triggerState, playingState, audioDestinationNode) {
    const { duration } = this;
    if (!this.loaded) 
      return;

    this.triggered = triggerState;
    this.playing = playingState;

    let triggerInfo = patternSequencer.renderPatternTrigger(
      renderRange, 
      this.triggered,
      this.playing, 
      duration,
      this.startBeats,
      this.endBeats,
    );

    this.playing = triggerInfo.isPlaying;
    this.updatePlayingState( this.playing );

    // slices: start time in pattern beats

    // filteredSlices: start time in pattern beats; excludes slices that are pre-trigger
    let filteredSlices = _.filter(this.slices, function(sliceEvent) {
      return bpmUtilities.valueInWrappedBeatRange(
        sliceEvent.start, 
        triggerInfo.startBeat % duration, 
        triggerInfo.endBeat % duration, 
        duration
      );
    });

    // scheduledSlices: start time in msec
    let scheduledSlices = patternSequencer.renderPatternEvents(renderRange, duration, filteredSlices);

    const renderEventTime = (time) => (time + renderRange.audioContextTimeOffsetMsec) / 1000;

    _.map(scheduledSlices, (sliceRenderInfo) => {
      const startTime = renderEventTime(sliceRenderInfo.start);
      const stopTime = renderEventTime(sliceRenderInfo.start + sliceRenderInfo.duration);
      this.playSliceAt(startTime, stopTime, sliceRenderInfo.event.beat, renderRange.tempoBpm, audioDestinationNode);
    });
  }
}

export default AudioSlicePlayer;