
import React from 'react';

import { connect } from 'react-redux';

import * as actions from '../actions';
import { getDeck } from '../selectors';

import ThrowdownSection from './throwdown-section.jsx';

const mapStateToProps = (state, ownProps) => {
  let isTriggered = false;
  const deck = getDeck(state, { deckId: ownProps.id });
  return {
    triggeredSectionId: deck.triggeredSectionId,
    playingSectionId: deck.playingSectionId,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { 
    setDeckTriggeredSection: ({ sectionId }) => {
      dispatch(actions.throwdown_setTriggeredSection({ deckId: ownProps.id, sectionId }));
    }
  };
}

const ThrowdownDeckComponent = (props) => {
  const { id, sections, setDeckTriggeredSection, triggeredSectionId, playingSectionId } = props;
  const style = {
    backgroundColor: '#f8f8f8',
    borderRadius: '0.2em',
    padding: '0.5em',
    marginBottom: '1.5em',
    userSelect: 'none',
  };

  const sectionList = _.map( sections, ( section ) => 
    <ThrowdownSection 
      key={ section.id } id={ section.id } 

      setTriggeredSection={ setDeckTriggeredSection } 
      triggered={ triggeredSectionId == section.id } 
      playing={ playingSectionId == section.id } 

      data={ section.data }
    />
  );

  return (
    <div style={ style }>
      <div>Throwdown deck { id }</div>
      { sectionList }
    </div>
  );
}



const ThrowdownDeck = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThrowdownDeckComponent);


export default ThrowdownDeck;