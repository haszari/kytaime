import React from 'react';
import PropTypes from 'prop-types';

import Hjson from 'hjson';

import { connect } from 'react-redux';

import store from '../../store/store';

import selectors from './selectors';
import actions from './actions';

import fileImport from './file-import';

function GhostDeckComponent( props ) {
  var classes = 'deck-row deck-row-drophint ';
  if ( props.highlighted ) {
    classes += 'deck-row-drophint-highlighted ';
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
};

const mapStateToProps = ( state, ownProps ) => {
  const dragState = selectors.getDragDrop( state, ownProps.slug );

  return {
    highlighted: dragState.dropHighlightAddNew,
  };
};

const mapDispatchToProps = ( dispatch, ownProps ) => {
  return {
  };
};

const GhostDeck = connect(
  mapStateToProps,
  mapDispatchToProps
)( GhostDeckComponent );

document.addEventListener( 'dragover', event => {
  event.preventDefault();
  store.dispatch( actions.setDropHighlight( {
    dropHighlightAddNew: true,
  } ) );
} );

function BackgroundDropTargetComponent( props ) {
  var classes = 'background-target ';
  if ( props.highlighted ) {
    classes += 'background-target-highlighted ';
  }

  return (
    <div
      className={ classes }
      onDragOver={ props.onDragOver }
      onDragLeave={ props.onDragLeave }
      onDrop={ props.onDrop }
    >
    </div>
  );
}

BackgroundDropTargetComponent.propTypes = {
  highlighted: PropTypes.bool,
  onDragOver: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func,
};

function resetDragState( event ) {
  store.dispatch( actions.setDropHighlight() );
}

const BackgroundDropTarget = connect(
  ( state, ownProps ) => {
    const dragState = selectors.getDragDrop( state, ownProps.slug );

    return {
      highlighted: dragState.dropHighlightAddNew,
    };
  },
  ( dispatch, ownProps ) => {
    return {
      onDragOver: event => {
        event.preventDefault();
        dispatch( actions.setDropHighlight( {
          dropHighlightAddNew: true,
        } ) );
      },

      onDragLeave: resetDragState,

      onDrop: event => {
        event.preventDefault();
        event.stopPropagation();

        // should really loop and import each file as new deck
        // this blob should be a method
        for ( var i = 0; i < event.dataTransfer.files.length; i++ ) {
          const file = event.dataTransfer.files[i];
          const fileReader = new FileReader();

          fileReader.onloadend = ( loadedEvent ) => {
            const importRaw = loadedEvent.currentTarget.result;
            var importContent = Hjson.parse( importRaw );
            fileImport.importThrowdownData( file.name, importContent, ownProps.slug );
          };

          fileReader.readAsText( file );
        }

        // share this aka resetDragState
        resetDragState();
      },
    };
  }
)( BackgroundDropTargetComponent );

document.addEventListener( 'dragover', event => {
  event.preventDefault();
  store.dispatch( actions.setDropHighlight( {
    dropHighlightAddNew: true,
  } ) );
} );

// prevent dropping file from triggering browser behaviour (e.g. navigate to file)
document.addEventListener( 'dragend', event => event.preventDefault() );
document.addEventListener( 'dragleave', event => event.preventDefault() );
document.addEventListener( 'drop', event => event.preventDefault() );

export default {
  GhostDeck,
  BackgroundDropTarget,
};
