
import React from 'react';

const ThrowdownSection = (props) => {
  const { id, setTriggeredSection, triggered, playing } = props;
  const style = {
    backgroundColor: '#f4f4f4',
    borderRadius: '0.2em',
    display: 'inline-block',
    marginRight: '0.5em',
    userSelect: 'none',
  };

  const titleStyle = { };
  if (triggered) titleStyle.fontWeight = 'bold';
  if (playing) titleStyle.fontStyle = 'italic';

  const setMeAsTriggered = () => setTriggeredSection({ sectionId: id });
  const setNothingTriggered = () => setTriggeredSection({ sectionId: null });

  return (
    <div style={ style }>
      <span style={ titleStyle } onClick={ triggered ? setNothingTriggered : setMeAsTriggered }>
        Playable section { id }
      </span>
    </div>
  );
}

export default ThrowdownSection;