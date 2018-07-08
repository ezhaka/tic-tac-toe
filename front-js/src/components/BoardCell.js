import React, { Component } from 'react'
import Emoji from './Emoji'

export default class BoardCell extends Component {
  handleClick = () => {
    this.props.onClick(this.props.coordinates)
  }

  render() {
    const {coordinates, iconType} = this.props

    return <td key={coordinates.column} onClick={this.handleClick}>
      <span className="board-icon">
        {iconType && <Emoji type={iconType}/>}
      </span>
    </td>
  }
}