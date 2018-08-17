
import _ from 'lodash';

export const getDecks = (state) => { 
  return state.decks;
};

export const getDeck = (state, { deckId }) => {
  return _.find(getDecks(state), { id: deckId });
};

export const getSection = (state, { deckId, sectionId }) => {
  const deck = getDeck(state, { deckId });
  if (deck)
    return _.find(deck.sections, { id: sectionId });
}

// this could come from state and be an option with UI etc
// it's kinda like "breathing room"
const minSectionPhraseDuration = 4; 

export const getSectionPhraseDuration = (state, { deckId, sectionId }) => {
  const section = getSection(state, { deckId, sectionId });
  if (section && section.data && section.data.parts)
    return _.reduce(section.data.parts, (accum, part) => {
      const patternDuration = (part.data && part.data.pattern) ? part.data.pattern.duration : 0;
      return Math.max(patternDuration, accum)
    }, minSectionPhraseDuration);
  return minSectionPhraseDuration;
}

// same thing with array?
export const getPhraseDuration = (state, { deckId, sectionIds }) => {
  const bim = _.reduce(sectionIds, (accum, sectionId) => {
    return Math.max(getSectionPhraseDuration(state, { deckId, sectionId }), accum);
  }, minSectionPhraseDuration);
  return bim;
}