import React, {Component} from 'react'
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
import {Link} from "react-router-dom";
import CaretBackIcon from 'grommet/components/icons/base/CaretBack'
import FormPreviousIcon from 'grommet/components/icons/base/FormPrevious'
import PreviousIcon from 'grommet/components/icons/base/Previous'
import Anchor from 'grommet/components/Anchor'
import {push} from 'connected-react-router'

class BoardPage extends Component {
  handleBackAnchorClick = () => {
    this.props.push('/')
  }

  render() {
    const {boardId, isLoading, isActivePlayer} = this.props;

    // TODO: убрать
    if (isLoading) {
      return <span>Загрузочка...</span>
    }

    return <div>
      <Box pad={{vertical: 'small'}}>
        <Anchor
          icon={<PreviousIcon/>}
          label="Back"
          primary={false}
          onClick={this.handleBackAnchorClick}
        />
      </Box>
      <Split showOnResponsive={'both'} flex={'left'} separator={true}>
        <Box pad={'medium'}>
          <Board boardId={boardId}/>
          {isActivePlayer && <Label align="center">Your turn!</Label>}
        </Box>
        <Box pad={'medium'}>
          <PlayersList boardId={boardId}/>
        </Box>
      </Split>
    </div>
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

export default connect(mapStateToProps, {push})(BoardPage)
