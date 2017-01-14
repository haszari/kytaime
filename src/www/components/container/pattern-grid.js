import { connect } from 'react-redux';

import PatternGrid from '../presentation/pattern-grid.jsx';

import store from '../../stores/store';
import * as actions from '../../stores/actions';



const mapStateToProps = (state, ownProps) => {
   return {
      patternGridLines: state.patterngrid
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      // onRemovePatternClick: (id) => {
      //    dispatch(actions.removePattern({id: id}));
      // },

   }
}


const PatternGrid_Container = connect(
   mapStateToProps,
   mapDispatchToProps
)(PatternGrid);

export default PatternGrid_Container;
