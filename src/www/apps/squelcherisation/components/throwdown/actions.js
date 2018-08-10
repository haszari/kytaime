
import _ from 'lodash';

import * as actionTypes from './action-types';


export function throwdown_addDeck() {
  return { type: actionTypes.THROWDOWN_ADD_DECK };
}
export function throwdown_removeDeck({ deckId }) {
  return { type: actionTypes.THROWDOWN_REMOVE_DECK, ...{ deckId } };
}

export function throwdown_addSection({ deckId }) {
  return { type: actionTypes.THROWDOWN_ADD_SECTION, ...{ deckId /* section info coming soon */ } };
}
export function throwdown_removeSection({ deckId, sectionId }) {
  return { type: actionTypes.THROWDOWN_REMOVE_SECTION, ...{ deckId, sectionId } };
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
