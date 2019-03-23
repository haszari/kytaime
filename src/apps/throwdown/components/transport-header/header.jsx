import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import PlayButton from './play-button.jsx';
import TempoDrop from './tempo-drop.jsx';

import throwdownSelectors from '../throwdown/selectors';

function HeaderTransportBarComponent( props ) {
  return (
    <tr className="header">
      <th>{ props.phraseLoop }</th>
      <th style={{ borderRight: "1px solid #bbb" }}><TempoDrop /></th>
      <th>{ props.tempo } bpm</th>
      <th style={{ textAlign: "left" }}><PlayButton /></th>
    </tr>
  );
}

HeaderTransportBarComponent.propTypes = {
  tempo: PropTypes.number,
  phraseLoop: PropTypes.number,
}

const mapStateToProps = state => {
  return {
    ...state.transport, 
    phraseLoop: throwdownSelectors.getPhraseLoop( state ),
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

const HeaderTransportBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderTransportBarComponent);



export default HeaderTransportBar;