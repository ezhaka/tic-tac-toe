import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import "./App.css";
import "grommet/scss/vanilla/index.scss";
import GrommetApp from "grommet/components/App";
import Box from "grommet/components/Box";
import BoardPage from "./BoardPage";
import BoardList from "./BoardList";

class App extends Component {
  render() {
    return (
      <GrommetApp>
        <Box align="center">
          <Box size="xlarge" pad={{ horizontal: "medium" }}>
            <Switch>
              <Route exact path="/" component={BoardList} />
              <Route exact path="/boards/:id" component={BoardPage} />
            </Switch>
          </Box>
        </Box>
      </GrommetApp>
    );
  }
}

export default withRouter(App);
