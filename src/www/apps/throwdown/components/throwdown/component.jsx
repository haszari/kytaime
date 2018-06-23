
import React from 'react';

import { connect } from 'react-redux';

import * as actions from './actions';


const mapStateToProps = (state, ownProps) => {
  return {
    snips: _.keys(state.throwdown)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { };
}

const renderThrowdownList = function(props) {
  let { snips } = props;
  let style = {
    minWidth: 50
  };
  return (
    <select size="8" style={style}>
      { 
        snips.map((name) => {
          return ( <option value={name} key={name}>{name}</option> ) 
        }) 
      }
    </select>
  );
} 

const ThrowdownList = connect(
  mapStateToProps,
  mapDispatchToProps
)(renderThrowdownList);

export default ThrowdownList;