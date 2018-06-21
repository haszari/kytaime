
import * as actionTypes from './action-types';

function partReducer(state = {
  id: '',
  trigger: false,
}, action) {
  switch (action.type) {

    case actionTypes.TOGGLE_ELEMENT_TRIGGER_STATE:
    return Object.assign({}, state, {
      trigger: !state.trigger
    });            

    default:
    return state;
  }
}

function partsReducer(state = [], action) {
  return state.map( (part) => {
    if (part.id !== action.partId) {
      return part;
    }

    return partReducer(item, action);
  });
}

const throwdowns = (state = { 
  parts: []
}, action) => {
  switch (action.type) {

    case actionTypes.TOGGLE_ELEMENT_TRIGGER_STATE:
    return partsReducer(state, action);

    default:
    return state;
  }
}

export default throwdowns;