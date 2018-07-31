import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import "grommet/scss/vanilla/index.scss";
import GrommetApp from "grommet/components/App";
import Box from "grommet/components/Box";
import Toast from "grommet/components/Toast";
import { connect } from "react-redux";
import BoardPage from "./BoardPage";
import BoardListPage from "./BoardListPage";
import selectors from "../store/boards/boardCreation/selectors";
import { resetBoardCreationError } from "../store/boards/boardCreation/actions";
import "./App.scss";
import { statuses } from "../store/boards/boardCreation/reducer";

class App extends Component {
  render() {
    const { isUnableToCreateBoard } = this.props;

    return (
      <GrommetApp centered={false}>
        {isUnableToCreateBoard && (
          <Toast
            size="small"
            status="critical"
            onClose={this.props.resetBoardCreationError}
          >
            Unable to create board, something went wrong.
          </Toast>
        )}
        <Box full>
          <Box align="center" flex="grow">
            <Box pad={{ horizontal: "medium" }} size="xxlarge" flex="grow">
              <Switch>
                <Route exact path="/" component={BoardListPage} />
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
  isUnableToCreateBoard: selectors.getStatus(state) === statuses.ERROR
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ resetBoardCreationError }, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
