import React, { Component } from "react";
import { connect } from "react-redux";
import Box from "grommet/components/Box";
import PreviousIcon from "grommet/components/icons/base/Previous";
import Anchor from "grommet/components/Anchor";
import Title from "grommet/components/Title";
import { push } from "connected-react-router";
import selectors from "../store/boards/selectors";
import PlayersList from "./PlayersList";
import Board from "./Board";
import StatusString from "./StatusString";
import Header from "./Header";

class BoardPage extends Component {
  render() {
    const { boardId, isLoading } = this.props;

    // TODO: убрать
    if (isLoading) {
      return <span>Загрузочка...</span>;
    }

    return (
      <div>
        <Header>
          <Anchor icon={<PreviousIcon />} path="/" primary={false} />
          <Title>{`Board #${boardId}`}</Title>
        </Header>
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
      </div>
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
