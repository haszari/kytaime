import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import throwdownSelectors from './selectors';

import DeckProgress from '../playback-progress/deck-progress.jsx';
import DeckRow from './deck-row.jsx';

function DecksComponent( props ) {
  const deckRows = props.decks.map(
    ( deck ) => {
      return (
        <React.Fragment key={ deck.slug } >
          <DeckRow slug={ deck.slug } />
          <DeckProgress deckSlug={ deck.slug } backgroundColour="#ccc" progressColour="#888" />
        </React.Fragment>
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
};

const mapStateToProps = state => {
  const decks = throwdownSelectors.getDecks( state );

  return {
    decks,
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

const Decks = connect(
  mapStateToProps,
  mapDispatchToProps
)( DecksComponent );

export default Decks;
