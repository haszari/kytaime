
import React from 'react';


import ThrowdownSection from './throwdown-section.jsx';


const ThrowdownDeck = (props) => {
  const { id, sections } = props;
  const style = {
    backgroundColor: '#f8f8f8',
    borderRadius: '0.2em',
    padding: '0.5em',
    marginBottom: '1.5em',
  };

  const sectionList = _.map( sections, ( section ) => 
    <ThrowdownSection key={ section.id } id={ section.id } />
  );

  return (
    <div style={ style }>
      <div>Throwdown deck { id }</div>
      { sectionList }
    </div>
  );
}

export default ThrowdownDeck;