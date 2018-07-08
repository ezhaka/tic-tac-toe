import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'
import configureStore from "./store/configureStore";
import { createBrowserHistory } from 'history'
import { AUTHENTICATE } from './store/authentication/actions'

const history = createBrowserHistory()
const store = configureStore(history)
store.dispatch({ type: AUTHENTICATE })

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
