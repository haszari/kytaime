
import _ from 'lodash';

import * as actionTypes from './action-types';


export function throwdown_addDeck() {
  return { type: actionTypes.THROWDOWN_ADD_DECK };
}
export function throwdown_removeDeck({ deckId }) {
  return { type: actionTypes.THROWDOWN_REMOVE_DECK, ...{ deckId } };
}

export function throwdown_addSection({ deckId, data }) {
  return { type: actionTypes.THROWDOWN_ADD_SECTION, ...{ deckId, data } };
}
export function throwdown_removeSection({ deckId, sectionId }) {
  return { type: actionTypes.THROWDOWN_REMOVE_SECTION, ...{ deckId, sectionId } };
}
export function throwdown_setTriggeredSection({ deckId, sectionId }) {
  // pass sectionId: null to clear triggered section
  return { type: actionTypes.THROWDOWN_SET_TRIGGERED_SECTION, ...{ deckId, sectionId } };
}
export function throwdown_setPlayingSection({ deckId, sectionId }) {
  // pass sectionId: null to clear playing section
  return { type: actionTypes.THROWDOWN_SET_PLAYING_SECTION, ...{ deckId, sectionId } };
}


export function throwdown_updateSectionRenderPosition({ deckId, sectionId, time }) {
  return { type: actionTypes.THROWDOWN_UPDATE_SECTION_RENDER_POSITION, ...{ deckId, sectionId, time } };
}

export function throwdown_setPartTriggered({ deckId, sectionId, partId }) {
  return { type: actionTypes.THROWDOWN_SET_PART_TRIGGERED, ...{ deckId, sectionId, partId } };
}


/// these actions are asleep right now

export function throwdown_addSnip({ slug }) {
  return { type: actionTypes.THROWDOWN_ADD_SNIP, ...{ slug } };
}
export function throwdown_removeSnip({ slug }) {
  return { type: actionTypes.THROWDOWN_REMOVE_SNIP, ...{ slug } };
}
export function throwdown_renameSnip({ slug, newSlug }) {
  return { type: actionTypes.THROWDOWN_RENAME_SNIP, ...{ slug, newSlug } };
}

export function throwdown_addSnipStem(props) {
  const { snip, slug, pattern } = props;
  const audio = props.audio || undefined;
  return { type: actionTypes.THROWDOWN_ADD_SNIP_STEM, ...{ snip, slug, audio, pattern } };
}
export function throwdown_removeSnipStem({ snip, slug }) {
  return { type: actionTypes.THROWDOWN_REMOVE_SNIP_STEM, ...{ snip, slug } };
}
export function throwdown_toggleSnipStemTrigger({ snip, slug }) {
  return { type: actionTypes.THROWDOWN_TOGGLE_SNIP_STEM_TRIGGER, ...{ snip, slug } };
}


export function throwdown_updateSnipStemRenderPosition({ snip, slug, time }) {
  return { type: actionTypes.THROWDOWN_UPDATE_SNIP_STEM_RENDER_POSITION, ...{ snip, slug, time } };
}
