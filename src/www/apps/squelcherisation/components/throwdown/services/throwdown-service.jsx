
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';

import * as actions from '../actions';

import SnipService from './snip-service.jsx';


const mapStateToProps = (state, ownProps) => {
  return {
    snips: state.throwdown
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
    const { snips, audioContext } = this.props;
    const allSnips = _.map(snips, (snip, snipSlug) => 
      <SnipService audioContext={ audioContext } key={ snipSlug } slug={ snipSlug } stems={ snip.stems } />
    );
    return (
      <div>
        { allSnips }
      </div>
    );
  }
}

const ThrowdownService = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThrowdownServiceComponent);

export default ThrowdownService;