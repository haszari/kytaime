
import React from 'react';

import { connect } from 'react-redux';

import * as actions from '../actions';
import { getDeck } from '../selectors';

import ThrowdownSection from './throwdown-section.jsx';

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { 
    setDeckTriggeredSection: ({ sectionId, triggered }) => {
      dispatch(actions.throwdown_setSectionTriggered({ deckId: ownProps.id, sectionId, triggered }));
    },
    setDeckTriggeredSectionPart: ({ sectionId, partSlug, triggered }) => {
      dispatch(actions.throwdown_setPartTriggered({ deckId: ownProps.id, sectionId, partSlug, triggered }));
    },
  };
}

const ThrowdownDeckComponent = (props) => {
  const { id, sections, setDeckTriggeredSection, setDeckTriggeredSectionPart } = props;
  const style = {
    backgroundColor: '#f8f8f8',
    borderRadius: '0.2em',
    padding: '0.5em',
    marginBottom: '1.5em',
    marginRight: '1.5em',
    userSelect: 'none',
    display: 'inline-block',
  };

  const sectionList = _.map( sections, ( section ) => 
    <ThrowdownSection 
      key={ section.id } id={ section.id } 

      slug={ section.slug }

      setTriggeredSection={ setDeckTriggeredSection } 
      triggered={ section.triggered } 
      playing={ section.playing } 

      setPartTrigger={ setDeckTriggeredSectionPart } 

      parts={ section.parts }
    />
  );

  return (
    <div style={ style }>
      <div>deck { id }</div>
      { sectionList }
    </div>
  );
}



const ThrowdownDeck = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThrowdownDeckComponent);


export default ThrowdownDeck;