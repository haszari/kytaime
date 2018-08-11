
import React from 'react';

const ThrowdownSection = (props) => {
  const { id, setTriggeredSection, isTriggered } = props;
  const style = {
    backgroundColor: '#f4f4f4',
    borderRadius: '0.2em',
    display: 'inline-block',
    marginRight: '0.5em',
  };

  const titleStyle = { };
  if (isTriggered) titleStyle.fontWeight = 'bold';

  return (
    <div style={ style }>
      <span style={ titleStyle } onClick={ () => setTriggeredSection({ sectionId: id }) }>
        Playable section { id }
      </span>
    </div>
  );
}

export default ThrowdownSection;