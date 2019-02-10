import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import transportActions from '../store/transport/actions';

function TempoSliderComponent( props ) {
  return (
    <div>
      <label>
        Current tempo { props.tempoBpm } bpm
        <input type="range" min="75" max="300" value={ props.tempoBpm } onChange={ props.onTempoChange }/>
      </label>
    </div>
  );
}

TempoSliderComponent.propTypes = {
  tempoBpm: PropTypes.number,
  onTempoChange: PropTypes.func,
}

const mapStateToProps = state => {
  return {
    tempoBpm: state.transport.tempo,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTempoChange: event => {
      dispatch( transportActions.setTempo( event.target.value ) )
    }
  }
}

const TempoSlider = connect(
  mapStateToProps,
  mapDispatchToProps
)(TempoSliderComponent)

export default TempoSlider;