import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import actions from './actions';

function TempoDropComponent( props ) {
  return (
    <div>
      <label>
        Next tempo { props.dropTempo } bpm
        <input type="range" min="75" max="300" value={ props.dropTempo } onChange={ props.onChange }/>
      </label>
    </div>
  );
}

TempoDropComponent.propTypes = {
  currentTempo: PropTypes.number,
  dropTempo: PropTypes.number,
  onChange: PropTypes.func,
}

const mapStateToProps = state => {
  return {
    dropTempo: state.tempoDrop.nextTempo,
    currentTempo: state.transport.tempo,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onChange: event => {
      dispatch( actions.setNextTempo( event.target.value ) )
    }
  }
}

const TempoDrop = connect(
  mapStateToProps,
  mapDispatchToProps
)(TempoDropComponent)

export default TempoDrop;