import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'

export default class LiePhase extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timer: 40
    }

    this.stopInstructionTimeout = false

    this.startInstructionTimeout = () => {
      this.instructionTimeout = setTimeout(() => {
        if(!this.stopInstructionTimeout) {
          this.onInstructionComplete
        }
      }, 15000)
    }

    this.countDownInterval = false

    this.startCountDown = () => {
      this.countDownInterval = setInterval(this.countDown, 1000)
    }
  }

  componentDidMount() {
    const { gameState, engine } = this.props
    const { gameCode } = gameState

    if (!gameState.displayComplete && !gameState.firstGame) {
      engine.displayActionComplete({
        gameCode
      })
    }

    localStorage.setItem('display.gameCode', gameCode);
    localStorage.setItem('display.timestamp', +new Date);
  }

  componentWillUnmount() {
    if(this.countDownInterval !== false) {
      clearInterval(this.countDownInterval)
    }
  }

  render() {
    const { gameState } = this.props
    const { timer } = this.state

    const percent = timer / 40 * 100
    let displayCountDown

    if(this.countDownInterval !== false) {
      displayCountDown = (
        <div className="gameTimer"><div className={cx({
          countDown: true,
          'countDown--yellow': percent <= 60 && percent > 30,
          'countDown--red': percent <= 30
        })} style={{ width: `${percent}%` }}></div></div>
      );
    }

    return (
      <div>
        <div className="showGameCode">Game Code: <span>{ gameState.gameCode }</span></div>
        {displayCountDown}
        {this.displayQuestion}
      </div>
    )
  }

  @autobind
  onInstructionComplete() {
    if(this.props.gameState.lies.length > 0) {
      return
    }

    this.props.engine.displayActionComplete({
      gameCode: this.props.gameState.gameCode
    })
  }

  @autobind
  countDown() {
    const timer = this.state.timer
    if(timer <= 0) {
      clearInterval(this.countDownInterval)
      this.props.engine.displayActionComplete({
        gameCode: this.props.gameState.gameCode
      })
      return
    }
    
    this.setState({timer: timer - 1})
  }

  get displayQuestion() {
    const { gameState, musicActs } = this.props
    const {
      firstGame,
      displayComplete,
      questionCount,
      players,
      lies,
      currentQuestion,
      currentInstruction: instruction,
    } = gameState


    if (questionCount === 1 && firstGame  && !displayComplete) {
      this.startInstructionTimeout()
      return (
        <div>
          <Instructions
            bonusValue={instruction.trickBonusPointValue}
            correctValue={instruction.correctAnswerPointValue} />
          {this.skipButton}
          <audio src="./assets/sounds/OnIn-1_edit.mp3" autoPlay onPlay={musicActs.lowerVolume} onEnded={musicActs.raiseVolume}></audio>
        </div>
      )
    }

    if(gameState.players.length - gameState.lies.length <= 2 && this.countDownInterval == false) {
      this.startCountDown()
    }

    return (
      <div>
        <div className="lyingTime">
          <h3 className="title">{currentQuestion.question}</h3>
          <WaitingPlayerLies players={players} lies={lies}/>
        </div>
        <audio src={`./assets/sounds/ss-${currentQuestion.id}_edit.mp3`} autoPlay onPlay={musicActs.lowerVolume} onEnded={musicActs.raiseVolume}></audio>
      </div>
    )

  }

  get skipButton() {
    return (
      <button className="btn" onClick={this.skipInstruction}>Skip</button>
    )
  }

  @autobind
  skipInstruction(e) {
    e.target.disabled = true
    this.stopInstructionTimeout = true

    this.props.engine.displayActionComplete({
      gameCode: this.props.gameState.gameCode
    })
  }
}

const WaitingPlayerLies = ({ players, lies }) => {
  let finishedUsers = 0
  const listPlayers = players.map(player => {
    const submittedLie = lies.find(lie => {
      return lie.liar === player.displayName
    })

    if (submittedLie) {
      finishedUsers++
    }

    return (
      <div key={player.displayName} className={cx({
        active: submittedLie
      })}>
        <div className="playerLobbyItem"></div>
      </div>
    )
  })

  const finishElement = (finishedUsers === players.length)
    ? <div className="finished">All lies have been entered!</div>
    : ''

  return (
    <div className="relative">
      {finishElement}
      <div className="WaitingPlayerLies playerColor">
        {listPlayers}
      </div>
    </div>
  )
}

const Instructions = ({ bonusValue, correctValue }) => (
  <div>
    <div className="text-center to-fool">{bonusValue} for everyone you fool</div>
    <div className="text-center for-truth">{correctValue} for finding the truth</div>
  </div>
)
