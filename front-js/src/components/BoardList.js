import React, {Component} from 'react'
import Button from 'grommet/components/Button'
import List from 'grommet/components/List'
import ListItem from 'grommet/components/ListItem'
import Section from 'grommet/components/Section'
import Value from 'grommet/components/Value'
import Timestamp from 'grommet/components/Timestamp'
import GroupIcon from 'grommet/components/icons/base/Group'
import {createBoard, joinBoard, loadBoardList} from "../store/boards/actions";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {push} from 'connected-react-router'
import selectors from "../store/boards/selectors";
import {last, get} from 'lodash'
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';


class BoardListItem extends Component {
  handleClick = () => {
    this.props.onClick(this.props.board.id)
  }

  render() {
    const {board, isFirst} = this.props

    return <TableRow onClick={this.handleClick}>
      <td>
        {board.id}
      </td>
      <td className="secondary">
        <Value
          size="small"
          value={board.players.length}
          icon={<GroupIcon size="small"/>}
          units='/&nbsp;10'
        />
      </td>
      <td className="secondary">
        <Timestamp value={get(last(board.moves), 'date') || board.createdDate} />
      </td>
    </TableRow>
  }
}

class BoardList extends Component {
  createBoard = () => {
    this.props.createBoard()
  }

  handleBoardClick = (boardId) => {
    this.props.push(`/boards/${boardId}`)
    this.props.joinBoard(boardId)
  }

  render() {
    return <div>
      <Button label="Create board" onClick={this.createBoard}/>
      <Section>
        <Table selectable={true}>
          <thead>
          <tr>
            <th>Id</th>
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
  }
}

const mapStateToProps = (state, ownProps) => ({
  boards: selectors.getAllBoards(state)
})

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({createBoard, push, joinBoard}, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BoardList)