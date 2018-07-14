import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import "./App.css";
import "grommet/scss/vanilla/index.scss";
import Title from "grommet/components/Title";
import GrommetApp from "grommet/components/App";
import Header from "grommet/components/Header";
import Status from "grommet/components/icons/Status";
import Box from "grommet/components/Box";
import { connect } from "react-redux";
import { get } from "lodash";
import BoardPage from "./BoardPage";
import authSelectors from "../store/authentication/selectors";
import BoardList from "./BoardList";
import webSocketsSelectors from "../store/webSockets/selectors";

class App extends Component {
  render() {
    let statusValue;
    switch (this.props.connectionState) {
      case "CLOSED":
        statusValue = "critical";
        break;
      case "OPENED":
        statusValue = "ok";
        break;
      default:
        statusValue = "unknown";
    }

    return (
      <GrommetApp>
        <Box pad={{ horizontal: "medium" }}>
          <Header>
            <Title>Tic-tac-toe</Title>
            <Box direction="row" justify="end" flex responsive={false}>
              <Status value={statusValue} size="small" />&nbsp;
              <span className="secondary">
                {get(this.props.currentUser, "name")}
              </span>
            </Box>
          </Header>
          <Switch>
            <Route exact path="/" component={BoardList} />
            <Route exact path="/boards/:id" component={BoardPage} />
          </Switch>
        </Box>
      </GrommetApp>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: authSelectors.getCurrentUser(state),
  connectionState: webSocketsSelectors.getConnectionState(state)
});

export default withRouter(connect(mapStateToProps)(App));
