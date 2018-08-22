
import _ from 'lodash';

import * as audioUtilities from '@kytaime/lib/audio-utilities';
import * as bpmUtilities from '@kytaime/lib/sequencer/bpm-utilities';
import * as patternSequencer from '@kytaime/lib/sequencer/pattern-sequencer';


class AudioStemPlayer {
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

    this.duration = props.duration;

    this.updatePlayingState = props.updatePlayingState;

    this.player = null;
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

  playLoopFrom(startTimestamp, startBeat, transportBpm, audioDestinationNode) {
    let rate = transportBpm / this.tempo;

    let player = this.audioContext.createBufferSource();
    player.buffer = this.buffer;
    
    player.playbackRate.value = rate;

    player.loop = true;
    player.loopEnd = this.duration * this.secPerBeat;

    if (audioDestinationNode.channelCount > 2)
      this.connectToChannelForPart(this.audioContext, player, audioDestinationNode, this.part);    
    else
      player.connect(audioDestinationNode);
 
    player.start(startTimestamp, startBeat * this.secPerBeat);
    this.player = player;
  }

  stopLoopAt(stopTimestamp) {
    if (this.player) {
      this.player.stop(stopTimestamp);
      this.player = null;
    }
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
    this.updatePlayingState( this.playing );

    const renderEventTime = (time) => (time + renderRange.audioContextTimeOffsetMsec) / 1000;

    if ( triggerInfo.triggerOnset !== -1) {
      let scheduledEvent = patternSequencer.renderPatternEvents(renderRange, duration, [{
        start: triggerInfo.triggerOnset
      }]);
      const eventTime = renderEventTime(scheduledEvent[0].start);
      this.playLoopFrom(eventTime, scheduledEvent[0].event.start, renderRange.tempoBpm, audioDestinationNode);
    }

    if ( triggerInfo.triggerOffset !== -1) {
      let scheduledEvent = patternSequencer.renderPatternEvents(renderRange, duration, [{
        start: triggerInfo.triggerOffset
      }]);
      const eventTime = renderEventTime(scheduledEvent[0].start);
      this.stopLoopAt(eventTime);
    }

  }
}

export default AudioStemPlayer;