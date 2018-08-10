
import React from 'react';

const ThrowdownSection = (props) => {
  const { id } = props;
  const style = {
    backgroundColor: '#f4f4f4',
    borderRadius: '0.2em',
    display: 'inline-block',
    marginRight: '0.5em',
  };

  return (
    <div style={ style }>Playable section { id }</div>
  );
}

export default ThrowdownSection;