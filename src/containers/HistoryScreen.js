import { connect } from 'react-redux'
import { Link } from 'react-router'
import React, { Component } from 'react'

import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import ClearIcon from 'material-ui/svg-icons/content/clear'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

class HistoryScreen extends Component {
  render () {
    return (
      <h1>History coming soon</h1>
    )
  }
}

const mapStateToProps = ({ goals, history }) => ({ goals, history })

export default connect(mapStateToProps)(HistoryScreen)
