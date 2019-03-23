import _ from 'lodash'; 

import store from './store/store';


// import observeReduxStore from '@lib/observe-redux-store';

import transportActions from './components/transport/actions';

import throwdownActions from './components/throwdown/actions';
import throwdownSelectors from './components/throwdown/selectors';

import sequencer from '@kytaime/sequencer/sequencer';
import patternSequencer from '@kytaime/sequencer/pattern-sequencer';
import bpmUtilities from '@kytaime/sequencer/bpm-utilities';
import midiOutputs from '@kytaime/midi-outputs';
import audioUtilities from '@kytaime/audio-utilities';

// import playerFactory from './player-factory';

import SectionPlayer from './components/throwdown/section-player';

/// -----------------------------------------------------------------------------------------------
// sequencer core

function ensureAudioBuffered( audioContext, buffers, filename ) {
  if ( _.find( buffers, { file: filename } ) ) {
    return;
  }
  audioUtilities.loadSample( filename, audioContext, ( buffer ) => {
    console.log( `sample decoded, ready to play ${ filename }` );
    store.dispatch( throwdownActions.addAudioBuffer( {
      file: filename,
      buffer: buffer,
    } ) );
  } );
}

class ThrowdownApp {
  constructor(props) {
    this.nextTempoBpm = null;
    this.tempoBpm = 120;
    this.lastRenderEndBeat = 0;
    this.midiOutPort = null;

    // we DO need to bind this
    // this.importThrowdown = this.importThrowdown.bind( this )

    // do we need to do all this binding?
    this.toggleTransport = this.toggleTransport.bind( this );
    this.sequencerCallback = this.sequencerCallback.bind( this );
    this.setNextTempo = this.setNextTempo.bind( this );
    this.renderTimePeriod = this.renderTimePeriod.bind( this );

    this.children = [];

    sequencer.setRenderCallback( 'throwdown', this.sequencerCallback );

    // I believe we need to nudge the channel count so we can use em all
    sequencer.audioContext.destination.channelCount = sequencer.audioContext.destination.maxChannelCount;

    store.dispatch( throwdownActions.setAudioContext( sequencer.audioContext ) );

    this.renderIndex = 0;

    this.openMidiOutput( "IAC Driver Bus 1" );

    // observeReduxStore( store, throwdownSelectors.getThrowdown, this.importThrowdown );
  }

  importPatterns( patterns ) {
    const buffers = throwdownSelectors.getBuffers( store.getState() );

    _.map( patterns, ( pattern, key ) => {
      store.dispatch( throwdownActions.addPattern( {
        slug: key, 
        ...pattern
      } ) );
      if ( pattern.file ) {
        ensureAudioBuffered( sequencer.audioContext, buffers, pattern.file );
      }
    } );  
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

  setTempo( tempoBpm ) {
    this.tempoBpm = tempoBpm;
  }

  setNextTempo( nextTempoBpm ) {
    this.nextTempoBpm = nextTempoBpm;
  }

  // Ensure that we have players for each deck and pattern currently triggered or playing in state
  // Currently making new ones each time – may retain them across renders,
  // add new ones as needed, and update props from state
  updateDeck( state ) {
    const allSections = throwdownSelectors.getSections( state );
    const allPatterns = throwdownSelectors.getPatterns( state );
    const allBuffers = throwdownSelectors.getBuffers( state );
    const deckState = throwdownSelectors.getDeck( state );
    const phraseLoop = throwdownSelectors.getPhraseLoop( state );

    // instantiate players for ALL sections
    const sectionPlayers = _.map( allSections, ( section, key ) => {
        var patterns = section.patterns.map( 
          patternSlug => _.find( allPatterns, { slug: patternSlug } )
        );
        patterns = _.filter( patterns ); // filter out undefined patterns, e.g. slug not present
        const sectionProps = {
          slug: section.slug, 
          duration: section.bars * 4,
          buffers: allBuffers,
          patterns,
          phraseLoop, 
        }
        const player = new SectionPlayer( sectionProps );

        // sync relevant props (which things are triggered, playing) from state
        player.triggered = ( section.slug === deckState.triggeredSection );
        player.playing = ( section.slug === deckState.playingSection );
        
        return player;
    } );

    // add em all as playable things
    this.children = sectionPlayers;
  }

  updateDeckPlayState( ) {
    var playingSection = null;
    // const triggeredSection = null;
    this.children.map( sectionPlayer => {
      if ( sectionPlayer.playing ) {
        playingSection = sectionPlayer.props.slug;
      }
      // if ( sectionPlayer.triggered ) {
      //   triggeredSection = sectionPlayer.props.slug;
      // }
    } );
    store.dispatch( throwdownActions.setDeckPlayingSection( {
      sectionSlug: playingSection
    } ) );
    // store.dispatch( throwdownActions.setDeckTriggeredSection( {
    //   sectionSlug: triggeredSection
    // } ) );
  }

  push( throwdownItem ) {
    this.children.push( throwdownItem );
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

    this.updateDeckPlayState();

    this.lastRenderEndBeat = renderRangeBeats.end; 
  }

  sequencerCallback( renderRange ) {
    this.renderIndex++;

    // this will remake all the players every time
    // in future it should make new ones + update props
    // we're hooking this up manually here, on each render - but we could equally use observeReduxStore
    this.updateDeck( store.getState() );

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
    this.lastRenderEndBeat = 0;
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