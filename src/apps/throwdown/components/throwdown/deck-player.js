
import _ from 'lodash';

import patternSequencer from '@kytaime/sequencer/pattern-sequencer';
import bpmUtilities from '@kytaime/sequencer/bpm-utilities';

import playerFactory from '../../player-factory';

import throwdownActions from './actions';
import store from '../../store/store';

class DeckPlayer {
  constructor( props ) {
    this.patternPlayers = {};

    this.updateProps( props );
  }

  updateProps( props ) {
    this.props = _.defaults( props, DeckPlayer.defaultProps );

    // create/update one player for each pattern in this deck
    _.each( props.patterns, ( pattern ) => {
      var patternPlayer = this.patternPlayers[pattern.slug];

      if ( ! patternPlayer ) {
        patternPlayer = playerFactory.playerFromFilePatternData( pattern, props.buffers );
        this.patternPlayers[pattern.slug] = patternPlayer;
      }
      else {
        patternPlayer.updateProps( playerFactory.getPlayerProps( pattern, props.buffers ) );
      }

      patternPlayer.setParentPhrase( props.triggerLoop );
      patternPlayer.setPlaying( pattern.isPlaying );
    } );
  }

  stopPlayback() {
    // stop pattern players
    _.each( this.patternPlayers,
      player => player.stopPlayback()
    );
  }

  isPatternTriggeredInSectionParts( patternSlug, sectionData ) {
    if ( ! sectionData ) {
      return false;
    }

    return ( undefined !== sectionData.parts.find( part => {
      return ( part.triggeredPattern === patternSlug );
    } ) );
  }

  renderTimePeriod( renderRange, tempoBpm, startBeat, endBeat, midiOutPort ) {
    var renderRangeBeats = { start: startBeat, end: endBeat, };

    // get sections that we need to evaluate triggering:
    // the playing one (if any)
    // and the triggered one (if any)
    const playingSection = _.find( this.props.sections, { slug: this.props.playingSection, } );
    const triggeredSection = _.find( this.props.sections, { slug: this.props.triggeredSection, } );

    // update props.playingSection if we are switching section
    var currentPlayingSection = null;

    const deckSlug = this.props.slug;

    // run triggering for playing & triggered sections
    // we'll pass this down to the patterns so they know how to behave
    // these two ifs should be a function??
    var currentSectionTrigger = null;
    var nextSectionTrigger = null;
    if ( playingSection ) {
      currentSectionTrigger = patternSequencer.renderPatternTrigger(
        tempoBpm,
        renderRangeBeats,
        ( playingSection.slug === this.props.triggeredSection ),
        ( playingSection.slug === this.props.playingSection ),
        this.props.triggerLoop,
      );
      if ( currentSectionTrigger.isPlaying ) {
        currentPlayingSection = playingSection.slug;
      }
    }

    if ( triggeredSection ) {
      nextSectionTrigger = patternSequencer.renderPatternTrigger(
        tempoBpm,
        renderRangeBeats,
        ( triggeredSection.slug === this.props.triggeredSection ),
        ( triggeredSection.slug === this.props.playingSection ),
        this.props.triggerLoop,
      );
      if ( nextSectionTrigger.isPlaying ) {
        currentPlayingSection = triggeredSection.slug;
      }
    }

    // this is used by parent (throwdown) to send message to update UI
    const sectionTransition = ( this.props.playingSection !== currentPlayingSection );
    this.props.playingSection = currentPlayingSection;

    // If there's a section transition, we'll render the first chunk (before transition) and return.
    if ( sectionTransition && currentSectionTrigger ) {
      const sectionTransitionEvent = patternSequencer.renderPatternEvents(
        renderRange.start,
        tempoBpm,
        renderRangeBeats,
        this.props.triggerLoop,
        [ { start: 0, duration: 1, }, ],
      );
      renderRange = _.cloneDeep( renderRange );
      renderRange.end = sectionTransitionEvent[0].start;
      const thisChunkMs = renderRange.end - renderRange.start;
      renderRangeBeats.end = renderRangeBeats.start + bpmUtilities.msToBeats( tempoBpm, thisChunkMs );
      // console.log( `-- TRANSITION -- ${ this.props.slug }` );
    }
    // console.log( `DeckPlayer ${ this.props.slug } renderTimePeriod ${ renderRange.start }/${ renderRangeBeats.start } ${ renderRange.end }/${ renderRangeBeats.end }` );

    const patternPlayStates = [];

    // render patterns that are in the triggered/playing section
    _.each( this.patternPlayers,
      ( player, patternSlug ) => {
        // Is this pattern in a section that's triggered, i.e. parent is triggered?
        // This allows us to trigger/untrigger a whole section (multiple patterns) as a unit.
        const isInTriggeredSection = triggeredSection ? _.includes( triggeredSection.patterns, patternSlug ) : false;
        // const isInPlayingSection = playingSection ? _.includes( playingSection.patterns, patternSlug ) : false;
        player.setParentTriggered( isInTriggeredSection );

        // Is this pattern triggered (selected) within the section (within the part)?
        // This allows us to load up a section with alternative patterns
        // for each part/instrument (e.g. different beats) and toggle between them.
        const isTriggered = this.isPatternTriggeredInSectionParts( patternSlug, triggeredSection ) ||
          this.isPatternTriggeredInSectionParts( patternSlug, playingSection );
        player.setTriggered( isTriggered );

        // const wasPlaying = player.playing;

        player.throwdownRender( renderRange, tempoBpm, renderRangeBeats, midiOutPort );

        const stillPlaying = player.playing;
        // console.log( `play ${ patternSlug } inTriggeredSection=${ isInTriggeredSection } isTriggered=${ isTriggered } was=${ wasPlaying } now=${ stillPlaying }` );
        patternPlayStates.push( {
          // note here we are assuming deck === song
          // this is currently how it works, but we might support different songs in same deck in future?
          songSlug: deckSlug,
          patternSlug: patternSlug,
          isPlaying: stillPlaying,
        } );
      }
    );

    // update playstate for all patterns
    patternPlayStates.map( actionData => {
      store.dispatch( throwdownActions.setDeckPatternPlaystate( actionData ) );
    } );

    return {
      beats: renderRangeBeats.end,
      msec: renderRange.end,
    };
  }

  throwdownRender( renderRange, tempoBpm, renderRangeBeats, midiOutPort ) {
    console.log( `--- DeckPlayer render ${ renderRange.start }/${ renderRangeBeats.start } ${ renderRange.end }/${ renderRangeBeats.end }` );

    // The state may need to change during the render, e.g across a section transition.
    // This loop allows renderTimePeriod to split the render range as needed.
    // If we don't do this, the outgoing section patterns don't get a chance to render
    // their untrigger, and they continue playing when they shouldn't :)
    const thisRange = _.cloneDeep( renderRange );
    var { start, end, } = renderRangeBeats;
    var renderEnd = {
      beats: start,
      msec: renderRange.start,
    };
    do {
      thisRange.start = renderEnd.msec;
      renderEnd = this.renderTimePeriod( thisRange, tempoBpm, start, end, midiOutPort );
      start = renderEnd.beats;
    } while ( renderEnd.beats < renderRangeBeats.end );
  }
}

DeckPlayer.defaultProps = {
  slug: '',
  patterns: [],
  sections: [],
  buffers: [],
  playingSection: '',
  triggeredSection: '',
  triggerLoop: 4,
};

export default DeckPlayer;
