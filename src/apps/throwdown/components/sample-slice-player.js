
import _ from 'lodash';

import audioUtilities from '@kytaime/audio-utilities';
import bpmUtilities from '@kytaime/sequencer/bpm-utilities';
import patternSequencer from '@kytaime/sequencer/pattern-sequencer';

function autogenerateSlices( startBeats, endBeats, duration ) {
  // We used to generate one slice for whole thing ...
  // this.props.slices = [{
  //   start: 0,
  //   duration: this.props.sampleDuration,
  //   beat: 0,
  // }];

  // ...now, we add a slice for each unique start/endbeat across duration.
  // We do this so that start/endbeats work correctly for triggering.
  // If this pattern has manually set slices then it's up to the user
  // to ensure that the slices support the ends/starts they have set :)
  var slices = [];

  // Start and end beats may be negative - wrap to length
  startBeats = _.map( startBeats, beatValue => patternSequencer.modulus( beatValue, duration ) );
  endBeats = _.map( endBeats, beatValue => patternSequencer.modulus( beatValue, duration ) );
  var cuts = [ 0, startBeats, endBeats, duration ];
  cuts = _.flatten( cuts );
  cuts = _.sortBy( cuts );
  cuts = _.sortedUniq( cuts );

  for ( var i = 1; i < cuts.length; i++ ) {
    const slice = {
      start: cuts[i - 1],
      end: cuts[i],
    };
    slices.push( {
      start: slice.start,
      duration: slice.end - slice.start,
      beat: slice.start,
    } );
  }

  return slices;
}

class SampleSlicePlayer {
  constructor( props ) {
    this.updateProps( props );

    this.triggered = true;
    this.playing = false;
    this.parentTriggered = false;
    this.parentPhraseLength = 4;
  }

  updateProps( props ) {
    this.props = _.defaults( props, SampleSlicePlayer.defaultProps );

    if ( !this.props.slices || !this.props.slices.length ) {
      this.props.slices = autogenerateSlices( this.props.startBeats, this.props.endBeats, this.props.sampleDuration );
    }
  }

  setTriggered( triggered ) {
    this.triggered = triggered;
  }

  setParentTriggered( triggered ) {
    this.parentTriggered = triggered;
  }

  setParentPhrase( parentPhraseLength ) {
    this.parentPhraseLength = parentPhraseLength;
  }

  setPlaying( playing ) {
    this.playing = playing;
  }

  playSliceAt( startTimestamp, stopTimestamp, startBeat, transportBpm, audioDestinationNode ) {
    // console.log(
    //   `-- beat playSliceAt ` +
    //   `start=(${ startBeat }, ${ startTimestamp }) `
    // );

    const { tempoBpm, offset } = this.props;

    const secPerBeat = ( 60 / tempoBpm );
    const rate = transportBpm / tempoBpm;

    const player = audioDestinationNode.context.createBufferSource();
    player.buffer = this.props.buffer;
    player.playbackRate.value = rate;

    player.loop = false;

    if ( audioDestinationNode.channelCount > 2 ) { audioUtilities.connectToStereoOutChannel( audioDestinationNode.context, player, audioDestinationNode, this.props.channel ); }
    else { player.connect( audioDestinationNode ); }

    player.start( startTimestamp, offset + ( startBeat * secPerBeat ) );
    player.stop( stopTimestamp );

    this.player = player;
  }

  stopPlayback() {
    if ( this.player ) {
      this.player.stop();
      this.playing = false;
      this.player = null;
    }
  }

  throwdownRender( renderRange, tempoBpm, renderRangeBeats ) {
    if ( !this.props.buffer ) {
      return;
    }

    const { sampleDuration } = this.props;

    var triggered = this.triggered && this.parentTriggered;

    const triggerInfo = patternSequencer.renderPatternTrigger(
      tempoBpm,
      renderRangeBeats,
      triggered,
      this.playing,
      this.parentPhraseLength,
      this.props.startBeats,
      this.props.endBeats
    );

    this.playing = triggerInfo.isPlaying;

    const filteredSlices = _.filter( this.props.slices, function( sliceEvent ) {
      return bpmUtilities.valueInWrappedBeatRange(
        sliceEvent.start,
        triggerInfo.startBeat % sampleDuration,
        triggerInfo.endBeat % sampleDuration,
        sampleDuration
      );
    } );

    // scheduledSlices: start time in msec
    const scheduledSlices = patternSequencer.renderPatternEvents(
      renderRange.start,
      tempoBpm,
      renderRangeBeats,
      sampleDuration,
      filteredSlices
    );

    const renderEventTime = ( time ) => ( time + renderRange.audioContextTimeOffsetMsec ) / 1000;
    // const renderEventTime = (time) => (time) / 1000;

    _.map( scheduledSlices, ( sliceRenderInfo ) => {
      // console.log( `playing a slice ${ sliceRenderInfo.event.beat }@${ sliceRenderInfo.start } ${ this.audioFile } ` );
      const startTime = renderEventTime( sliceRenderInfo.start );
      const stopTime = renderEventTime( sliceRenderInfo.start + sliceRenderInfo.duration );
      this.playSliceAt( startTime, stopTime, sliceRenderInfo.event.beat, tempoBpm, renderRange.audioContext.destination );
    } );
  }
}

SampleSlicePlayer.defaultProps = {
  // audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20181110--starthere--haszari%202%20Beat.wav',
  // tempoBpm: 150,

  audioFile: '/media/Haszari/Haszari%20Renders%20-%20Snips%20Stems/20190209--mivova-kytaime-test-beat.mp3',
  tempoBpm: 122,
  offset: 0,

  sampleDuration: 4,
  slices: [
  // {
    // start: 0,
    // duration: 4,
    // beat: 0,
  // }
  ],
};

export default SampleSlicePlayer;
