import React from 'react'
import {connect} from "react-redux";
import selectors from "../store/boards/selectors";
import Label from 'grommet/components/Label'

const StatusString = ({wonPlayer, isWinner, isActivePlayer}) => {
  let status = null

  if (wonPlayer) {
    // TODO: remove JSON.stringify
    status = isWinner ? 'Congrats! You are the winner' : `Sorry, ${JSON.stringify(wonPlayer)} won`
  } else {
    status = isActivePlayer ? 'Your turn!' : 'Waiting for other players to make a move'
  }

  return <Label align="center">{status}</Label>
}


const mapStateToProps = (state, {boardId}) => {
  return {
    isActivePlayer: selectors.isActivePlayer(state, boardId),
    isWinner: selectors.isWinner(state, boardId),
    wonPlayer: selectors.getWonPlayer(state, boardId)
  }
}

export default connect(mapStateToProps)(StatusString)
