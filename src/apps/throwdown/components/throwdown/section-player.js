
// This file / module is not used

import _ from 'lodash';

import patternSequencer from '@kytaime/sequencer/pattern-sequencer';

import playerFactory from '../../player-factory';

// import throwdownActions from './actions';

class SectionPlayer {
  constructor( props ) {
    this.patternPlayers = {};

    this.updateProps( props );
  }

  updateProps( props ) {
    this.props = _.defaults( props, SectionPlayer.defaultProps );

    // create/update players for each pattern
    _.each( props.patterns, ( pattern ) => {
      var patternPlayer = this.patternPlayers[pattern.slug];
      if ( ! patternPlayer ) {
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
    const triggerInfo = patternSequencer.renderPatternTrigger(
      tempoBpm,
      renderRangeBeats,
      this.props.triggered,
      this.props.playing,
      this.props.triggerLoop,
      // start beats and end beats for section .. is that a thing??
    );

    this.props.playing = triggerInfo.isPlaying;

    // console.log( `${ this.props.slug } t=${ this.props.triggered } p=${ this.props.playing }` );

    // temporary - this really needs to be passed down to patterns as triggered: false
    // so they can finish playing, etc
    // if ( ! this.props.playing ) {
    //   return;
    // }

    _.each( this.patternPlayers,
      player => {
        player.setParentTriggered( this.props.triggered );
        player.setParentPhrase( this.props.triggerLoop );
        player.throwdownRender( renderRange, tempoBpm, renderRangeBeats, midiOutPort );
      }
    );
  }
}

SectionPlayer.defaultProps = {
  slug: '',
  duration: 4,
  patterns: [],
  buffers: [],
};

export default SectionPlayer;
