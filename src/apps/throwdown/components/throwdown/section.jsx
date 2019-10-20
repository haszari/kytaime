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
          const patternStyles = triggerStyling(
            patternSlug === props.triggeredPattern,
            patternSlug === props.playingPattern,
          );
          return (
            <div
              className='pattern'
              key={ patternSlug }
              style={ patternStyles }
              onClick={ function() {
                console.log( 'part pattern clicked' );
                props.onSetPartTriggeredSection.bind( null, props.part, patternSlug )();
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
  part: PropTypes.string,
  patterns: PropTypes.array,
  triggeredPattern: PropTypes.string,
  playingPattern: PropTypes.string,
  onSetPartTriggeredSection: PropTypes.func,
};

function SectionTrigger( props ) {
  const styles = triggerStyling( props.triggered, props.playing );
  const toggleTrigger = props.onSetTriggeredSection.bind(
    null,
    props.triggered ? null : props.slug
  );
  const sectionSlug = props.slug;
  const parts = props.parts.map( part => {
    const partProps = {
      onSetPartTriggeredSection: props.onSetPartTriggeredSection.bind( null, sectionSlug ),
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
        { props.slug }
      </div>
      <div className='parts'>
        { parts }
      </div>
    </td>
  );
}

SectionTrigger.propTypes = {
  playing: PropTypes.bool,
  triggered: PropTypes.bool,
  onSetTriggeredSection: PropTypes.func,
  onSetPartTriggeredSection: PropTypes.func,
  slug: PropTypes.string,
  hue: PropTypes.number,
  parts: PropTypes.array,
};

export default SectionTrigger;
