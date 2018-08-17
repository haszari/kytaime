
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';

// import * as actions from '../actions';

import ThrowdownDeck from './throwdown-deck.jsx';

import { getDecks } from '../selectors';


const mapStateToProps = (state, ownProps) => {
  return {
    decks: getDecks( state ),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { 
  };
}

class ThrowdownDecksComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { decks } = this.props;
    const allTheDecks = _.map( decks, ( deck ) => 
      <ThrowdownDeck key={ deck.id } id={ deck.id } sections={ deck.sections } />
    );
    return (
      <div>
        { allTheDecks }
      </div>
    );
  }
}

const ThrowdownDecks = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThrowdownDecksComponent);

export default ThrowdownDecks;