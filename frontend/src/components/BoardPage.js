import React, { Component } from "react";
import { connect } from "react-redux";
import Box from "grommet/components/Box";
import PreviousIcon from "grommet/components/icons/base/Previous";
import Spinning from "grommet/components/icons/Spinning";
import Anchor from "grommet/components/Anchor";
import Title from "grommet/components/Title";
import Heading from "grommet/components/Heading";
import Paragraph from "grommet/components/Paragraph";
import { push } from "connected-react-router";
import selectors from "../store/boards/selectors";
import PlayersList from "./PlayersList";
import Board from "./Board";
import StatusString from "./StatusString";
import Header from "./Header";
import "./BoardPage.scss";
import boardPageSelectors from "../store/boards/boardPage/selectors";
import statuses from "../store/boards/status";

class BoardPage extends Component {
  renderContent() {
    const { boardId, isLoading, status } = this.props;

    if (status === statuses.ERROR_404) {
      return (
        <Box margin={{ vertical: "large" }}>
          <Heading>404</Heading>
          <Paragraph size="large">The board does not exist.</Paragraph>
        </Box>
      );
    }

    if (status === statuses.ERROR) {
      return (
        <Box margin={{ vertical: "large" }}>
          <Heading>:(</Heading>
          <Paragraph size="large">
            Oops... something went wrong. You can try to reload the page.
          </Paragraph>
        </Box>
      );
    }

    if (isLoading) {
      return (
        <Box align="center" justify="center" flex="grow">
          <Spinning size="large" />
        </Box>
      );
    }

    return (
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
    );
  }

  render() {
    const { boardId } = this.props;

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
        {this.renderContent()}
      </Box>
    );
  }
}

const mapStateToProps = (state, { match }) => {
  const boardId = match.params.id;
  const board = selectors.getBoardById(state, boardId);

  return {
    boardId,
    isLoading: !board,
    status: boardPageSelectors.getStatus(state)
  };
};

export default connect(
  mapStateToProps,
  { push }
)(BoardPage);
