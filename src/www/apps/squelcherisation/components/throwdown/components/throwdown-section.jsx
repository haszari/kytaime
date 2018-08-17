
import React from 'react';

function triggerStyles(triggered, playing) {
  const styles = { };
  if (triggered) styles.fontWeight = 'bold';
  if (playing) styles.fontStyle = 'italic';
  return styles;
}

const ThrowdownSection = (props) => {
  const { id, setTriggeredSection, triggered, playing, data } = props;
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

  // part (within section) triggering 
  const toggleThisPartTriggered = () => {
    // coming soon
  };


  const partPlayers = _.map(data.parts, (part) => {
    const partStyle = triggerStyles(part.triggered, playing && part.playing); // these properties coming soon
    const setNothingTriggered = () => {
      // this action coming soon
    };

    return (
      <div style={ partStyle } key={ part.label } onClick={ toggleThisPartTriggered } >
        { part.label }
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