import React, { Component } from 'react'

function Icon({type}) {
  switch (type) {
    case 'UNICORN':
      return <span className="board-icon" role="img" aria-label="Unicorn">🦄</span>
    default:
      throw new Error(`Unkonwn icon type ${type}`)
  }
}

export default class BoardCell extends Component {
  handleClick = () => {
    this.props.onClick(this.props.coordinates)
  }

  render() {
    const {coordinates, iconType} = this.props

    return <td key={coordinates.column} onClick={this.handleClick}>
      {iconType && <Icon type={iconType}/>}
    </td>
  }
}