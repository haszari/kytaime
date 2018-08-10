
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';

import * as actions from '../actions';

// import SnipService from './snip-service.jsx';


const mapStateToProps = (state, ownProps) => {
  return {
    lines: state.throwdown.lines
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
    const { lines, audioContext } = this.props;
    const throwdownLines = _.map(lines, (lyin) => 
      // <SnipService audioContext={ audioContext } key={ snipSlug } slug={ snipSlug } stems={ snip.stems } />
      <div key={lyin.id}>Line down {lyin.id}</div>
    );
    return (
      <div>
        { throwdownLines }
      </div>
    );
  }
}

const ThrowdownService = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThrowdownServiceComponent);

export default ThrowdownService;