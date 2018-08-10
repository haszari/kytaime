
import React from 'react';




const ThrowdownDeck = (props) => {
  const { id } = props;
  const style = {
    backgroundColor: '#f8f8f8',
    borderRadius: '0.2em',
    padding: '1em 0',
    marginBottom: '1.5em',
  };

  return (
    <div style={ style }>Throwdown deck { id }</div>
  );
}

export default ThrowdownDeck;