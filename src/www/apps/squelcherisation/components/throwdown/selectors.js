
import _ from 'lodash';

export const get = (state) => { 
  return state.throwdown;
};

export const getDeck = (state, { deckId }) => {
  return _.find(get(state).decks, { id: deckId });
};

export const getSection = (state, { deckId, sectionId }) => {
  const deck = getDeck(state, { deckId });
  if (deck)
    return _.find(deck.sections, { id: sectionId });
}