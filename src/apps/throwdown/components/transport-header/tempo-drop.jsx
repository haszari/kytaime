import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import transportActions from '../transport/actions';

function TempoDropComponent( props ) {
  return (
    <input 
      type="number" min="75" max="300"
      value={ props.dropTempo }
      onChange={ props.onChange }
    />
  );
}

TempoDropComponent.propTypes = {
  currentTempo: PropTypes.number,
  dropTempo: PropTypes.number,
  onChange: PropTypes.func,
}

const mapStateToProps = state => {
  return {
    dropTempo: state.transport.nextTempo,
    currentTempo: state.transport.tempo,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onChange: event => {
      dispatch( transportActions.setNextTempo( event.target.value ) )
    }
  }
}

const TempoDrop = connect(
  mapStateToProps,
  mapDispatchToProps
)(TempoDropComponent)

export default TempoDrop;