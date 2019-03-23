
import _ from 'lodash';

import patternSequencer from '@kytaime/sequencer/pattern-sequencer';

import playerFactory from '../../player-factory';

// import throwdownActions from './actions';


class SectionPlayer {
  constructor( props ) {
    this.props = _.defaults( props, SectionPlayer.defaultProps );

    this.playing = false;
    this.triggered = false;

    this.players = [];

   _.each( props.patterns, ( resource, key ) => {
      const pattern = playerFactory.playerFromFilePatternData( resource, resource.slug, props.buffers );
      if ( pattern ) {
        this.players.push( pattern );
      }
    } );
  }

  throwdownRender( renderRange, tempoBpm, renderRangeBeats, midiOutPort ) {
    let triggerInfo = patternSequencer.renderPatternTrigger(
      tempoBpm, 
      renderRangeBeats,
      this.triggered,
      this.playing, 
      this.props.phraseLoop,
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
  buffers: [],
};


export default SectionPlayer;