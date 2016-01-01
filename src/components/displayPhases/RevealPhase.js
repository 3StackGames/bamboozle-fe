import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'

export default class RevealPhase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAnswer: {},
      revealing: 0
    }

    this.believedLies = props.gameState.lies.filter(l => l.believers.length !== 0)
    this.timeout = 5000
    this.emittedDisplay = false
  }

  componentDidMount() {
    this.moveScreen = () => {
      return setTimeout(() => {
        this.setState({
          revealing: this.state.revealing + 1
        })
        this.moveScreen()
      }, this.timeout)
    }

    this.moveScreen()

    // this.moveScreen = setInterval(() => {
    //   this.setState({
    //     revealing: this.state.revealing + 1
    //   })
    // }, 2000)
  }

  componentWillUnmount() {
    clearTimeout(this.moveScreen)
  }

  render() {
    const { revealing } = this.state
    const { gameState, engine } = this.props
    const {
      lies,
      currentQuestion,
      gameCode,
      players
    } = gameState

    if (!this.emittedDisplay && revealing > this.believedLies.length + 1) {
      this.moveScreen = () => null
      engine.displayActionComplete({ gameCode })
      this.emittedDisplay = true
    }

    if (revealing > this.believedLies.length) {
      return (
        <div>
          <div className="showGameCode">Game Code: <span>{gameCode}</span></div>
          <DisplayScore players={players} lies={lies}/>
          <div className="small-text text-center">(Look at your gamepad screen!)</div>
        </div>
      )
    }

    if (revealing === this.believedLies.length) {
      this.timeout = 1000
    }

    return (
      <div>
        <div className="showGameCode">Game Code: <span>{gameCode}</span></div>
        <div className="revealingTime">
          <h3 className="title">{currentQuestion.question}</h3>
          <div className="choiceList row">{this.showAnswer}</div>
        </div>
      </div>
    )
  }

  get showAnswer() {
    const { revealing } = this.state
    const { gameState } = this.props
    const {
      lies,
      currentQuestion,
      gameCode,
      players
    } = gameState


    if (revealing < this.believedLies.length) {
      return this.revealLie(this.believedLies[revealing])
    }
    return this.revealRealAnswer(currentQuestion)
  }

  revealRealAnswer(currentQuestion) {
    let scrubs = currentQuestion.believers.map((player, key) => {
      return (
        <div key={ key } className={"scrub player_" + this.playerId(player)} style={this.angle()}>
          { player }
        </div>
      );
    });

    return (
      <div className="col-xs-12">
        <div className="singleChoice answer">
          <div className="showAuthor">
            Correct Answer:
          </div>
          { currentQuestion.answer }
        </div>
        <div className="showScrubs">{ scrubs }</div>
      </div>
    );
  }

  revealLie(lie) {
    let scrubs = lie.believers.map((player, key) => {
      return (
        <div key={ key } className={"scrub player_" + this.playerId(player)} style={ this.angle() }>
          { player }
        </div>
      );
    });

    return (
      <div className="col-xs-12">
        <div className={"singleChoice player_" + this.playerId(lie.liar)}>
          { lie.lie }
          <div className="showAuthor">
            By: { lie.liar }
          </div>
        </div>
        <div className="showScrubs">
          { scrubs }
        </div>
      </div>
    );
  }

  angle() {
    let randomAngle = Math.floor((Math.random() * 14) - 7);
    return {
      transform: 'rotate('+ randomAngle +'deg)'
    }
  }

  playerId(playerName) {
    let players = this.props.gameState.players;

    for(let i = 0; i < players.length; i++) {
      if(players[i].displayName === playerName) return i + 1
    }
    return 0
  }

  revealTimer() {
    console.log('revealTimer called')
    setTimeout(() => {
      const incReveal = this.state.revealing + 1
      console.log('set timeout triggered')
      this.setState({
        revealing: incReveal
      })
    }, 2000)
  }
}

const DisplayScore = ({ players, lies }) => {
  const sortedPlayers = [...players].sort((a, b) =>
    a.score < b.score ? 1 : 0
  )

  const playerId = (playerName) => {
    for (let i = 0; i < players.length; i++) {
      if (players[i].displayName === playerName) return i + 1
    }
    return 0
  }

  const playerLie = (playerName) => {
    for (let i = 0; i < lies.length; i++) {
      if (lies[i].liar === playerName) return lies[i].lie
    }
    return 0
  }

  const playerList = sortedPlayers.map(player => {
    return (
      <div key={player.displayName} className="playerBoardItemContainer">
        <div className={"playerBoardItem player_" + playerId(player.displayName)}>
          <div className="playerAnswer"><p>{playerLie(player.displayName)}</p></div>
          <div className="playerName">{player.displayName}</div>
          <div className="totalPoints">{player.score}</div>
        </div>
      </div>
    )
  })

  return <div className="scoreBoard">{playerList}</div>
}
