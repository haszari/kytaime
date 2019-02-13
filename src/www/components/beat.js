
import _ from 'lodash';

import * as audioUtilities from '@kytaime/lib/audio-utilities';
import * as bpmUtilities from '@kytaime/lib/sequencer/bpm-utilities';
import patternSequencer from '@kytaime/lib/sequencer/pattern-sequencer';

class BeatSamplePlayer {
  constructor(props) {
    this.props = _.defaults( props, BeatSamplePlayer.defaultProps );
    // this.throwdownRender = this.throwdownRender.bind(this);

    this.playing = false;

    this.loaded = false;
    this.loading = false;
  }

  playSliceAt( startTimestamp, stopTimestamp, startBeat, transportBpm, audioDestinationNode ) {
    console.log( 
      `-- beat playSliceAt ` +
      `start=(${ startBeat }, ${ startTimestamp }) `
    );


    let { tempoBpm } = this.props;
    
    let secPerBeat = (60 / tempoBpm);
    let rate = transportBpm / tempoBpm;

    let player = audioDestinationNode.context.createBufferSource();
    player.buffer = this.buffer;
    player.playbackRate.value = rate;

    player.loop = false;

    if (audioDestinationNode.channelCount > 2)
      audioUtilities.connectToChannelForPart(this.audioContext, player, audioDestinationNode, this.part);    
    else
      player.connect(audioDestinationNode);
 
    player.start(startTimestamp, startBeat * secPerBeat);
    player.stop(stopTimestamp);

    this.player = player;
  }

  throwdownRender( renderRange, tempoBpm, renderRangeBeats ) {
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
      tempoBpm, 
      renderRangeBeats,
      triggered,
      this.playing, 
      sampleDuration,
    );

    this.playing = triggerInfo.isPlaying;
    // this.updatePlayingState( this.playing );

    let filteredSlices = _.filter(this.props.slices, function(sliceEvent) {
      return bpmUtilities.valueInWrappedBeatRange(
        sliceEvent.start, 
        triggerInfo.startBeat % sampleDuration, 
        triggerInfo.endBeat % sampleDuration, 
        sampleDuration
      );
    });

    // scheduledSlices: start time in msec
    let scheduledSlices = patternSequencer.renderPatternEvents(
      renderRange, 
      tempoBpm, 
      renderRangeBeats,
      sampleDuration, 
      filteredSlices
    );

    const renderEventTime = (time) => (time + renderRange.audioContextTimeOffsetMsec) / 1000;
    // const renderEventTime = (time) => (time) / 1000;

    _.map(scheduledSlices, (sliceRenderInfo) => {
      const startTime = renderEventTime(sliceRenderInfo.start);
      const stopTime = renderEventTime(sliceRenderInfo.start + sliceRenderInfo.duration);
      this.playSliceAt( startTime, stopTime, sliceRenderInfo.event.beat, tempoBpm, renderRange.audioContext.destination );
    });
  }
}

BeatSamplePlayer.defaultProps = {
  // audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20181110--starthere--haszari%202%20Beat.wav',
  // tempoBpm: 150, 

  audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20190209--mivova-kytaime-test-beat.mp3',
  tempoBpm: 122, 

  sampleDuration: 4,
  slices: [ {
    start: 0, 
    duration: 4,
    beat: 0,
  } ],
};


export default BeatSamplePlayer;