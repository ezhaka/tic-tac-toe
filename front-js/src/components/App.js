import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import "grommet/scss/vanilla/index.scss";
import GrommetApp from "grommet/components/App";
import Box from "grommet/components/Box";
import BoardPage from "./BoardPage";
import BoardList from "./BoardList";

class App extends Component {
  render() {
    return (
      <GrommetApp centered={false}>
        <Box full>
          <Box align="center" flex="grow">
            <Box pad={{ horizontal: "medium" }} size="xlarge" flex="grow">
              <Switch>
                <Route exact path="/" component={BoardList} />
                <Route exact path="/boards/:id" component={BoardPage} />
              </Switch>
            </Box>
          </Box>
        </Box>
      </GrommetApp>
    );
  }
}

export default withRouter(App);
