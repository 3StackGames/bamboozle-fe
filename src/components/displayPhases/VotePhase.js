import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'
import { knuthShuffle as shuffle } from 'knuth-shuffle'
import R from 'ramda'

export default class VotePhase extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.shuffler = shuffle(R.range(0, props.gameState.lies.length + 1))
  }

  render() {
    const { gameState } = this.props

    return (
      <div>
        <div className="showGameCode">Game Code: <span>{gameState.gameCode}</span></div>
        <div className="choosingTime">
          <h3 className="title">{gameState.currentQuestion.question}</h3>
          <WaitingPlayerChoosing
            players={gameState.players}
            question={gameState.currentQuestion}
            lies={gameState.lies}
            shuffler={this.shuffler} />
        </div>
      </div>
    )
  }
}

const WaitingPlayerChoosing = ({ players, question, lies, shuffler }) => {

  const choiceTexts = [
      question.answer.toUpperCase(),
      ...lies.map(l => l.lie.toUpperCase())
    ]
  const choiceNodes = shuffler
    .map(i => choiceTexts[i])
    .map((choice, key) => (
      <div key={key} className={cx('col-xs-4', {
        clearfix: key % 3 === 0
      })}>
        <div className="choiceItems">
          <div>{choice}</div>
        </div>
      </div>
    ))

  let finishedUsers = 0
  const choices = [question, ...lies]
  const playerNodes = players.map(player => {
    const { displayName } = player
    const userDidChoose = Boolean(choices.find(choice => {
      return Boolean(choice.believers.find(u => u === displayName))
    }))
    if (userDidChoose) finishedUsers++
    return (
      <div key={displayName} className={cx({ active: userDidChoose})}>
        <div className="playerLobbyItem"></div>
      </div>
    )
  })

  return (
    <div className="relative">
      <div className="choiceList row">{choiceNodes}</div>
      {finishedUsers === players.length
        ? <div className="finished">Everyone has chosen!</div>
        : ''
      }
      <div className="WaitingPlayerChoosing playerColor">{playerNodes}</div>
    </div>
  )
}