
import _ from 'lodash';

import patternSequencer from '@kytaime/sequencer/pattern-sequencer';

import playerFactory from '../../player-factory';

import throwdownActions from './actions';
import store from '../../store/store';

function getInstrumentPartForPattern( patternSlug, patterns ) {
  const pattern = _.find( patterns, { slug: patternSlug, } );
  if ( ! pattern ) {
    return '';
  }
  return pattern.part;
}

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
      if ( !patternPlayer ) {
        patternPlayer = playerFactory.playerFromFilePatternData( pattern, props.buffers );
        this.patternPlayers[pattern.slug] = patternPlayer;
      }
      else {
        patternPlayer.updateProps( playerFactory.getPlayerProps( pattern, props.buffers ) );
      }
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

    return sectionData.parts.find( part => {
      return ( part.triggeredPattern === patternSlug );
    } );
  }

  throwdownRender( renderRange, tempoBpm, renderRangeBeats, midiOutPort ) {
    // console.log( `DeckPlayer render ${ renderRangeBeats.start } ${ renderRangeBeats.end }` );

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
    if ( playingSection ) {
      const triggerInfo = patternSequencer.renderPatternTrigger(
        tempoBpm,
        renderRangeBeats,
        ( playingSection.slug === this.props.triggeredSection ),
        ( playingSection.slug === this.props.playingSection ),
        this.props.triggerLoop,
      );
      if ( triggerInfo.isPlaying ) {
        currentPlayingSection = playingSection.slug;
      }
    }

    if ( triggeredSection ) {
      const triggerInfo = patternSequencer.renderPatternTrigger(
        tempoBpm,
        renderRangeBeats,
        ( triggeredSection.slug === this.props.triggeredSection ),
        ( triggeredSection.slug === this.props.playingSection ),
        this.props.triggerLoop,
      );
      if ( triggerInfo.isPlaying ) {
        currentPlayingSection = triggeredSection.slug;
      }
    }

    // this is used by parent (throwdown) to send message to update UI
    this.props.playingSection = currentPlayingSection;

    // render patterns that are in the triggered/playing section
    // this needs to change to get the _triggered_ patterns in the section(s), as they now have multiple alternative patterns
    _.each( this.patternPlayers,
      ( player, patternSlug ) => {
        // Is this pattern in a section that's triggered, i.e. parent is triggered?
        // This allows us to trigger/untrigger a whole section (multiple patterns) as a unit.
        const isInTriggeredSection = triggeredSection ? _.includes( triggeredSection.patterns, patternSlug ) : false;
        player.setParentTriggered( isInTriggeredSection );
        player.setParentPhrase( this.props.triggerLoop );

        // Is this pattern triggered (selected) within the section (within the part)?
        // This allows us to load up a section with alternative patterns
        // for each part/instrument (e.g. different beats) and toggle between them.
        const isTriggered = this.isPatternTriggeredInSectionParts( patternSlug, triggeredSection ) ||
          this.isPatternTriggeredInSectionParts( patternSlug, playingSection );
        player.setTriggered( isTriggered );

        player.throwdownRender( renderRange, tempoBpm, renderRangeBeats, midiOutPort );

        if ( player.playing ) {
          store.dispatch( throwdownActions.setDeckSectionPartPlayingPattern( {
            deckSlug: deckSlug,
            sectionSlug: currentPlayingSection,
            partSlug: getInstrumentPartForPattern( patternSlug, this.props.patterns, ),
            patternSlug: patternSlug,
          } ) );
        }
      }
    );
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
