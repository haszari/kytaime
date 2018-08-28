
import _ from 'lodash';

import * as actionTypes from './action-types';


export function throwdown_addDeck() {
  return { type: actionTypes.THROWDOWN_ADD_DECK };
}
export function throwdown_removeDeck({ deckId }) {
  return { type: actionTypes.THROWDOWN_REMOVE_DECK, ...{ deckId } };
}

export function throwdown_addSection({ deckId, slug, parts }) {
  return { type: actionTypes.THROWDOWN_ADD_SECTION, ...{ deckId, slug, parts } };
}
export function throwdown_removeSection({ deckId, sectionId }) {
  return { type: actionTypes.THROWDOWN_REMOVE_SECTION, ...{ deckId, sectionId } };
}

export function throwdown_setSectionTriggered({ deckId, sectionId, triggered }) {
  return { type: actionTypes.THROWDOWN_SET_SECTION_TRIGGERED, ...{ deckId, sectionId, triggered } };
}
export function throwdown_setSectionPlaying({ deckId, sectionId, playing }) {
  return { type: actionTypes.THROWDOWN_SET_SECTION_PLAYING, ...{ deckId, sectionId, playing } };
}
export function throwdown_updateSectionRenderPosition({ deckId, sectionId, time }) {
  return { type: actionTypes.THROWDOWN_UPDATE_SECTION_RENDER_POSITION, ...{ deckId, sectionId, time } };
}

export function throwdown_setPartTriggered({ deckId, sectionId, partSlug, triggered }) {
  return { type: actionTypes.THROWDOWN_SET_PART_TRIGGERED, ...{ deckId, sectionId, partSlug, triggered } };
}

export function throwdown_setPartPlaying({ deckId, sectionId, partSlug, playing }) {
  return { type: actionTypes.THROWDOWN_SET_PART_PLAYING, ...{ deckId, sectionId, partSlug, playing } };
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
