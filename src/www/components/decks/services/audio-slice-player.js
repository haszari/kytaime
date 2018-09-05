
import _ from 'lodash';

import * as audioUtilities from '@kytaime/lib/audio-utilities';
import * as bpmUtilities from '@kytaime/lib/sequencer/bpm-utilities';
import * as patternSequencer from '@kytaime/lib/sequencer/pattern-sequencer';

const minGain = 0.001;
const maxGain = 1.0;

const defaultGainRampUpTime = 0.02;
const defaultGainRampDownTime = 0.05;

const defaultMuteGainRampTime = 0.02;

const renderEventTime = ( renderRange, time ) => (time + renderRange.audioContextTimeOffsetMsec) / 1000;

class AudioSlicePlayer {
  constructor(props) {
    this.slug = props.slug;

    this.part = props.part || "drums";
    
    this.attack = props.attack || defaultGainRampUpTime;
    this.release = props.release || defaultGainRampDownTime;

    this.audioFile = props.audio;
    this.tempo = props.tempo;

    this.audioContext = props.audioContext;
    this.secPerBeat = (60 / this.tempo);

    this.triggered = true;
    this.playing = false;

    this.buffer = undefined;

    this.loaded = new Promise((resolve, reject) => {      
      audioUtilities.loadSample(this.audioFile, this.audioContext, (buffer) => {
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

    this.slices = props.slices;
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

    this.variation = props.variation;

    // overall gain, used for variation muting
    // (and or other volume automation?)
    let finalGain = this.audioContext.createGain();
    this.finalGain = finalGain;
  }

  playSliceAt( startTimestamp, stopTimestamp, startBeat, transportBpm, audioDestinationNode ) {
    let rate = transportBpm / this.tempo;
    // console.log(rate, this.audioContext.currentTime, time);
    startBeat = startBeat || 0;

    // possibly keep a reference to all these players in case we want to stopAllNow()?
    let player = this.audioContext.createBufferSource();
    this.player = player;
    player.buffer = this.buffer;
    
    player.playbackRate.value = rate;

    player.loop = false;

    // per-slice gain envelope (declick, attack/release)
    let faderGain = this.audioContext.createGain();
    // this.faderGain = faderGain;
    faderGain.gain.setValueAtTime( minGain, startTimestamp );
    faderGain.gain.linearRampToValueAtTime( maxGain, startTimestamp + this.attack );

    player.connect( faderGain );
    if (audioDestinationNode.channelCount > 2)
      audioUtilities.connectToChannelForPart( this.audioContext, faderGain, this.finalGain, this.part );    
    else
      faderGain.connect( this.finalGain );
    this.finalGain.connect( audioDestinationNode );
 
    player.start(startTimestamp, ( (this.startOffset + startBeat) * this.secPerBeat ) + this.zeroBeatSeconds);
    this.finalGain.gain.linearRampToValueAtTime( maxGain, startTimestamp );

    if ( (stopTimestamp - startTimestamp) < this.release)
      stopTimestamp = startTimestamp + this.release;

    faderGain.gain.setValueAtTime( maxGain, stopTimestamp - this.release );
    faderGain.gain.linearRampToValueAtTime( minGain, stopTimestamp );
    this.player.stop(stopTimestamp);
  }
  
  stopAt(stopTimestamp) {
    if (this.player) {
      if ( !stopTimestamp )
        stopTimestamp = this.audioContext.currentTime + this.release;

      this.finalGain.gain.setValueAtTime( maxGain, stopTimestamp - this.release );
      this.finalGain.gain.linearRampToValueAtTime( minGain, stopTimestamp );
      this.player.stop(stopTimestamp);

      this.player = null;
      // todo  .. send this after the timestamp
      this.updatePlayingState( false );
    }
  }


  stop() {
    this.stopAt(0);
  }

  updateAndRenderVariation( renderRange, triggerInfo, sectionDuration, variation ) {
    const { duration, finalGain } = this;

    if ( 'audio-mute' === variation.type && variation.events ) {
      let basisDuration = sectionDuration;
      if ( variation.every && 'pattern' === variation.basis )
        basisDuration = duration;
      let overallVariationDuration = basisDuration;

      // shift the events by any section-loop offset 
      let offsetInBeats = 0;
      if ( variation.every && _.isNumber(variation.every.multiple) && _.isNumber(variation.every.offset) ) {
        overallVariationDuration = basisDuration * variation.every.multiple; 
        offsetInBeats = ( variation.every.offset % variation.every.multiple ) * basisDuration;
      }

      const offsetEvents = _.map( variation.events, ( event ) => {
        return {
          ... event,
          start: event.start + offsetInBeats,
        }
      } );

      // filter out events that aren't this time period
      let filteredEvents = _.filter( offsetEvents, function( event ) {
        return bpmUtilities.valueInWrappedBeatRange(
          event.start, 
          triggerInfo.startBeat % overallVariationDuration, 
          triggerInfo.endBeat % overallVariationDuration, 
          overallVariationDuration
        );
      } );

      let scheduledEvents = patternSequencer.renderPatternEvents( renderRange, overallVariationDuration, filteredEvents );

      _.map( scheduledEvents, (eventInfo) => {
        const startTime = renderEventTime( renderRange, eventInfo.start );
        const stopTime = renderEventTime( renderRange, eventInfo.start + eventInfo.duration );

        // cut
        finalGain.gain.setValueAtTime( maxGain, startTime );
        finalGain.gain.linearRampToValueAtTime( minGain, startTime + defaultMuteGainRampTime );

        // bring back in
        finalGain.gain.setValueAtTime( minGain, stopTime - defaultMuteGainRampTime );
        finalGain.gain.linearRampToValueAtTime( maxGain, stopTime );
      });
    
    }
  }

  updateAndRenderAudio( renderRange, triggerState, playingState, sectionDuration, audioDestinationNode ) {
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

    if ( this.variation ) {
      _.map( this.variation, ( currentVariation ) => {
        this.updateAndRenderVariation( renderRange, triggerInfo, sectionDuration, currentVariation );
      } );
    }

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

    _.map( scheduledSlices, ( sliceRenderInfo ) => {
      const startTime = renderEventTime( renderRange, sliceRenderInfo.start );
      const stopTime = renderEventTime( renderRange, sliceRenderInfo.start + sliceRenderInfo.duration );
      this.playSliceAt( startTime, stopTime, sliceRenderInfo.event.beat, renderRange.tempoBpm, audioDestinationNode );
    } );
  }
}

export default AudioSlicePlayer;