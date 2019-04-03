import React from 'react';
import PropTypes from 'prop-types';

import Hjson from 'hjson';

import { connect } from 'react-redux';

import store from '../../store/store';

import selectors from './selectors';
import actions from './actions';

import fileImport from './file-import';

function GhostDeckComponent( props ) {
  var classes = "deck-row deck-row-drophint ";
  if ( props.highlighted ) {
    classes += "deck-row-drophint-highlighted ";
  }

  return (
    <tr className={ classes } >
      {/* this is here to expand the background to full width */}
      <td colSpan="99"></td> 
    </tr>

  );
}

GhostDeckComponent.propTypes = {
  highlighted: PropTypes.bool,
}

const mapStateToProps = ( state, ownProps ) => {
  const dragState = selectors.getDragDrop( state, ownProps.slug );
  
  return {
    highlighted: dragState.dropHighlightAddNew
  }
}

const mapDispatchToProps = ( dispatch, ownProps ) => {
  return {
  }
}

const GhostDeck = connect(
  mapStateToProps,
  mapDispatchToProps
)(GhostDeckComponent)

document.addEventListener('dragover', event => {
  event.preventDefault();
  store.dispatch( actions.setDropHighlight( {
    addNew: true,
  } ) );
} );

function resetDragState( event ) {
  store.dispatch( actions.setDropHighlight() );
}
document.addEventListener('dragend', resetDragState );
document.addEventListener('dragleave', resetDragState );

document.addEventListener('drop', event => { 
  event.preventDefault(); 

  // should really loop and import each file as new deck
  if (event.dataTransfer.files.length >= 1) {
    const filename = event.dataTransfer.files[0].name;
    const fileReader = new FileReader();

    fileReader.onloadend = ( loadedEvent ) => {
      const importRaw = loadedEvent.currentTarget.result;
      var importContent = Hjson.parse( importRaw );
      fileImport.importThrowdownData( filename, importContent );
    }

    fileReader.readAsText( event.dataTransfer.files[0] );
  }

  resetDragState();
} );

export default GhostDeck;
