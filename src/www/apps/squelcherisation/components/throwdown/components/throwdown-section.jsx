
import React from 'react';

const ThrowdownSection = (props) => {
  const { id, setTriggeredSection, triggered, playing, data } = props;
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

  const partPlayers = _.map(data.parts, (part) => {
    return (<div>{ part.label }</div>);
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