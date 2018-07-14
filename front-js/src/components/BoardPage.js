import React, { Component } from "react";
import { connect } from "react-redux";
import Split from "grommet/components/Split";
import Box from "grommet/components/Box";
import PreviousIcon from "grommet/components/icons/base/Previous";
import Anchor from "grommet/components/Anchor";
import { push } from "connected-react-router";
import selectors from "../store/boards/selectors";
import PlayersList from "./PlayersList";
import Board from "./Board";
import StatusString from "./StatusString";

class BoardPage extends Component {
  handleBackAnchorClick = () => {
    this.props.push("/");
  };

  render() {
    const { boardId, isLoading } = this.props;

    // TODO: убрать
    if (isLoading) {
      return <span>Загрузочка...</span>;
    }

    return (
      <div>
        <Box pad={{ vertical: "small" }}>
          <Anchor
            icon={<PreviousIcon />}
            label="Back"
            primary={false}
            onClick={this.handleBackAnchorClick}
          />
        </Box>
        <Split showOnResponsive="both" flex="left" separator>
          <Box pad="medium">
            <Board boardId={boardId} />
            <StatusString boardId={boardId} />
          </Box>
          <Box pad="medium">
            <PlayersList boardId={boardId} />
          </Box>
        </Split>
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
