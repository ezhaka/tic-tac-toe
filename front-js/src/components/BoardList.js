import React, {Component} from 'react'
import Button from 'grommet/components/Button'
import List from 'grommet/components/List'
import ListItem from 'grommet/components/ListItem'
import Section from 'grommet/components/Section'
import {createBoard, loadBoardList} from "../store/boards/actions";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { push } from 'connected-react-router'
import selectors from "../store/boards/selectors";

class BoardListItem extends Component {
  handleClick = () => {
    this.props.onClick(this.props.board.id)
  }

  render() {
    const { board, isFirst } = this.props

    return <ListItem
      key={board.id}
      justify={'between'}
      separator={isFirst ? 'horizontal' : undefined}
      onClick={this.handleClick}
    >
      <span>
        {board.id}
      </span>
      {/*<span className="secondary">*/}
        {/*happy*/}
      {/*</span>*/}
    </ListItem>
  }
}

class BoardList extends Component {
  componentDidMount() {
    this.props.loadBoardList()
  }

  createBoard = () => {
    this.props.createBoard()
  }

  handleBoardClick = (boardId) => {
    this.props.push(`/boards/${boardId}`)
  }

  render() {
    return <div>
      <Button label="Create board" onClick={this.createBoard}/>
      <Section>
        <List>
          {this.props.boards.map((board, index) => (
            <BoardListItem board={board} isFirst={index === 0} onClick={this.handleBoardClick}/>
          ))}
        </List>
      </Section>
    </div>
  }
}

const mapStateToProps = (state, ownProps) => ({
  boards: selectors.getAllBoards(state)
})

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({loadBoardList, createBoard, push}, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BoardList)