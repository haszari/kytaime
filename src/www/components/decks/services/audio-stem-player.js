
import _ from 'lodash';

import * as audioUtilities from '@kytaime/lib/audio-utilities';
import * as bpmUtilities from '@kytaime/lib/sequencer/bpm-utilities';
import * as patternSequencer from '@kytaime/lib/sequencer/pattern-sequencer';

const minGain = 0.001;
const maxGain = 1.0;

class AudioStemPlayer_deprecated {
  constructor(props) {
    this.slug = props.slug;

    this.part = props.part || "drums";
    
    this.attack = props.attack || 0.02;
    this.release = props.release || 0.02;

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
    this.startOffset = props.startOffset || 0;

    // we allow zeroBeat in beats or seconds, seconds is a string with suffix s
    this.zeroBeatSeconds = parseFloat(props.zeroBeat) || 0;
    if ( props.zeroBeat && 's' !== props.zeroBeat.slice(-1) ) {
      this.zeroBeatSeconds = props.zeroBeat * this.secPerBeat;
    }

    this.updatePlayingState = props.updatePlayingState;

    this.player = null;
  }

  playLoopFrom(startTimestamp, startBeat, transportBpm, audioDestinationNode) {
    let rate = transportBpm / this.tempo;

    let player = this.audioContext.createBufferSource();
    player.buffer = this.buffer;

    let faderGain = this.audioContext.createGain();
    faderGain.gain.setValueAtTime( minGain, startTimestamp );
    faderGain.gain.linearRampToValueAtTime( maxGain, startTimestamp + this.attack );

    player.playbackRate.value = rate;

    player.loop = true;
    player.loopStart = ( startBeat * this.secPerBeat ) + ( this.startOffset * this.secPerBeat ) + this.zeroBeatSeconds;
    player.loopEnd = ( this.duration * this.secPerBeat ) + player.loopStart;

    player.connect(faderGain);

    if (audioDestinationNode.channelCount > 2)
      audioUtilities.connectToChannelForPart(this.audioContext, faderGain, audioDestinationNode, this.part);    
    else
      faderGain.connect(audioDestinationNode);
 
    player.start(startTimestamp, player.loopStart);

    this.player = player;
    this.faderGain = faderGain;
  }

  stopLoopAt(stopTimestamp) {
    if (this.player) {
      if ( !stopTimestamp )
        stopTimestamp = this.audioContext.currentTime + this.release;

      this.faderGain.gain.setValueAtTime( maxGain, stopTimestamp - this.release );
      this.faderGain.gain.linearRampToValueAtTime( minGain, stopTimestamp );

      this.player.stop(stopTimestamp);

      this.faderGain = null;
      this.player = null;

      // todo  .. send this after the timestamp
      this.updatePlayingState( false );
    }
  }

  stop() {
    this.stopLoopAt(0);
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

export default AudioStemPlayer_deprecated;