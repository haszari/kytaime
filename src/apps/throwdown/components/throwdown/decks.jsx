import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import throwdownSelectors from './selectors';

import DeckRow from './deck-row.jsx';

function DecksComponent( props ) {
  const deckRows = props.decks.map( 
    ( deck ) => {
      return ( 
        <DeckRow 
          key={ deck.slug }
          slug={ deck.slug }
        />
      );
    }
  );
  return (
    <React.Fragment>
      { deckRows }
    </React.Fragment>

  );
}

DecksComponent.propTypes = {
  decks: PropTypes.array,
}

const mapStateToProps = state => {
  const decks = throwdownSelectors.getDecks( state );

  return {
    decks,
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

const Decks = connect(
  mapStateToProps,
  mapDispatchToProps
)(DecksComponent)

export default Decks;