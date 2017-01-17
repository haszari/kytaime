import { connect } from 'react-redux';

import hjson from 'hjson';

import PatternGrid from '../presentation/pattern-grid.jsx';

import * as actions from '../../stores/actions';

const mapStateToProps = (state, ownProps) => {
   return {
      patternGridLines: state.patterngrid
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      onFilesDropped: (event) => {
         if (event.dataTransfer.files.length >= 1) {
            let fileReader = new FileReader();
            fileReader.onloadend = () => {
               let json = fileReader.result;
               let stateTree = hjson.parse(json);
               dispatch(actions.importRehydrate(stateTree)); 
            }
            fileReader.readAsText(event.dataTransfer.files[0]);
         }
      },

   }
}


const PatternGrid_Container = connect(
   mapStateToProps,
   mapDispatchToProps
)(PatternGrid);

export default PatternGrid_Container;
