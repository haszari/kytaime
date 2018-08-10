
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';

import * as actions from '../actions';

// import SnipService from './snip-service.jsx';


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
  // componentWillMount() {
  //   this.audioContext = new AudioContext();
  // }
  
  // componentWillUnmount() {
  //   this.audioContext.close();
  // }
  
  // shouldComponentUpdate(props) {
  //   return props.events.length > 0;
  // }
  
  // componentWillUpdate(props) {
  //   props.events.forEach(this.processEvent.bind(this));
  //   props.dispatch({
  //     type: "CLEAR_EVENT_QUEUE"
  //   });
  // }
  
  render() {
    const { decks, audioContext } = this.props;
    const allTheDecks = _.map( decks, ( deck ) => 
      // <SnipService audioContext={ audioContext } key={ snipSlug } slug={ snipSlug } stems={ snip.stems } />
      <div key={ deck.id }>Throwdown deck { deck.id }</div>
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