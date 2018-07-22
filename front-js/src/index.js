import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import configureStore from "./store/configureStore";
import { INITIALIZE } from "./store/webSockets/actions";

const history = createBrowserHistory();
const store = configureStore(history);
store.dispatch({ type: INITIALIZE });

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
