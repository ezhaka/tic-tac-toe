import React, { Component } from "react";
import { connect } from "react-redux";
import Box from "grommet/components/Box";
import PreviousIcon from "grommet/components/icons/base/Previous";
import Spinning from "grommet/components/icons/Spinning";
import Anchor from "grommet/components/Anchor";
import Title from "grommet/components/Title";
import { push } from "connected-react-router";
import selectors from "../store/boards/selectors";
import PlayersList from "./PlayersList";
import Board from "./Board";
import StatusString from "./StatusString";
import Header from "./Header";
import "./BoardPage.scss";

class BoardPage extends Component {
  render() {
    const { boardId, isLoading } = this.props;

    return (
      <Box className="board-page" flex="grow">
        <Header>
          <Anchor
            className="back-anchor"
            icon={<PreviousIcon />}
            path="/"
            primary={false}
          />
          <Title>{`board #${boardId}`}</Title>
        </Header>
        {isLoading ? (
          <Box align="center" justify="center" flex="grow">
            <Spinning size="large" />
          </Box>
        ) : (
          <Box direction="row" pad={{ vertical: "medium" }}>
            <Box pad={{ horizontal: "medium", vertical: "small" }} basis="2/3">
              <Board boardId={boardId} />
              <StatusString boardId={boardId} />
            </Box>
            <Box
              pad={{ horizontal: "small", vertical: "small" }}
              basis="1/3"
              colorIndex="light-2"
            >
              <PlayersList boardId={boardId} />
            </Box>
          </Box>
        )}
      </Box>
    );
  }
}

const mapStateToProps = (state, { match }) => {
  const boardId = match.params.id;
  const board = selectors.getBoardById(state, boardId);

  return {
    boardId,
    isLoading: !board
  };
};

export default connect(
  mapStateToProps,
  { push }
)(BoardPage);
