
import React from 'react';

function triggerStyles(triggered, playing) {
  const styles = { };
  if (triggered) styles.fontWeight = 'bold';
  if (playing) styles.fontStyle = 'italic';
  return styles;
}

const ThrowdownSection = (props) => {
  const { id, slug, setTriggeredSection, setPartTrigger, triggered, playing, renderPhraseBeats, parts } = props;
  const style = {
    backgroundColor: '#f4f4f4',
    borderRadius: '0.2em',
    display: 'inline-block',
    marginRight: '0.5em',
    userSelect: 'none',
  };

  const titleStyle = triggerStyles(triggered, playing);

  // section triggering
  const toggleSectionTriggered = () => {
    setTriggeredSection({ sectionId: id, triggered: ! triggered });
  }

  const playbackPosition = playing ? Math.floor(renderPhraseBeats) : '';


  const partPlayers = _.map(parts, ( part ) => {
    const { slug, triggered } = part;
    // part (within section) triggering 
    const toggleThisPartTriggered = ( partSlug, triggerState ) => setPartTrigger({ sectionId: id, partSlug, triggered: triggerState });
    const partStyle = triggerStyles( triggered, playing && part.playing ); // these properties coming soon

    return (
      <div style={ partStyle } key={ slug } onClick={ () => toggleThisPartTriggered( slug, ! triggered ) } >
        { slug }
      </div>
    );
  });


  return (
    <div style={ style }>
      <div style={ titleStyle } onClick={ toggleSectionTriggered }>
        s{ id } – { slug } { playbackPosition }
      </div>
      { partPlayers }
    </div>
  );
}

export default ThrowdownSection;