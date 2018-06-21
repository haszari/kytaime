
import _ from 'lodash';

import * as actionTypes from './action-types';

export function toggleElementTriggerState(actionParams) {
	return { type: actionTypes.TOGGLE_ELEMENT_TRIGGER_STATE, ...actionParams };
}