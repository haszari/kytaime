import _ from 'lodash'; 

import store from './store/store';

import transportActions from './components/transport/actions';

import throwdownActions from './components/throwdown/actions';
import throwdownSelectors from './components/throwdown/selectors';

import sequencer from '@kytaime/sequencer/sequencer';
import patternSequencer from '@kytaime/sequencer/pattern-sequencer';
import bpmUtilities from '@kytaime/sequencer/bpm-utilities';
import midiPorts from '@kytaime/midi-ports';

// import SectionPlayer from './components/throwdown/section-player';
import DeckPlayer from './components/throwdown/deck-player';

import './components/hardware-bindings/akai-apc40';

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

    // array of { deckSlug: sectionSlug: sectionPlayer: }
    // this.deckSectionPlayers = [];
    this.deckPlayers = {};

    sequencer.setRenderCallback( 'throwdown', this.sequencerCallback );

    // I believe we need to nudge the channel count so we can use em all
    sequencer.audioContext.destination.channelCount = sequencer.audioContext.destination.maxChannelCount;

    store.dispatch( throwdownActions.setAudioContext( sequencer.audioContext ) );

    this.renderIndex = 0;

    this.openMidiOutput( "IAC Driver Bus 1" );
  }

  openMidiOutput(requestedPortName) {
    midiPorts.openMidiOutput({
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

  // creates new decks and players to match state
  // will reuse existing decks, matching based on deck+section slug
  updateDeckPlayers( state ) {
    const allBuffers = throwdownSelectors.getBuffers( state );
    const allDecks = throwdownSelectors.getDecks( state );
    const triggerLoop = throwdownSelectors.getTriggerLoop( state );

    const deckPlayers = this.deckPlayers;

    // { deckSlug: sectionSlug: sectionPlayer: }
    _.map( allDecks, ( deckState ) => {
        var patterns = throwdownSelectors.getAllDeckPatterns( state, deckState.slug ); 
        var sections = throwdownSelectors.getDeckSections( state, deckState.slug ); 

        const deckProps = {
          slug: deckState.slug, 
          buffers: allBuffers,
          patterns,
          sections,
          triggerLoop,

          // these are now props, in temporary approach they are this.members
          triggeredSection: deckState.triggeredSection,
          playingSection: deckState.playingSection,
        }

        var deckItem = deckPlayers[ deckState.slug ];

        if ( deckItem ) {
          deckItem.updateProps( deckProps );
        }
        else {
          deckPlayers[ deckState.slug ] = new DeckPlayer( deckProps );
        }

      // _.map( deckState.sections, ( section ) => {

      // } );
    } );

    // console.log( this.deckPlayers );
  }

  updateDeckPlayState_fromDeckPlayers() {
    // const allDecks = throwdownSelectors.getDecks( state );

    _.map( this.deckPlayers, deckPlayer => {
      store.dispatch( throwdownActions.setDeckPlayingSection( {
        deckSlug: deckPlayer.props.slug, 
        sectionSlug: deckPlayer.props.playingSection
      } ) );
    } );

    // // init defaults (so when nothing is playing, we send a message for that)
    // var playingSectionByDeck = _.map( allDecks, ( deckState ) => { 
    //   return { 
    //     deckSlug: deckState.slug,
    //     playingSection: null,
    //   } 
    // } );
    // playingSectionByDeck = _.keyBy( playingSectionByDeck, 'deckSlug' );

    // // loop over all decks, finding the playing section
    // this.deckSectionPlayers.map( deckSectionPlayer => {
    //   if ( deckSectionPlayer.sectionPlayer.props.playing ) {
    //     playingSectionByDeck[ deckSectionPlayer.deckSlug ].playingSection = deckSectionPlayer.sectionPlayer.props.slug;
    //   }
    // } );

    // // now send all the messages
    // _.map( playingSectionByDeck, deckSectionInfo => {
    //   store.dispatch( throwdownActions.setDeckPlayingSection( {
    //     deckSlug: deckSectionInfo.deckSlug, 
    //     sectionSlug: deckSectionInfo.playingSection
    //   } ) );
    // } );
  }

  stopAllPlayers() {
    _.map( this.deckPlayers, deckPlayer => {
      deckPlayer.stopPlayback();
    } );       
  }

  renderTimePeriod( renderRange, renderRangeBeats ) {
    // console.log( 
    //   `--- app renderTimePeriod ` +
    //   `current=(${ this.lastRenderEndBeat })` +
    //   `start=(${ renderRangeBeats.start }, ${ renderRange.start }) ` +
    //   `end=(${ renderRangeBeats.end }, ${ renderRange.end }) `
    // );

    _.map( this.deckPlayers, deckPlayer => {
      // if ( deckSectionItem.sectionPlayer.throwdownRender ) {
        deckPlayer.throwdownRender( renderRange, this.tempoBpm, renderRangeBeats, this.midiOutPort );
      // }
    } );   
    this.updateDeckPlayState_fromDeckPlayers();


    this.lastRenderEndBeat = renderRangeBeats.end; 

    setTimeout(() => {
      store.dispatch( 
        transportActions.setCurrentBeat( this.lastRenderEndBeat )
      );
    }, ( renderRange.end ) / 1000 );
  }

  sequencerCallback( renderRange ) {
    this.renderIndex++;

    this.updateDeckPlayers( store.getState() );

    // calculate render range in beats
    var chunkMs = renderRange.end - renderRange.start;
    var chunkBeats = bpmUtilities.msToBeats( this.tempoBpm, chunkMs );
    const renderBeats = {
      start: this.lastRenderEndBeat,
      end: this.lastRenderEndBeat + chunkBeats,
    };

    // drop tempo changes mod what
    const tempoChangePhrase = throwdownSelectors.getTriggerLoop( store.getState() );
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

    var renderRangeCurrent = _.cloneDeep( renderRange );
    var renderRangeNext = _.cloneDeep( renderRange );
    renderRangeCurrent.end = tempoChangeEvent[0].start;
    renderRangeNext.start = tempoChangeEvent[0].start;
    renderRangeNext.tempoBpm = this.nextTempoBpm;

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
  // main

  startTransport() {
    sequencer.start();
  }
  stopTransport() {
    sequencer.stop();
    this.lastRenderEndBeat = 0;
    this.stopAllPlayers();
    store.dispatch( transportActions.setCurrentBeat( this.lastRenderEndBeat ) );
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