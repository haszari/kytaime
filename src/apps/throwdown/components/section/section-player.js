
import _ from 'lodash';

import patternSequencer from '@kytaime/sequencer/pattern-sequencer';

import playerFactory from '../../player-factory';

// this needs to be shared, or a user option/runtime param
const MIN_PHRASE_LENGTH = 4;

class SectionPlayer {
  constructor(props) {
    this.props = _.defaults( props, SectionPlayer.defaultProps );

    this.playing = false;
    this.triggered = false;

    this.players = [];

   _.each( props.patterns, ( resource, key ) => {
      const pattern = playerFactory.playerFromFilePatternData( resource, key );
      if ( pattern ) {
        this.players.push( pattern );
      }
    } );
  }

  getPhraseDuration() {
    return _.reduce( this.props.patterns, ( phrase, patternData ) => {
      return Math.max( phrase, patternData.duration );
    }, MIN_PHRASE_LENGTH );
  }

  throwdownRender( renderRange, tempoBpm, renderRangeBeats, midiOutPort ) {
    let triggerInfo = patternSequencer.renderPatternTrigger(
      tempoBpm, 
      renderRangeBeats,
      this.triggered,
      this.playing, 
      this.getPhraseDuration(),
    );

    this.playing = triggerInfo.isPlaying;

    console.log( `${ this.props.slug } t=${ this.triggered } p=${ this.playing }` );
  
    // temporary - this really needs to be passed down to patterns as triggered: false
    // so they can finish playing, etc
    if ( ! this.playing ) {
      return;
    }

    this.players.map( 
      player => player.throwdownRender( renderRange, tempoBpm, renderRangeBeats, midiOutPort ) 
    );
  }
}

SectionPlayer.defaultProps = {
  slug: '',
  duration: 4,
  patterns: [],
};


export default SectionPlayer;