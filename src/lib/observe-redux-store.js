
// (thanks to https://github.com/reduxjs/redux/issues/303#issuecomment-125184409)

function observeReduxStore( store, select, onChange ) {
  let currentState;

  function handleChange() {
    let nextState = select( store.getState() );
    if ( nextState !== currentState ) {
      currentState = nextState;
      onChange( currentState );
    }
  }

  let unsubscribe = store.subscribe( handleChange );
  handleChange();
  return unsubscribe;
}

export default observeReduxStore;
