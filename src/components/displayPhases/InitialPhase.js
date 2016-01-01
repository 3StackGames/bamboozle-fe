import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import { DisplayLobby } from '../../components'

export default class InitialPhase extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    const gameCode = localStorage.getItem('display.gameCode')
    const timestamp = parseInt(localStorage.getItem('display.timestamp'), 10)
    const difference = (+new Date - timestamp) / (1000 * 60 * 60)

    if(gameCode !== null && gameCode.length == 4 && difference <= 3)
    {
      if(confirm('Found Game Code: ' + gameCode + '\nWould you like to continue?'))
      {
        this.props.engine.displayJoin(gameCode)
        return
      } else {
        localStorage.removeItem('display.gameCode')
        localStorage.removeItem('display.timestamp')
      }
    }

    this.props.engine.displayJoin()
  }

  render() {
    const { players = [], gameCode } = this.props.gameState
    return (
      <div>
        <div className="small-header">Waiting for players ({players.length}/8)...</div>
        <div className="joinNotice">
          <div className="title">
            The game code is : <div className="gamecode">{gameCode}</div>
          </div>

          <div className="content">
            <p>Join on your phone or tablet at <span className="everybody">{'http://Bamboozle.io'}</span></p>
            <p>Press <span className="everybody">EVERYBODY IS IN</span> to start the game.</p>
          </div>
          <DisplayLobby players={players} />
        </div>
      </div>
    )
  }
}
