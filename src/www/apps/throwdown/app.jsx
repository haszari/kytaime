
// styles
// require('./styles/app.scss');

import React from 'react';
import {render} from 'react-dom';

import { Provider } from 'react-redux'

import shortid from 'shortid';

import store from './stores/store';
// import * as actions from './stores/actions';

import Transport from './components/transport.jsx';

function App() {
   return (
      <Provider store={store}>
         {/* Provider likes to wrap a single element */}
         <div>
            <Transport />
         </div>
      </Provider>
   );
}

var appDiv = document.createElement('div');
document.body.appendChild(appDiv);

render(<App/>, appDiv);

