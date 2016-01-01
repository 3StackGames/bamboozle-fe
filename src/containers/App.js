import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import { Landing } from './index'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { props } = this
    return (
      <div>
        {props.children}
      </div>
    )
  }
}
