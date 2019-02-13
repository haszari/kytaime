import _ from 'lodash'; 

import store from '../store/store';

import transportActions from '../store/transport/actions';

import { sequencer } from '@kytaime/lib/sequencer';
import renderNotePattern from '@kytaime/lib/render-note-pattern';
import patternSequencer from '@kytaime/lib/sequencer/pattern-sequencer';
import * as bpmUtilities from '@kytaime/lib/sequencer/bpm-utilities';

// metronome/test pattern
// import { hats, kick, beat, bassline } from '@kytaime/lib/example-patterns';
import { hats } from '@kytaime/lib/example-patterns';

/// -----------------------------------------------------------------------------------------------
// sequencer core


class ThrowdownApp {
  constructor(props) {
    this.nextTempoBpm = null;
    this.tempoBpm = 120;
    this.lastRenderEndBeat = 0;

    // do we need to do all this binding?
    this.toggleTransport = this.toggleTransport.bind( this );
    this.sequencerCallback = this.sequencerCallback.bind( this );
    this.setNextTempo = this.setNextTempo.bind( this );
    this.renderTimePeriod = this.renderTimePeriod.bind( this );

    this.children = [];

    sequencer.setMidiOut( "IAC Driver Bus 1" );
    sequencer.setRenderCallback( 'throwdown', this.sequencerCallback );

    // I believe we need to nudge the channel count so we can use em all
    sequencer.audioContext.destination.channelCount = sequencer.audioContext.destination.maxChannelCount;

    this.tempoParam = sequencer.audioContext.createConstantSource();
    this.tempoParam.start();

    this.renderIndex = 0;
  }

  push( throwdownItem ) {
    this.children.push( throwdownItem );
  }

  setTempo( tempoBpm ) {
    this.tempoBpm = tempoBpm;
  }

  setNextTempo( nextTempoBpm ) {
    this.nextTempoBpm = nextTempoBpm;
  }

  renderTimePeriod( renderRange, renderRangeBeats ) {
    // console.log(renderRange);
    // console.log( 
    //   `--- app renderTimePeriod ` +
    //   `start=(${ renderRange.start.beat }, ${ renderRange.start.time }) ` +
    //   `end=(${ renderRange.end.beat }, ${ renderRange.end.time }) `
    // );
    
    // render built-in metronome pattern
    const currentPhraseLength = 4;
    const drumchannel = 1;
    const triggered = true;
    const playing = true;
    renderNotePattern( 
      renderRange, 
      this.tempoBpm, 
      renderRangeBeats, 
      currentPhraseLength,
      renderRange.midiOutPort, 
      hats, // {notes, duration, startBeats, endBeats }
      drumchannel, triggered, playing
    );

    // get children to render themselves
    this.children.map( ( child ) => {
      if ( child.throwdownRender ) {
        child.throwdownRender( renderRange, this.tempo, renderRangeBeats );
      }
    } );    
  }

  sequencerCallback( renderRange ) {
    this.renderIndex++;

    // calculate render range in beats
    var chunkMs = renderRange.end - renderRange.start;
    var chunkBeats = bpmUtilities.msToBeats( this.tempoBpm, chunkMs );
    const renderBeats = {
      start: this.lastRenderEndBeat,
      end: this.lastRenderEndBeat + chunkBeats,
    };
    // update for next time
    this.lastRenderEndBeat += chunkBeats;
    // could just do this inside renderTimePeriod

    // drop tempo changes mod what
    const tempoChangePhrase = 16;
    const newTempoIncoming = this.nextTempoBpm && this.nextTempoBpm != this.tempo;
    const tempoDropInfo = patternSequencer.renderPatternTrigger(
      renderRange, // we may not need this whole blob - can we expand out to the minimum params we need?
      renderBeats, 
      true, // triggered, we want the new tempo to drop soon
      false, // hasn't happened yet
      tempoChangePhrase, 
    );

    // normal case, just render all the stuff
    const tempoChangeThisRender = ( newTempoIncoming && tempoDropInfo.isPlaying );
    if ( ! tempoChangeThisRender ) {
      this.renderTimePeriod( renderRange, renderBeats );
      return;
    }

    // console.log( 
    //   `----------`
    // );
    // const tempoChangeInfo = tempoChangeThisRender ? `newTempo=(${ this.nextTempoBpm }, ${ tempoDropInfo.triggerOnset })` : '';
    // console.log( 
    //   `---- app sequencerCallback ` +
    //   `start=(${ renderRange.start.beat }, ${ renderRange.start.time }) ` +
    //   `end=(${ renderRange.end.beat }, ${ renderRange.end.time }) ` + 
    //   `offset=${ renderRange.audioContextTimeOffsetMsec } ` + 
    //   tempoChangeInfo
    // );

    // we have a tempo change to render, before we can render other stuff!
    var tempoChangeEvent = patternSequencer.renderPatternEvents(
      renderRange, 
      this.tempoBpm,
      renderBeats,
      tempoChangePhrase,
      [ { start: 0, duration: 1 } ],
    );

    // const tempoChangeAbsoluteBeat = tempoDropInfo.triggerOnset + Math.ceil( renderRange.start.beat / tempoChangePhrase ) * tempoChangePhrase;
    var renderRangeCurrent = _.cloneDeep( renderRange );
    var renderRangeNext = _.cloneDeep( renderRange );
    renderRangeCurrent.end = tempoChangeEvent[0].start;
    renderRangeNext.start = tempoChangeEvent[0].start;
    renderRangeNext.tempoBpm = this.nextTempoBpm;

    // there's something broken for when we render renderRangeNext - when tempo changes
    // the first audio sample slice is out by a little bit, presumably the length of renderRangeCurrent
    // renderRangeNext.audioContextTimeOffsetMsec += renderRangeCurrent.end.time - renderRangeCurrent.start.time;

    var newTempo = this.nextTempoBpm;
    this.renderTimePeriod( renderRangeCurrent, { 
      start: renderBeats.start, 
      end: tempoDropInfo.triggerOnset,
    } );
    var hanChunkBeats = bpmUtilities.msToBeats( this.nextTempoBpm, renderRangeNext.end - renderRangeNext.start );
    this.tempo = newTempo;
    this.renderTimePeriod( renderRangeNext, { 
      start: tempoDropInfo.triggerOnset, 
      end: tempoDropInfo.triggerOnset + hanChunkBeats,
    } );
    this.lastRenderEndBeat = tempoDropInfo.triggerOnset + hanChunkBeats;


    // update the UI at the appropriate time
    setTimeout(() => {
      store.dispatch( 
        transportActions.setTempo( newTempo )
      );
    }, ( renderRange.start - tempoDropInfo.triggerOnset ) / 1000 );

    this.nextTempoBpm = null;
  }

  /// -----------------------------------------------------------------------------------------------
  // main

  // startTransport() {
  //   sequencer.start();
  // }
  // stopTransport() {
  //   sequencer.stop();
  // }
  toggleTransport() {
    if ( sequencer.isPlaying() ) {
      sequencer.stop();
    }
    else {
      sequencer.start();
    }
  }

}

export default ThrowdownApp;