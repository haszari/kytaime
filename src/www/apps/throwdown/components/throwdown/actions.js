
import _ from 'lodash';

import * as actionTypes from './action-types';


export function throwdown_addSnip({ slug }) {
  return { type: actionTypes.THROWDOWN_ADD_SNIP, ...{ slug } };
}
export function throwdown_removeSnip({ slug }) {
  return { type: actionTypes.THROWDOWN_REMOVE_SNIP, ...{ slug } };
}
export function throwdown_renameSnip({ slug, newSlug }) {
  return { type: actionTypes.THROWDOWN_RENAME_SNIP, ...{ slug, newSlug } };
}

export function throwdown_addSnipStem({ snip, slug, data }) {
  return { type: actionTypes.THROWDOWN_ADD_SNIP_STEM, ...{ snip, slug, data } };
}
export function throwdown_removeSnipStem({ snip, slug }) {
  return { type: actionTypes.THROWDOWN_REMOVE_SNIP_STEM, ...{ snip, slug } };
}
export function throwdown_toggleSnipStemTrigger({ snip, slug }) {
  return { type: actionTypes.THROWDOWN_TOGGLE_SNIP_STEM_TRIGGER, ...{ snip, slug } };
}
