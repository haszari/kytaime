import React from 'react';
import PropTypes from 'prop-types';

import { connect, } from 'react-redux';

import Hjson from 'hjson';

import throwdownSelectors from './selectors';
import dragDropSelectors from '../drag-drop/selectors';

import actions from './actions';
import dragDropActions from '../drag-drop/actions';

import deckColours from './deck-colours';

import fileImport from '../drag-drop/file-import';

import SectionTrigger from './section.jsx';

function DeckSectionsTriggersComponent( props ) {
  const backgroundColour = deckColours.hueToBackgroundColour( props.deckState.hue, props.highlighted );
  const edgeColour = deckColours.hueToBorderColour( props.deckState.hue );
  const deckSlug = props.deckState.slug;
  const isTriggered = props.deckState.triggeredSection;
  const isPlaying = props.deckState.playingSection;

  const sections = props.deckState.sections.map(
    ( section ) => {
      // const state = _.find( props.deckState, { 'slug': section.slug } ) || {};
      return (
        <SectionTrigger
          key={ section.slug }
          triggered={ props.deckState.triggeredSection === section.slug }
          playing={ props.deckState.playingSection === section.slug }
          slug={ section.slug }
          onSetTriggeredSection={ props.onSetTriggeredSection }
          hue={ props.deckState.hue }
          parts={ section.parts }
        />
      );
    }
  );
  return (
    <tr
      className="deck-row" style={{ backgroundColor: backgroundColour, }}
      onDragOver={ props.onDragOver }
      onDragLeave={ props.onDragLeave }
      onDrop={ props.onDrop }
    >
      <td>
        { props.phraseLoop }{ props.highlighted }
      </td>
      <td style={{
        borderRight: `1px solid ${ edgeColour }`,
        backgroundColor: backgroundColour,
      }}>
        {/* deck tempo, title, metadata */}
        <div style={{
          fontWeight: isPlaying ? 'bold' : 'normal',
          fontStyle: isTriggered ? 'italic' : 'normal',
        }}>{ deckSlug }</div>
      </td>

      { sections }

      {/* this is here to expand the background to full width */}
      <td colSpan="99"></td>
    </tr>

  );
}

DeckSectionsTriggersComponent.propTypes = {
  slug: PropTypes.string,
  deckState: PropTypes.object,
  onSetTriggeredSection: PropTypes.func,
  phraseLoop: PropTypes.number,

  highlighted: PropTypes.bool,

  onDragOver: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func,
};

const mapStateToProps = ( state, ownProps ) => {
  const deckState = throwdownSelectors.getDeck( state, ownProps.slug );
  const phraseLoop = throwdownSelectors.getDeckPhraseLoop( state, ownProps.slug );
  const dragState = dragDropSelectors.getDragDrop( state );

  return {
    deckState,
    phraseLoop,
    highlighted: dragState.dropHighlightDeck === ownProps.slug,
  };
};

const mapDispatchToProps = ( dispatch, ownProps ) => {
  return {
    onSetTriggeredSection: ( sectionSlug ) => {
      dispatch(
        actions.setDeckTriggeredSection( {
          deckSlug: ownProps.slug,
          sectionSlug,
        } )
      );
    },

    onDragOver: event => {
      event.preventDefault();
      dispatch( dragDropActions.setDropHighlight( {
        dropHighlightDeck: ownProps.slug,
      } ) );
    },

    onDragLeave: event => {
      event.preventDefault();
      dispatch( dragDropActions.setDropHighlight( {
        dropHighlightDeck: '',
      } ) );
    },

    onDrop: event => {
      event.preventDefault();
      event.stopPropagation();

      // should really loop and import each file as new deck
      // this blob should be a method
      if ( event.dataTransfer.files.length >= 1 ) {
        const filename = event.dataTransfer.files[0].name;
        const fileReader = new FileReader();

        fileReader.onloadend = ( loadedEvent ) => {
          const importRaw = loadedEvent.currentTarget.result;
          var importContent = Hjson.parse( importRaw );
          fileImport.importThrowdownData( filename, importContent, ownProps.slug );
        };

        fileReader.readAsText( event.dataTransfer.files[0] );
      }

      // share this aka resetDragState
      dispatch( dragDropActions.setDropHighlight() );
    },

  };
};

const DeckSectionsTriggers = connect(
  mapStateToProps,
  mapDispatchToProps
)( DeckSectionsTriggersComponent );

export default DeckSectionsTriggers;
