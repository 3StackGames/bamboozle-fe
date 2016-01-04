import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import { connect } from 'react-redux'
import { Landing } from './index'


@connect(state => ({
  outOfQuestions: state.gameState.outOfQuestions
}))
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { props } = this
    return (
      <div>
        {
          props.outOfQuestions === true
            ? this.outOfQuestionsView
            : ''
        }
        {props.children}
      </div>
    )
  }

  get outOfQuestionsView() {
    return (
      <div className="error-fullscreen">
        <div className="error-body">
          <h1>Thanks for playing!</h1>
          <h3>Looks like you ran out of new questions!</h3>
          <h3>We'd love to hear your feedback. You can write a post on our <a style={{textDecoration: 'underline', color: 'white'}}href="https://www.facebook.com/bamboozlethegame">Facebook page</a></h3>
        </div>
      </div>
    )
  }
}
