
import _ from 'lodash';

export const get = (state) => { 
  return state.throwdown;
};

export const getDeck = (state, { deckId }) => {
  return _.find(get(state).decks, { id: deckId });
};