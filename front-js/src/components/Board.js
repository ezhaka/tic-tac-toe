import React, {Component} from 'react'
import {range} from 'lodash'
import BoardCell from './BoardCell'
import './Board.css'
import {get, find} from 'lodash'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {makeMove} from "../store/boards/actions";
import selectors from "../store/boards/selectors";

class Board extends Component {
  handleCellClick = (coordinates) => {
    this.props.makeMove(this.props.boardId, coordinates)
  }

  render() {
    const {occupiedCells} = this.props;

    return <table className="board">
      <tbody>
      {range(10).map(row => <tr key={row}>
        {range(10).map(column =>
          <BoardCell
            key={column}
            onClick={this.handleCellClick}
            coordinates={{row, column}}
            iconType={get(occupiedCells, [row, column, 'iconType'])}
          />)}
      </tr>)}
      </tbody>
    </table>
  }
}

const mapStateToProps = (state, {boardId}) => {
  const board = selectors.getBoardById(state, boardId);
  const occupiedCells = {}

  for (let move of board.moves) {
    let {row, column} = move.coordinates;
    if (!occupiedCells[row]) {
      occupiedCells[row] = {}
    }

    const player = find(board.players, p => p.user.id === move.userId);
    occupiedCells[row][column] = {iconType: player.iconType}
  }

  return {
    occupiedCells
  }
}

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({makeMove}, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Board)