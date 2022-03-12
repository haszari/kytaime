import _ from "lodash";

import store from "./store/store";

import transportActions from "./components/transport/actions";

import throwdownActions from "./components/throwdown/actions";
import throwdownSelectors from "./components/throwdown/selectors";

import sequencer from "@kytaime/sequencer/sequencer";
import patternSequencer from "@kytaime/sequencer/pattern-sequencer";
import bpmUtilities from "@kytaime/sequencer/bpm-utilities";
import midiPorts from "@kytaime/midi-ports";
import audioState from "@kytaime/audio-state";

// import SectionPlayer from './components/throwdown/section-player';
import DeckPlayer from "./components/throwdown/deck-player";

import "./components/hardware-bindings/akai-apc40";

class ThrowdownApp {
   constructor() {
      this.nextTempoBpm = null;
      this.tempoBpm = 120;
      this.lastRenderEndBeat = 0;
      this.sequencerStartMsec = 0;
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

      sequencer.setRenderCallback( "throwdown", this.sequencerCallback );

      // I believe we need to nudge the channel count so we can use em all
      sequencer.audioContext.destination.channelCount =
         sequencer.audioContext.destination.maxChannelCount;

      // store.dispatch( throwdownActions.setAudioContext( sequencer.audioContext ) );
      audioState.setAudioContext( sequencer.audioContext );

      this.renderIndex = 0;

      this.openMidiOutput( "IAC Driver Bus 1" );
   }

   openMidiOutput( requestedPortName ) {
      midiPorts.openMidiOutput( {
         deviceName: requestedPortName,
         callback: function( info ) {
            if ( info.port ) {
               this.midiOutPort = info.port;
               console.log( "Using " + this.midiOutPort.name );
               // midiOutDevice = midiOutPort.name;
            }
         }.bind( this ),
      } );
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
      const allBuffers = audioState.getAllAudioBuffers();

      const allDecks = throwdownSelectors.getDecks( state );
      const triggerLoop = throwdownSelectors.getTriggerLoop( state );

      const deckPlayers = this.deckPlayers;

      // { deckSlug: sectionSlug: sectionPlayer: }
      _.map( allDecks, ( deckState, index ) => {
         var patterns = throwdownSelectors.getAllDeckPatterns(
            state,
            deckState.slug
         );
         var sections = throwdownSelectors.getDeckSections(
            state,
            deckState.slug
         );

         const deckProps = {
            slug: deckState.slug,
            routing: deckState.routing,
            deckIndex: index,
            buffers: allBuffers,
            patterns,
            sections,
            triggerLoop,

            // these are now props, in temporary approach they are this.members
            triggeredSection: deckState.triggeredSection,
            playingSection: deckState.playingSection,
         };

         var deckItem = deckPlayers[deckState.slug];

         if ( deckItem ) {
            deckItem.updateProps( deckProps );
         }
 else {
            deckPlayers[deckState.slug] = new DeckPlayer( deckProps );
         }
      } );

      // console.log( this.deckPlayers );
   }

   updateDeckPlayState() {
      _.map( this.deckPlayers, ( deckPlayer ) => {
         store.dispatch(
            throwdownActions.setDeckPlayingSection( {
               deckSlug: deckPlayer.props.slug,
               songSlug: deckPlayer.props.playingSection
                  ? deckPlayer.props.playingSection.song
                  : null,
               sectionSlug: deckPlayer.props.playingSection
                  ? deckPlayer.props.playingSection.section
                  : null,
            } )
         );
      } );
   }

   stopAllPlayers() {
      _.map( this.deckPlayers, ( deckPlayer ) => {
         deckPlayer.stopPlayback();
      } );
   }

   renderTimePeriod( renderRange, renderRangeBeats ) {
      // console.log(
      //   '--- app renderTimePeriod ' +
      //   `current=(${ this.lastRenderEndBeat })` +
      //   `start=(${ renderRangeBeats.start }, ${ renderRange.start }) ` +
      //   `end=(${ renderRangeBeats.end }, ${ renderRange.end }) `
      // );

      _.map( this.deckPlayers, ( deckPlayer ) => {
         deckPlayer.throwdownRender(
            renderRange,
            this.tempoBpm,
            renderRangeBeats,
            this.midiOutPort
         );
      } );
      this.updateDeckPlayState();

      this.lastRenderEndBeat = renderRangeBeats.end;
   }

   sequencerCallback( renderRange ) {
      this.renderIndex++;

      this.updateDeckPlayers( store.getState() );

      // Update playback progress based on real time.
      const uiProgressBeat = bpmUtilities.msToBeats(
         this.tempoBpm,
         renderRange.actualNow -
            this.sequencerStartMsec -
            renderRange.midiEventOffset
      );
      store.dispatch( transportActions.setCurrentBeat( uiProgressBeat ) );

      // calculate render range in beats
      var chunkMs = renderRange.end - renderRange.start;
      var chunkBeats = bpmUtilities.msToBeats( this.tempoBpm, chunkMs );
      const renderBeats = {
         start: this.lastRenderEndBeat,
         end: this.lastRenderEndBeat + chunkBeats,
      };

      // drop tempo changes mod what
      const tempoChangePhrase = throwdownSelectors.getTriggerLoop(
         store.getState()
      );
      const newTempoIncoming =
         this.nextTempoBpm && this.nextTempoBpm !== this.tempoBpm;
      const tempoDropInfo = patternSequencer.renderPatternTrigger(
         this.tempoBpm, // we may not need this whole blob - can we expand out to the minimum params we need?
         renderBeats,
         true, // triggered, we want the new tempo to drop soon
         false, // hasn't happened yet
         tempoChangePhrase
      );

      // normal case, just render all the stuff
      const tempoChangeThisRender = newTempoIncoming && tempoDropInfo.isPlaying;
      if ( !tempoChangeThisRender ) {
         this.renderTimePeriod( renderRange, renderBeats );
         return;
      }

      // console.log(
      //   '---------- tempo change'
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
         [ { start: 0, duration: 1 } ]
      );

      var renderRangeCurrent = _.cloneDeep( renderRange );
      var renderRangeNext = _.cloneDeep( renderRange );
      renderRangeCurrent.end = tempoChangeEvent[0].start;
      renderRangeNext.start = tempoChangeEvent[0].start;
      renderRangeNext.tempoBpm = this.nextTempoBpm;

      var newTempo = this.nextTempoBpm;
      chunkMs = renderRangeCurrent.end - renderRangeCurrent.start;
      chunkBeats = bpmUtilities.msToBeats(
         this.tempoBpm,
         renderRangeCurrent.end - renderRangeCurrent.start
      );

      // Reset zero beat when the tempo change happens.
      this.sequencerStartMsec = renderRange.start + chunkMs;

      // renderTimePeriod updats this.lastRenderEndBeat ... FYI
      this.renderTimePeriod( renderRangeCurrent, {
         start: this.lastRenderEndBeat,
         end: this.lastRenderEndBeat + chunkBeats,
      } );

      chunkBeats = bpmUtilities.msToBeats(
         this.nextTempoBpm,
         renderRangeNext.end - renderRangeNext.start
      );
      this.tempoBpm = newTempo;
      this.renderTimePeriod( renderRangeNext, {
         start: this.lastRenderEndBeat,
         end: this.lastRenderEndBeat + chunkBeats,
      } );

      // update the UI at the appropriate time
      setTimeout( () => {
         store.dispatch( transportActions.setTempo( newTempo ) );
      }, ( renderRange.start - tempoDropInfo.triggerOnset ) / 1000 );

      this.nextTempoBpm = null;
   }

   /// -----------------------------------------------------------------------------------------------
   // main

   startTransport() {
      // Start a bit in the past, so there's allowance for the latency when scheduling first audio events.
      // This is expressed as beats, so at fast tempos might not be enough?
      // In future may switch this to use a fixed msec amount (& convert to beats).
      const rewindStart = 1;
      this.sequencerStartMsec =
         window.performance.now() +
         bpmUtilities.beatsToMs( this.tempoBpm, rewindStart );
      this.lastRenderEndBeat = -rewindStart;
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
