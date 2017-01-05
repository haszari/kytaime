import sequencer from '../../sequencer';
import { connect } from 'react-redux';
import PatternGridLine from '../presentation/pattern-grid-line.jsx';


const mapStateToProps = (state, ownProps) => {
   return {
      patterns: state.patterns
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {

   }
}


const PatternGrid = connect(
   mapStateToProps,
   mapDispatchToProps
)(PatternGridLine);

export default PatternGrid;
