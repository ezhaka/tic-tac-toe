import React, { Component } from "react";
import Button from "grommet/components/Button";
import Section from "grommet/components/Section";
import Value from "grommet/components/Value";
import Timestamp from "grommet/components/Timestamp";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { last, get } from "lodash";
import Table from "grommet/components/Table";
import TableRow from "grommet/components/TableRow";
import Title from "grommet/components/Title";
import selectors from "../store/boards/selectors";
import { createBoard } from "../store/boards/boardCreation/actions";
import Header from "./Header";
import { statuses } from "../store/boards/boardCreation/reducer";
import boardCreationSelectors from "../store/boards/boardCreation/selectors";

class BoardListItem extends Component {
  handleClick = () => {
    this.props.onClick(this.props.board.id);
  };

  render() {
    const { board } = this.props;

    return (
      <TableRow onClick={this.handleClick}>
        <td>{board.id}</td>
        <td className="secondary">
          <Value size="small" value={board.players.length} units="/&nbsp;10" />
        </td>
        <td className="secondary">
          <Timestamp
            value={get(last(board.moves), "date") || board.createdDate}
          />
        </td>
      </TableRow>
    );
  }
}

class BoardListPage extends Component {
  createBoard = () => {
    this.props.createBoard();
  };

  handleBoardClick = boardId => {
    this.props.push(`/boards/${boardId}`);
  };

  render() {
    const { isCreationInProgress, boards } = this.props;

    return (
      <div>
        <Header>
          <Title>tic-tac-toe</Title>
        </Header>
        <Button
          label="Create board"
          onClick={isCreationInProgress ? undefined : this.createBoard}
        />
        <Section>
          <Table selectable>
            <thead>
              <tr>
                <th>#</th>
                <th>Players</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {boards.map((board, index) => (
                <BoardListItem
                  key={board.id}
                  board={board}
                  isFirst={index === 0}
                  onClick={this.handleBoardClick}
                />
              ))}
            </tbody>
          </Table>
        </Section>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  boards: selectors.getActiveBoards(state),
  isCreationInProgress:
    boardCreationSelectors.getStatus(state) === statuses.IN_PROGRESS
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ createBoard, push }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardListPage);
