
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
  return { 
    toggleStemTriggerState: (snip, stem) => {
      dispatch(actions.throwdown_toggleSnipStemTrigger({ snip, slug: stem }));
    }
  };
}

const ThrowdownStem = function(props) {
  const { snipSlug, stemSlug, triggered, toggleStemTriggerState } = props;

  let stemElement = stemSlug;
  if (triggered) {
    stemElement = (
      <i>{ stemElement }</i>
    );
  }

  return ( 
    <p key={ stemSlug } onClick={ toggleStemTriggerState.bind(undefined, snipSlug, stemSlug) } >
      { stemElement }
    </p> 
  );
}

const ThrowdownSnip = function(props) {
  const { slug, snipInfo, toggleStemTriggerState } = props;

  return (<td> { 
    _.map(snipInfo.stems, (stemInfo, stemSlug) => {
      return ( 
        <ThrowdownStem 
          snipSlug={ slug }
          key={ stemSlug }
          stemSlug={ stemSlug }
          triggered={ stemInfo.trigger }
          toggleStemTriggerState={ toggleStemTriggerState }
        />
      ) 
    }) 
  } </td>);
}

const renderThrowdownList = function(props) {
  let { snips, toggleStemTriggerState } = props;
  let sortedSnips = _.map(snips, (snip, slug) => { return { slug: slug, snipInfo: snip } })
  sortedSnips = _.sortBy(sortedSnips, 'slug');

  // this is clearly going to get more componentised, this is ridiculous/prototype
  return (
    <table>
      <thead><tr>
      { 
        _.map(sortedSnips, (item) => {
          return ( <td key={item.slug}>{item.slug}</td> ) 
        }) 
      }
      </tr></thead>
      <tbody>
        <tr>
        { _.map(sortedSnips, (item) => {
          return ( 
            <ThrowdownSnip 
              slug={ item.slug } 
              key={ item.slug } 
              snipInfo={ item.snipInfo } 
              toggleStemTriggerState={ toggleStemTriggerState }
            /> 
          )
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