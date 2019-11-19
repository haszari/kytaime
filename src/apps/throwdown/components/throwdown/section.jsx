import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';

function triggerStyling( triggered, playing ) {
  const styles = {};
  styles.fontWeight = playing ? 'bold' : 'normal';
  styles.fontStyle = triggered ? 'italic' : 'normal';
  return styles;
}

function PartTriggers( props ) {
  return (
    <div className='part' key={ props.part }>
      <div className='part-slug'>{ props.part }</div>
      {
        props.patterns.map( patternSlug => {
          const patternNameIsPlaying = ( _.indexOf( props.playingPatterns, patternSlug ) !== -1 );
          const patternIsTriggered = ( patternSlug === props.triggeredPattern );
          const patternStyles = triggerStyling(
            patternIsTriggered,
            ( patternNameIsPlaying && props.songIsPlaying )
          );
          return (
            <div
              className='pattern'
              key={ patternSlug }
              style={ patternStyles }
              onClick={ function() {
                props.onSetPartTriggeredSection.bind( null, props.part, patternIsTriggered ? null : patternSlug )();
              } }
            >
              { patternSlug }
            </div>
          );
        } )
      }
    </div>
  );
}

PartTriggers.propTypes = {
  songIsPlaying: PropTypes.bool,
  part: PropTypes.string,
  patterns: PropTypes.array,
  triggeredPattern: PropTypes.string,
  playingPatterns: PropTypes.string,
  onSetPartTriggeredSection: PropTypes.func,
};

function SectionTrigger( props ) {
  const sectionSlug = props.slug;
  const styles = triggerStyling( props.triggered, props.playing );
  const toggleTrigger = props.onSetTriggeredSection.bind(
    null,
    props.triggered ? null : props.songSlug,
    props.triggered ? null : props.slug
  );

  const playingPatternSlugs = _.map( props.playingPatterns, 'slug' );

  const parts = props.parts.map( part => {
    const partProps = {
      onSetPartTriggeredSection: props.onSetPartTriggeredSection.bind( null, props.songSlug, sectionSlug ),
      playingPatterns: playingPatternSlugs,
      songIsPlaying: ( props.songSlug === props.playingSong ),
      ...part,
    };
    return PartTriggers( partProps );
  } );
  return (
    <td className='section-container'>
      <div
        onClick={ toggleTrigger }
        style={ styles }
        className='section'
      >
        { props.songSlug } { props.slug }
      </div>
      <div className='parts'>
        { parts }
      </div>
    </td>
  );
}

SectionTrigger.propTypes = {
  playingSong: PropTypes.string,
  playingSection: PropTypes.string,
  playing: PropTypes.bool,
  triggered: PropTypes.bool,
  onSetTriggeredSection: PropTypes.func,
  onSetPartTriggeredSection: PropTypes.func,
  songSlug: PropTypes.string,
  slug: PropTypes.string,
  hue: PropTypes.number,
  parts: PropTypes.array,
  playingPatterns: PropTypes.array,
};

export default SectionTrigger;
