import _ from 'lodash'; 

import store from './store/store';

import transportActions from './store/transport/actions';

import sequencer from '@kytaime/sequencer/sequencer';
import patternSequencer from '@kytaime/sequencer/pattern-sequencer';
import bpmUtilities from '@kytaime/sequencer/bpm-utilities';
import midiOutputs from '@kytaime/midi-outputs';

// import playerFactory from './player-factory';

import SectionPlayer from './components/section/section-player';

/// -----------------------------------------------------------------------------------------------
// sequencer core


class ThrowdownApp {
  constructor(props) {
    this.nextTempoBpm = null;
    this.tempoBpm = 120;
    this.lastRenderEndBeat = 0;
    this.midiOutPort = null;

    // do we need to do all this binding?
    this.toggleTransport = this.toggleTransport.bind( this );
    this.sequencerCallback = this.sequencerCallback.bind( this );
    this.setNextTempo = this.setNextTempo.bind( this );
    this.renderTimePeriod = this.renderTimePeriod.bind( this );

    this.children = [];

    sequencer.setRenderCallback( 'throwdown', this.sequencerCallback );

    // I believe we need to nudge the channel count so we can use em all
    sequencer.audioContext.destination.channelCount = sequencer.audioContext.destination.maxChannelCount;

    this.tempoParam = sequencer.audioContext.createConstantSource();
    this.tempoParam.start();

    this.renderIndex = 0;

    this.openMidiOutput( "IAC Driver Bus 1" );
  }

  openMidiOutput(requestedPortName) {
    midiOutputs.openMidiOutput({
      deviceName: requestedPortName,
      callback: function(info) {
       if (info.port) {
        this.midiOutPort = info.port;
        console.log("Using " + this.midiOutPort.name);
        // midiOutDevice = midiOutPort.name;
        }
      }.bind(this)
    });
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
    //   `current=(${ this.lastRenderEndBeat })` +
    //   `start=(${ renderRangeBeats.start }, ${ renderRange.start }) ` +
    //   `end=(${ renderRangeBeats.end }, ${ renderRange.end }) `
    // );

    // get children to render themselves
    this.children.map( ( child ) => {
      if ( child.throwdownRender ) {
        child.throwdownRender( renderRange, this.tempo, renderRangeBeats, this.midiOutPort );
      }
    } );   

    this.lastRenderEndBeat = renderRangeBeats.end; 
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

    // drop tempo changes mod what
    const tempoChangePhrase = 16;
    const newTempoIncoming = this.nextTempoBpm && this.nextTempoBpm != this.tempo;
    const tempoDropInfo = patternSequencer.renderPatternTrigger(
      this.tempoBpm, // we may not need this whole blob - can we expand out to the minimum params we need?
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
      renderRange.start, 
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
    chunkBeats = bpmUtilities.msToBeats( this.tempoBpm, renderRangeCurrent.end - renderRangeCurrent.start );

    // renderTimePeriod updats this.lastRenderEndBeat ... FYI
    this.renderTimePeriod( renderRangeCurrent, { 
      start: this.lastRenderEndBeat, 
      end: this.lastRenderEndBeat + chunkBeats,
    } );

    chunkBeats = bpmUtilities.msToBeats( this.nextTempoBpm, renderRangeNext.end - renderRangeNext.start );
    this.tempo = newTempo;
    this.renderTimePeriod( renderRangeNext, { 
      start: this.lastRenderEndBeat, 
      end: this.lastRenderEndBeat + chunkBeats,
    } );


    // update the UI at the appropriate time
    setTimeout(() => {
      store.dispatch( 
        transportActions.setTempo( newTempo )
      );
    }, ( renderRange.start - tempoDropInfo.triggerOnset ) / 1000 );

    this.nextTempoBpm = null;
  }

  /// -----------------------------------------------------------------------------------------------
  // importing / loading data
  // the logic for conventional channels, etc etc is in here or player-factory.js

  // loadAllPatternsAsLoops( throwdownData ) {
  //   // make loop players for each midi / audio resource
  //   _.each( throwdownData.patterns, ( resource, key ) => {
  //     const pattern = playerFactory.playerFromFilePatternData( resource, key );
  //     if ( pattern ) {
  //       this.push( pattern );
  //     }
  //   } );
  // }

  // loadData( throwdownData ) {
  //   // each section is a bunch of patterns which can be triggered on / off as a bunch
  //   this.sections = _.map( throwdownData.sections, ( section, key ) => {
  //       var patterns = section.patterns.map( 
  //         patternSlug => throwdownData.patterns[ patternSlug ]
  //       );
  //       patterns = _.filter( patterns ); // filter out undefined patterns, e.g. slug not present
  //       const sectionData = {
  //         slug: key, 
  //         duration: section.bars * 4,
  //         patterns,
  //       }
  //       return new SectionPlayer( sectionData );
  //   } );

  //   // add em all as playable things
  //   this.children = this.sections;

  //   // pick a random one to play
  //   _.sample( this.sections ).triggered = true;
  // }

  /// -----------------------------------------------------------------------------------------------
  // main

  startTransport() {
    sequencer.start();
  }
  stopTransport() {
    sequencer.stop();
  }
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