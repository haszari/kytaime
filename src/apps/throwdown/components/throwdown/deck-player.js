
import _ from 'lodash';

import patternSequencer from '@kytaime/sequencer/pattern-sequencer';

import playerFactory from '../../player-factory';

class DeckPlayer {
  constructor( props ) {
    this.patternPlayers = {};

    this.updateProps( props );
  }

  updateProps( props ) {
    this.props = _.defaults( props, DeckPlayer.defaultProps );

    // create/update one player for each pattern
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

  throwdownRender( renderRange, tempoBpm, renderRangeBeats, midiOutPort ) {
    // console.log( `DeckPlayer render ${ renderRangeBeats.start } ${ renderRangeBeats.end }` );

    // get sections that we need to evaluate triggering:
    // the playing one (if any)
    // and the triggered one (if any)
    const playingSection = _.find( this.props.sections, { slug: this.props.playingSection, } );
    const triggeredSection = _.find( this.props.sections, { slug: this.props.triggeredSection, } );

    // update props.playingSection if we are switching section
    var currentPlayingSection = null;

    // run triggering for playing & triggered sections
    // we'll pass this down to the patterns so they know how to behave
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
    _.each( this.patternPlayers,
      ( player, patternSlug ) => {
        const isInTriggeredSection = triggeredSection ? _.includes( triggeredSection.patterns, patternSlug ) : false;

        player.setParentTriggered( isInTriggeredSection );
        player.setParentPhrase( this.props.triggerLoop );
        player.throwdownRender( renderRange, tempoBpm, renderRangeBeats, midiOutPort );
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
