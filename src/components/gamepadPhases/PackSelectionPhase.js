import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'
import R from 'ramda'

export default class PackSelectionPhase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedPacks: R.range(0, props.gameState.possiblePacks.length).fill(false),
      includeNsfwQuestions: false,
      includeUsedQuestions: false
    }
  }

  render() {
    const { gameState, currentPlayer } = this.props

    if(gameState.players[0].displayName === currentPlayer.displayName) {
      return (
        <div>
          <div className="small-header">Please select question packs</div>
          <form>
            <div id="warning" className="notice-red" />
            {gameState.possiblePacks.map((pack, key) => {
              return (
                <div key={key} className="form-group">
                  <input
                    className="form-control checkbox"
                    type="checkbox"
                    name="questionPack[]"
                    id={"questionPack-" + key}
                    value={pack.name}
                    onChange={e => this.handleCheck(e, key)} />
                  <label htmlFor={ "questionPack-" + key}>{pack.name}</label>
                </div>
              )
            })}
            <hr />
            <h4><strong>Options</strong></h4>
            <div className="form-group col-sm-6">
              <input
                className="form-control checkbox"
                type="checkbox"
                name="includeNsfwQuestions"
                id="includeNsfwQuestions"
                onChange={e => this.handleCheck(e, 'includeNsfwQuestions')} />
              <label htmlFor="includeNsfwQuestions">Include NSFW Questions</label>
            </div>
            <div className="form-group col-sm-6">
              <input
                className="form-control checkbox"
                type="checkbox"
                name="includeUsedQuestions"
                id="includeUsedQuestions"
                onChange={e => this.handleCheck(e, 'includeUsedQuestions')} />
              <label htmlFor="includeUsedQuestions">Include Used Questions</label>
            </div>
            <hr />
            <button
              onClick={this.submitPacks}
              disabled={!this.isInputValid}
              className="btn">
              Use Selected Question Packs
            </button>
          </form>
        </div>
      )
    }

    return <div className="small-header">Waiting for question packs to be selected.</div>
  }

  get isInputValid() {
    const numSelected = this.state.selectedPacks
      .filter(selected => selected)
      .length

    console.log(numSelected)
    return numSelected > 0
  }

  @autobind
  handleCheck(e, key) {
    const isChecked = e.target.checked
    const { selectedPacks, includeNsfwQuestions, includeUsedQuestions } = this.state

    switch(key) {
      case 'includeNsfwQuestions':
        this.setState({
          includeNsfwQuestions: !includeNsfwQuestions
        })
        break
      case 'includeUsedQuestions':
        this.setState({
          includeUsedQuestions: !includeUsedQuestions
        })
        break
      default:
        const selected = [...selectedPacks]
        selected[key] = isChecked
        this.setState({
          selectedPacks: selected
        })
    }
  }

  @autobind
  submitPacks(e) {
    const { gameState, currentPlayer, engine } = this.props
    e.preventDefault()
    e.target.disabled = true

    const packs = this.state.selectedPacks
      .filter(selected => selected)
      .map((_, key) => gameState.possiblePacks[key].id)
    const { includeNsfwQuestions, includeUsedQuestions } = this.state

    engine.gamepadInput({
      includeNsfwQuestions,
      includeUsedQuestions,
      packs,
      player: currentPlayer.displayName,
      gameCode: gameState.gameCode
    })
  }
}
