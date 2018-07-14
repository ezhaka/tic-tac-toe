import React, { Component } from "react";
import { range, zip, get, find, times } from "lodash";
import "./Board.css";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import BoardCell, { ACTIVE_CELL, LOSER_CELL, WINNER_CELL } from "./BoardCell";
import { makeMove } from "../store/boards/actions";
import selectors from "../store/boards/selectors";

class Board extends Component {
  handleCellClick = coordinates => {
    this.props.makeMove(this.props.boardId, coordinates);
  };

  render() {
    const { occupiedCells, winnerCells } = this.props;

    function getCellState(row, column) {
      if (!winnerCells) {
        return ACTIVE_CELL;
      }

      return get(winnerCells, [row, column]) ? WINNER_CELL : LOSER_CELL;
    }

    return (
      <table className="board">
        <tbody>
          {range(10).map(row => (
            <tr key={row}>
              {range(10).map(column => (
                <BoardCell
                  key={column}
                  onClick={this.handleCellClick}
                  coordinates={{ row, column }}
                  iconType={get(occupiedCells, [row, column, "iconType"])}
                  cellState={getCellState(row, column)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

/* eslint-disable no-param-reassign */
function setCellValue(object, row, column, value) {
  if (!object[row]) {
    object[row] = {};
  }
  object[row][column] = value;
}
/* eslint-enable no-param-reassign */

const mapStateToProps = (state, { boardId }) => {
  const board = selectors.getBoardById(state, boardId);
  const occupiedCells = {};
  let winnerCells = null;

  for (const move of board.moves) {
    const { row, column } = move.coordinates;

    const player = find(board.players, p => p.user.id === move.userId);

    const value = { iconType: player.iconType };
    setCellValue(occupiedCells, row, column, value);
  }

  if (board.winner) {
    winnerCells = {};
    for (const { to, from } of board.winner.ranges) {
      const rangeSize =
        Math.max(
          Math.abs(to.row - from.row),
          Math.abs(to.column - from.column)
        ) + 1;

      const maybeMultiply = values =>
        values.length === 1 ? times(rangeSize, () => values[0]) : values;

      const rowRange = range(from.row, to.row + 1);
      const columnRange = range(from.column, to.column + 1);
      const coordinates = zip(
        maybeMultiply(rowRange),
        maybeMultiply(columnRange)
      );

      coordinates.forEach(([row, column]) =>
        setCellValue(winnerCells, row, column, true)
      );
    }
  }

  return {
    occupiedCells,
    winnerCells
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ makeMove }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
