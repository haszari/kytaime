
import _ from 'lodash';

import patternSequencer from '@kytaime/sequencer/pattern-sequencer';

import playerFactory from '../../player-factory';

// import throwdownActions from './actions';


class DeckPlayer {
  constructor( props ) {

    this.patternPlayers = {};

    this.updateProps( props );
  }

  updateProps( props ) {
    this.props = _.defaults( props, DeckPlayer.defaultProps );

    // create/update one player for each pattern
    _.each( props.patterns, ( pattern ) => {
      var patternPlayer = this.patternPlayers[ pattern.slug ];
      if ( ! patternPlayer ) {
        patternPlayer = playerFactory.playerFromFilePatternData( pattern, props.buffers );
        this.patternPlayers[ pattern.slug ] = patternPlayer;
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
    // get sections that we need to consider:
    // the playing one (if any) 
    // and the triggered one (if any)
    const playingSection = _.find( this.props.sections, { playing: true } );
    const triggeredSection = _.find( this.props.sections, { triggered: true } );

    // run triggering for playing & triggered sections
    // we'll pass this down to the patterns so they know how to behave
    const playingTriggerInfo = patternSequencer.renderPatternTrigger(
      tempoBpm, 
      renderRangeBeats,
      playingSection.triggered,
      playingSection.playing, 
      this.props.triggerLoop,
      // start beats and end beats for section .. is that a thing??
    );
    const triggeredTriggerInfo = patternSequencer.renderPatternTrigger(
      tempoBpm, 
      renderRangeBeats,
      triggeredSection.triggered,
      triggeredSection.playing, 
      this.props.triggerLoop,
      // start beats and end beats for section .. is that a thing??
    );
    // we don't use any of that – we just need triggered
    // no, we still need it, because we tell Throwdown which section is playing!
    if ( triggeredTriggerInfo.isPlaying ) {
      this.props.playingSection = triggeredSection.slug;
    }
    else if ( playingTriggerInfo.isPlaying ) {
      this.props.playingSection = playingSection.slug;
    }
    else {
      this.props.playingSection = null;
    }

    // render patterns that are in the triggered/playing section
    _.each( this.patternPlayers,  
      ( player, patternSlug ) => {
        // is this relevant - is it in the playing or triggered section? 
        // if not, continue
        const isInPlayingSection = _.contains( playingSection.patterns, patternSlug );
        const isInTriggeredSection = _.contains( triggeredSection.patterns, patternSlug );

        if ( isInPlayingSection ) {
          player.setParentTriggered( playingSection.triggered );
        }
        else if ( isInTriggeredSection ) {
          player.setParentTriggered( triggeredSection.triggered );
        }
        else {
          return;
        }

        player.setParentPhrase( this.props.triggerLoop );
        player.throwdownRender( renderRange, tempoBpm, renderRangeBeats, midiOutPort );
      }
    );


    // this.props.playing = triggerInfo.isPlaying;

    // console.log( `${ this.props.slug } t=${ this.props.triggered } p=${ this.props.playing }` );
  
    // temporary - this really needs to be passed down to patterns as triggered: false
    // so they can finish playing, etc
    // if ( ! this.props.playing ) {
    //   return;
    // }

  }
}

DeckPlayer.defaultProps = {
  slug: '',
  // pass the patterns that are used in this deck
  // (we rely on client doing that for us)
  patterns: [],
  // all the sections
  // - patterns
  // - triggered
  // - playing
  sections: [], 
  buffers: [],
  // 
  triggerLoop: 4,
};


export default DeckPlayer;
