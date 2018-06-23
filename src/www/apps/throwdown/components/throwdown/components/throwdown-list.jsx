
import _ from 'lodash';

import React from 'react';

import { connect } from 'react-redux';

import * as actions from '../actions';


const mapStateToProps = (state, ownProps) => {
  return {
    snips: state.throwdown
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { };
}

const renderThrowdownList = function(props) {
  let { snips } = props;

  // this is clearly going to get more componentised, this is ridiculous/prototype
  return (
    <table>
      <thead><tr>
      { 
        _.map(snips, (snip, name) => {
          return ( <td key={name}>{name}</td> ) 
        }) 
      }
      </tr></thead>
      <tbody>
        <tr>
        { _.map(snips, (snip, name) => {
            return (<td key={name}> { _.map(snip.parts, (part, name) => {
              return ( <p key={name}>{name}</p> ) 
            }) } </td>);
        }) }
        </tr>
      </tbody>
    </table>
  );
} 

const ThrowdownList = connect(
  mapStateToProps,
  mapDispatchToProps
)(renderThrowdownList);

export default ThrowdownList;