
// styles
// require('./styles/app.scss');

import React from 'react';
import {render} from 'react-dom';

import { Provider } from 'react-redux'

import shortid from 'shortid';

import store from './stores/store';
// import * as actions from './stores/actions';

import Transport from './components/transport/component.jsx';
import ThrowdownList from  './components/throwdown/component.jsx';

function App() {
   return (
      <Provider store={store}>
         {/* Provider likes to wrap a single element */}
         <div>
            <Transport />
            <ThrowdownList />
         </div>
      </Provider>
   );
}

var appDiv = document.createElement('div');
document.body.appendChild(appDiv);

render(<App/>, appDiv);


import throwdownCoreApp from './throwdown-app';


// test / bootstrap actions
import * as throwdownActions from './components/throwdown/actions';

store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'mary' }));
store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'steve' }));
store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'helen' }));
store.dispatch(throwdownActions.throwdown_addSnip({ slug: 'pete' }));

