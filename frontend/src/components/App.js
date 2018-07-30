import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import "grommet/scss/vanilla/index.scss";
import GrommetApp from "grommet/components/App";
import Box from "grommet/components/Box";
import Toast from "grommet/components/Toast";
import { connect } from "react-redux";
import BoardPage from "./BoardPage";
import BoardList from "./BoardList";
import selectors from "../store/boards/errors/selectors";
import { setUnableToCreateBoard } from "../store/boards/errors/actions";
import "./App.scss";

class App extends Component {
  render() {
    const { isUnableToCreateBoard, dispatchUnableToCreateBoard } = this.props;

    return (
      <GrommetApp centered={false}>
        {isUnableToCreateBoard && (
          <Toast
            size="small"
            status="critical"
            onClose={dispatchUnableToCreateBoard}
          >
            Unable to create board, something went wrong.
          </Toast>
        )}
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

const mapStateToProps = state => ({
  isUnableToCreateBoard: selectors.isUnableToCreateBoard(state)
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    { dispatchUnableToCreateBoard: setUnableToCreateBoard },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
