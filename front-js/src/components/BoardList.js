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
import selectors from "../store/boards/selectors";
import { createBoard, joinBoard } from "../store/boards/actions";

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

class BoardList extends Component {
  createBoard = () => {
    this.props.createBoard();
  };

  handleBoardClick = boardId => {
    this.props.push(`/boards/${boardId}`);
    this.props.joinBoard(boardId);
  };

  render() {
    return (
      <div>
        <Button label="Create board" onClick={this.createBoard} />
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
              {this.props.boards.map((board, index) => (
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
  boards: selectors.getAllBoards(state)
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ createBoard, push, joinBoard }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardList);
