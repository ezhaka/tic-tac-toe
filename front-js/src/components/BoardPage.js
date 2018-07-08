import React, { Component } from 'react'
import Board from "./Board";
import PlayersList from './PlayersList'
import {loadBoard} from "../store/boards/actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import selectors from "../store/boards/selectors";

class BoardPage extends Component {
  componentDidMount() {
    const { boardId, loadBoard } = this.props;
    loadBoard(boardId)
  }

  render() {
    const {boardId, isLoading} = this.props;

    // TODO: убрать
    if (isLoading) {
      return <span>Загрузочка...</span>
    }

    return <div>
      <Board boardId={boardId}/>
      <PlayersList boardId={boardId}/>
    </div>
  }
}


const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({loadBoard}, dispatch)
})

const mapStateToProps = (state, {match}) => {
  const boardId = match.params.id
  const board = selectors.getBoardById(state, boardId);

  return {
    boardId,
    isLoading: !board
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardPage)
