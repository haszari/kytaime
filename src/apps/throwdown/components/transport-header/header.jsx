import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import PlayButton from './play-button.jsx';
import TempoDrop from './tempo-drop.jsx';

import throwdownSelectors from '../throwdown/selectors';
import throwdownActions from '../throwdown/actions';

function HeaderTransportBarComponent( props ) {
  const currentTriggerLength = props.deferAllTriggers ? '∞' : props.phraseLoop;
  const currentPhraseIfNeeded = props.deferAllTriggers ? ` (${ props.phraseLoop })` : '';
  return (
    <tr className="header">
      <th onClick={ 
        props.handleDeferAllTriggers.bind( undefined, ! props.deferAllTriggers ) 
      }>
        <span style={{ fontWeight: "bold" }}>{ currentTriggerLength }</span><span style={{ fontSize: 'smaller' }}>{ currentPhraseIfNeeded }</span>
      </th>
      <th style={{ borderRight: "1px solid #bbb" }}><TempoDrop /></th>
      <th style={{ fontWeight: "bold" }}>{ props.tempo.toFixed( 1 ) } bpm</th>
      <th style={{ textAlign: "left" }} colSpan="99"><PlayButton /></th>
    </tr>
  );
}

HeaderTransportBarComponent.propTypes = {
  tempo: PropTypes.number,
  phraseLoop: PropTypes.number,
  deferAllTriggers: PropTypes.bool,
  handleDeferAllTriggers: PropTypes.func,
}

const mapStateToProps = state => {
  return {
    ...state.transport, 
    phraseLoop: throwdownSelectors.getPhraseLoop( state ),
    deferAllTriggers: throwdownSelectors.getThrowdown( state ).deferAllTriggers
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleDeferAllTriggers: defer => {
      dispatch( throwdownActions.setDeferAllTriggers( defer ) )
    }
  }
}

const HeaderTransportBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderTransportBarComponent);



export default HeaderTransportBar;