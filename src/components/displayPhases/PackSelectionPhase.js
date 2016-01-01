import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'

export default class PackSelectionPhase extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const { gameState } = this.props

    return (
      <div>
        <div className="showGameCode">Game Code: <span>{gameState.gameCode}</span></div>
        <div className="choosingTime">
          <h3 className="title">{gameState.players[0].displayName } is selecting the question packs.</h3>
        </div>
      </div>
    );
  }
}