
import _ from 'lodash';

import * as audioUtilities from '@kytaime/lib/audio-utilities';
import patternSequencer from '@kytaime/lib/sequencer/pattern-sequencer';

class BeatSamplePlayer {
  constructor(props) {
    this.props = _.defaults( props, BeatSamplePlayer.defaultProps );
    // this.throwdownRender = this.throwdownRender.bind(this);

    this.playing = false;

    this.loaded = false;
    this.loading = false;
  }

  playLoopFrom(startTimestamp, startBeat, transportBpm, audioDestinationNode) {
    let { tempoBpm, sampleDuration } = this.props;
    
    let secPerBeat = (60 / tempoBpm);
    let rate = transportBpm / tempoBpm;

    let player = audioDestinationNode.context.createBufferSource();
    player.buffer = this.buffer;
    
    player.playbackRate.value = rate;

    player.loop = true;
    player.loopEnd = sampleDuration * secPerBeat;

    if (audioDestinationNode.channelCount > 2)
      audioUtilities.connectToChannelForPart(this.audioContext, player, audioDestinationNode, this.part);    
    else
      player.connect(audioDestinationNode);
 
    player.start(startTimestamp, startBeat * secPerBeat);
    this.player = player;
  }

  stopLoopAt(stopTimestamp) {
    if (this.player) {
      this.player.stop(stopTimestamp);
      this.player = null;
    }
  }

  throwdownRender( renderRange ) {
    if ( ! this.loaded && ! this.loading ) {
      this.loading = true;
      this.loaded = new Promise( ( resolve, reject ) => {      
        audioUtilities.loadSample( this.props.audioFile, renderRange.audioContext, (buffer) => {
          console.log( 'sample decoded, ready to play' );
          this.buffer = buffer;
          resolve();
        } );
      } );
    }

    if ( ! this.buffer ) {
      return;
    }

    let { sampleDuration } = this.props;

    // note this loops forever unless we have triggered = false 
    // so the stop logic is not being tested
    var triggered = true;

    let triggerInfo = patternSequencer.renderPatternTrigger(
      renderRange, 
      triggered,
      this.playing, 
      sampleDuration,
    );

    this.playing = triggerInfo.isPlaying;
    // this.updatePlayingState( this.playing );

    const renderEventTime = (time) => (time + renderRange.audioContextTimeOffsetMsec) / 1000;

    if ( triggerInfo.triggerOnset !== -1) {
      let scheduledEvent = patternSequencer.renderPatternEvents(renderRange, sampleDuration, [{
        start: triggerInfo.triggerOnset
      }]);
      const eventTime = renderEventTime(scheduledEvent[0].start);
      this.playLoopFrom(eventTime, scheduledEvent[0].event.start, renderRange.tempoBpm, renderRange.audioContext.destination);
    }

    if ( triggerInfo.triggerOffset !== -1) {
      let scheduledEvent = patternSequencer.renderPatternEvents(renderRange, sampleDuration, [{
        start: triggerInfo.triggerOffset
      }]);
      const eventTime = renderEventTime(scheduledEvent[0].start);
      this.stopLoopAt(eventTime);
    }
  }
}

BeatSamplePlayer.defaultProps = {
  audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20181110--starthere--haszari%202%20Beat.wav',
  tempoBpm: 150, 
  sampleDuration: 4,
};


export default BeatSamplePlayer;