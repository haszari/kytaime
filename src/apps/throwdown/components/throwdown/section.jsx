import React from 'react';
import PropTypes from 'prop-types';

function SectionTrigger( props ) {
  const styles = {};
  styles.fontWeight = props.playing ? 'bold' : 'normal';
  styles.fontStyle = props.triggered ? 'italic' : 'normal';
  const toggleTrigger = props.onSetTriggeredSection.bind(
    null,
    props.triggered ? null : props.slug
  );
  const parts = props.parts.map( part => (
    <div className='part' key={ part.part }>
      <div className='part-slug'>{ part.part }</div>
      { part.patterns.map( patternSlug => (
        <div className='pattern' key={ patternSlug }>
          { patternSlug }
        </div>
      ) ) }
    </div>
  ) );
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
  slug: PropTypes.string,
  hue: PropTypes.number,
  parts: PropTypes.array,
};

export default SectionTrigger;
