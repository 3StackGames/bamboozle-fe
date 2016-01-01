import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'

export default class EndPhase extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    localStorage.removeItem('gamepad.user');
    localStorage.removeItem('gamepad.timestamp');
  }

  render() {
    const { gameState, currentPlayer } = this.props

    if(gameState.players[0].displayName === currentPlayer.displayName) {
      return (
        <div>
          <div className="small-header">GameOver</div>
          <button onClick={this.restartGame} className="btn btn-danger">Restart Game</button>
        </div>
      )
    }

    return (
      <div>
        <div className="small-header">GameOver</div>
      </div>
    )
  }

  @autobind
  keepPlaying() {
    const { gameState, engine, currentPlayer } = this.props

    engine.gamepadInput({
      gameCode: gameState.gameCode,
      player: currentPlayer.displayName,
      moveOn: true
    })
  }

  @autobind
  restartGame() {
    const { gameState, engine, currentPlayer } = this.props

    engine.gamepadInput({
      gameCode: gameState.gameCode,
      player: currentPlayer.displayName,
      restart: true
    })
  }
}