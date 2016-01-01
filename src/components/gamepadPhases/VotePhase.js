import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'
import { knuthShuffle as shuffle } from 'knuth-shuffle'
import R from 'ramda'

export default class VotePhase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAnswer: false
    }

    this.shuffler = shuffle(R.range(0, props.gameState.lies.length))
  }

  render() {
    return (
      <div className="choiceList">{this.displayChoices}</div>
    )
  }

  get displayChoices() {
    if (this.state.selectedAnswer) {
      return (
        <div className="notice">Waiting for other players...</div>
      )
    }

    const { gameState, currentPlayer } = this.props
    const { lies, currentQuestion } = gameState

    const otherLies = lies.filter(l => l.liar !== currentPlayer.displayName)
    const choices = [currentQuestion.answer, ...otherLies.map(l => l.lie)]
    return this.shuffler
      .map(i => choices[i])
      .map(answer => (
      <ChoiceButton
        key={answer}
        onChoose={this.selectAnswer}
        answer={answer}
        disabled={this.state.selectedAnswer} />
    ))
  }

  @autobind
  selectAnswer(answer) {
    const { gameState, engine, currentPlayer } = this.props
    this.setState({
      selectedAnswer: true
    })
    engine.gamepadInput({
      answer,
      player: currentPlayer.displayName,
      gameCode: gameState.gameCode
    })
  }
}

const ChoiceButton = ({ onChoose, answer }) => (
  <button
    onClick={() => onChoose(answer)}
    className="btn choiceItems">
    {answer.toUpperCase()}
  </button>
)