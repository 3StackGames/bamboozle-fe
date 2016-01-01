import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import R from 'ramda'
import objectPath from 'object-path'

export default class DisplayLobby extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static PropTypes = {
    players: PropTypes.array
  }

  render() {
    const { players } = this.props

    return (
      <div className="row playerLobby playerColor">
        {R.range(0, 8).map(index => (
          <PlayerLobbyItem
            displayName={objectPath.get(players, [index, 'displayName'])}
            key={index} />
        ))}
      </div>
    )
  }
}

const PlayerLobbyItem = ({ displayName }) => (
  <div className={cx("col-xs-4", {
    active: displayName
  })}>
    <div className="playerLobbyItem">{displayName || '?'}</div>
  </div>
)
