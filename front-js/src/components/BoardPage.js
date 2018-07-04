import React, { Component } from 'react'
import Board from "./Board";

class BoardPage extends Component {
  componentDidMount() {
    // TODO
  }

  render() {
    return <Board boardId={this.props.match.params.id}/>
  }
}

export default BoardPage
