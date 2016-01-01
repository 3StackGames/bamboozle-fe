import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'

export default class RevealPhase extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { gameState, currentPlayer } = this.props
    const { displayComplete, players } = gameState

    if(displayComplete && players[0].displayName === currentPlayer.displayName) {
      return <button onClick={this.keepPlaying} className="btn">Move On</button>;
    }

    return <div className="small-header">Look at the display!</div>;
  }

  @autobind
  keepPlaying(e) {
    const { gameState, currentPlayer, engine } = this.props

    e.target.disabled = true

    engine.gamepadInput({
      gameCode: gameState.gameCode,
      player: currentPlayer.displayName,
      moveOn: true
    })
  }
}