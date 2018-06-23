import _ from 'lodash';

import { default as slugify } from 'slug';

import * as actionTypes from './action-types';



// function stemReducer(state = {
//   name: '',
//   trigger: false,
// }, action) {
//   switch (action.type) {

//     case actionTypes.TOGGLE_ELEMENT_TRIGGER_STATE:
//     return Object.assign({}, state, {
//       trigger: !state.trigger
//     });            

//     default:
//     return state;
//   }
// }

// function stemReducer(state = {
//   name: '',


// function snipsReducer(state = {}, action) {
//   switch (action.type) {
//     case actionTypes.THROWDOWN_ADD_SNIP:
//       return { ...state, ...snipReducer({}, action) };

//     case actionTypes.THROWDOWN_REMOVE_SNIP:
//     case actionTypes.THROWDOWN_RENAME_SNIP:
//       return state.map( (snip) => {
//         if (snip.id === action.snipId) {
//           return snipReducer(snip, action);;
//         }

//         return snip;
//       });      
//   }
// }

function snipReducer(state = {
  slug: '',
}, action) {
  switch (action.type) {

    // case actionTypes.THROWDOWN_ADD_SNIP:
    // // case actionTypes.THROWDOWN_REMOVE_SNIP:
    // // case actionTypes.THROWDOWN_RENAME_SNIP:
    //   return { 
    //     slug: slug(action.slug)
    //   };

  }
  return state;

}

function tidySlug(desiredSlug, existingSlugs) {
  let uniqueSlug = slugify(desiredSlug);
  while (_.includes(existingSlugs, uniqueSlug))
    uniqueSlug += _.sample('123456789');
  return uniqueSlug;
}


const throwdownReducer = (state = { 
  // object map of slug: { snip data }
}, action) => {
  switch (action.type) {

    case actionTypes.THROWDOWN_ADD_SNIP:
      const slug = tidySlug(action.slug, _.keys(state));
      const newSnip = { [slug]: { test: 'test' } };
      // newSnip[slug] = { test: 'test' };
      return { ...state, ...newSnip };

    case actionTypes.THROWDOWN_REMOVE_SNIP:
      return _.omit(state, action.slug);

    // case actionTypes.THROWDOWN_RENAME_SNIP:
  }
  return state;
}

export default throwdownReducer;