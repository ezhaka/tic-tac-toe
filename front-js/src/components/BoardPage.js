import React, { Component } from 'react'
import Board from "./Board";
import PlayersList from './PlayersList'
import {loadBoard} from "../store/boards/actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import selectors from "../store/boards/selectors";
import Label from 'grommet/components/Label'
import Section from 'grommet/components/Section'
import Columns from 'grommet/components/Columns'
import Split from 'grommet/components/Split'
import Box from 'grommet/components/Box'

class BoardPage extends Component {
  render() {
    const {boardId, isLoading, isActivePlayer} = this.props;

    // TODO: убрать
    if (isLoading) {
      return <span>Загрузочка...</span>
    }

    return <Split showOnResponsive={'both'} flex={'left'} separator={true}>
      <Box pad={'medium'}>
        <Board boardId={boardId}/>
        {isActivePlayer && <Label align="center">Your turn!</Label>}
      </Box>
      <Box pad={'medium'}>
        <PlayersList boardId={boardId}/>
      </Box>
    </Split>
  }
}

const mapStateToProps = (state, {match}) => {
  const boardId = match.params.id
  
  console.log(selectors)
  const board = selectors.getBoardById(state, boardId);

  return {
    boardId,
    isLoading: !board,
    isActivePlayer: selectors.isActivePlayer(state, boardId)
  }
}

export default connect(mapStateToProps)(BoardPage)
