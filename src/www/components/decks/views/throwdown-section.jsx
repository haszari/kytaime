
import React from 'react';

function triggerStyles(triggered, playing) {
  const styles = { };
  if (triggered) styles.fontWeight = 'bold';
  if (playing) styles.fontStyle = 'italic';
  return styles;
}

const ThrowdownSection = (props) => {
  const { id, setTriggeredSection, setPartTrigger, triggered, playing, parts } = props;
  const style = {
    backgroundColor: '#f4f4f4',
    borderRadius: '0.2em',
    display: 'inline-block',
    marginRight: '0.5em',
    userSelect: 'none',
  };

  const titleStyle = triggerStyles(triggered, playing);

  // section triggering
  const setMeAsTriggered = () => setTriggeredSection({ sectionId: id });
  const setNothingTriggered = () => setTriggeredSection({ sectionId: null });


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
      <div style={ titleStyle } onClick={ triggered ? setNothingTriggered : setMeAsTriggered }>
        Playable section { id }
      </div>
      { partPlayers }
    </div>
  );
}

export default ThrowdownSection;