import { connect } from 'react-redux';

import sequencer from '../../sequencer';

import PatternGridLine from '../presentation/pattern-grid-line.jsx';

import * as actions from '../../stores/actions';


const mapStateToProps = (state, ownProps) => {
   return {
      channel: ownProps.channel,
      patterns: state.patterns.filter(p => p.channel == ownProps.channel)
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      onPatternClick: (id) => {
         dispatch(actions.togglePatternTrigger({id: id}))
      },
      onRowMetaClick: (channel) => {
         console.log(`we'd like to import a pattern into channel line ${channel}`);
         //dispatch(actions.togglePatternTrigger({id: id}))
      }
   }
}


const PatternGrid = connect(
   mapStateToProps,
   mapDispatchToProps
)(PatternGridLine);

export default PatternGrid;
