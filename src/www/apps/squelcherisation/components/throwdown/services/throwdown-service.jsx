
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';

import * as actions from '../actions';

import DeckService from './deck-service.jsx';


const mapStateToProps = (state, ownProps) => {
  return {
    decks: state.throwdown.decks
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { };
}

class ThrowdownServiceComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    // we are a service component!
    const { decks, audioContext } = this.props;
    const allTheDecks = _.map( decks, ( deck ) => 
      <DeckService key={ deck.id } id={ deck.id } audioContext={ audioContext } sections={ deck.sections }  />
    );
    return (
      <div>
        { allTheDecks }
      </div>
    );
  }
}

const ThrowdownService = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThrowdownServiceComponent);

export default ThrowdownService;