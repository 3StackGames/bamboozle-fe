import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'

export default class EndPhase extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    localStorage.removeItem('display.gameCode')
    localStorage.removeItem('display.timestamp')
  }
  render() {
    const { gameState } = this.props
    const { gameCode, players } = gameState

    return (
      <div>
        <div className="showGameCode">Game Code: <span>{gameCode}</span></div>
        <h3 className="title">Game Over!</h3>
        <DisplayScore players={players} />
        <div className="text-center">
          <div className="small-text">Keep Playing?</div>
          <div className="small-text">(Look at your gamepad screen!)</div>
        </div>
      </div>
    );
  }
}

const DisplayScore = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) =>
    a.score < b.score ? 1 : 0
  )

  const playerId = (playerName) => {
    for (let i = 0; i < players.length; i++) {
      if (players[i].displayName === playerName) return i + 1
    }
    return 0
  }

  const playerNodes = sortedPlayers.map(player => (
    <div key={player.displayName} className={"playerBoardItem player_" + playerId(player.displayName)}>
      <div className="playerName">{ player.displayName }</div>
      <div className="totalPoints">{ player.score }</div>
      <div className="clear"></div>
    </div>
  ))

  return (
    <div className="scoreBoard">
      {playerNodes}
    </div>
  )
}