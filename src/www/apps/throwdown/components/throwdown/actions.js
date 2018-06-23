
import _ from 'lodash';

import * as actionTypes from './action-types';


export function throwdown_addSnip({ slug }) {
  return { type: actionTypes.THROWDOWN_ADD_SNIP, ...{ slug } };
}
export function throwdown_removeSnip({ slug }) {
  return { type: actionTypes.THROWDOWN_REMOVE_SNIP, ...{ slug } };
}
// export function throwdown_renameSnip({ snipId, name }) {
//   return { type: actionTypes.THROWDOWN_RENAME_SNIP, ...`{ snipId, name } };
// }


// export function toggleElementTriggerState(actionParams) {
// 	return { type: actionTypes.TOGGLE_ELEMENT_TRIGGER_STATE, ...actionParams };
// }