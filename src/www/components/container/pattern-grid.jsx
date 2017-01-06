import { connect } from 'react-redux';

import sequencer from '../../sequencer';

import PatternGridLine from '../presentation/pattern-grid-line.jsx';

import * as actions from '../../stores/actions';


const mapStateToProps = (state, ownProps) => {
   return {
      patterns: state.patterns
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      onPatternClick: (id) => {
         dispatch(actions.togglePatternTrigger({id: id}))
      }
   }
}


const PatternGrid = connect(
   mapStateToProps,
   mapDispatchToProps
)(PatternGridLine);

export default PatternGrid;
