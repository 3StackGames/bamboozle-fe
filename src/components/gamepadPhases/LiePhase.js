import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'

export default class LiePhase extends Component {
  constructor(props) {
    super(props)

    this.state = {
      lie: '',
      alert: null
    }
  }

  componentDidMount() {
    const { gameState, currentPlayer } = this.props

    const gameCode = gameState.gameCode
    const displayName = currentPlayer.displayName

    if (gameCode && displayName) {
      localStorage.setItem('gamepad.user', JSON.stringify({ displayName, gameCode }))
      localStorage.setItem('gamepad.timestamp', +new Date)
    }

    this.props.engine.socket.on('Error', ({ gameCode, player, code, message }) => {
      this.setState({
        alert: "You picked either someone else's lie or the truth! Please enter something else."
      })
    })
  }

  render() {
    const { gameState } = this.props
    const { currentQuestion } = gameState

    if (this.isLieSubmitted) {
      return (
        <AfterSendNotice />
      )
    }

    if (gameState.displayComplete) {
      return (
        <div className="questionTime">
          <div className="title">{currentQuestion.question}</div>
          <form>
            <Alert alert={this.state.alert} />
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Lie!"
                onChange={this.handleLieInput} />
            </div>
            <div className="form-group">
              <button
                className="btn"
                onClick={this.submitLie}>
                Enter Lie
              </button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <DisplayNotice />
    )
  }

  @autobind
  handleLieInput(e) {
    this.setState({
      lie: e.target.value
    })
  }

  get isLieSubmitted() {
    const { gameState, currentPlayer } = this.props
    const { lies } = gameState

    return Boolean(lies.find(lie => lie.liar === currentPlayer.displayName))
  }

  @autobind
  submitLie(e) {
    const { gameState, engine, currentPlayer } = this.props
    const { currentQuestion, lies: otherLies } = gameState
    const { lie } = this.state

    e.preventDefault()
    e.target.disabled = true

    let msg = null
    const answer = currentQuestion.answer

    const clean = (input) => input.toLowerCase().replace(/\s/g, '')
    const cleanLie = clean(lie)
    const cleanAnswer = clean(answer)
    const lieExists = Boolean(otherLies
      .map(other => clean(other.lie))
      .find(otherLie => otherLie === cleanLie))

    if (lie.length === 0) {
      msg = "Enter a lie!"
    }
    else if (clean(lie) === clean(answer) || lieExists) {
      msg = "You picked either someone else's lie or the truth! Please enter something else."
    }


    this.setState({
      alert: msg
    })

    if (msg) {
      e.target.disabled = false
      return
    }
    engine.gamepadInput({
      lie,
      player: currentPlayer.displayName,
      gameCode: gameState.gameCode
    })
  }
}

const DisplayNotice = () => (
  <div>
    <div className="small-header">Look at the display!</div>
  </div>
)

const AfterSendNotice = () => (
  <div className="notice">
    Waiting for other players...
  </div>
)

const Alert = ({ alert }) => (
  <div className="notice-red">{alert}</div>
)
