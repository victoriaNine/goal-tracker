import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router'
import React, { Component } from 'react'

import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import ClearIcon from 'material-ui/svg-icons/content/clear'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

import { clearHistory } from '../action-creators'
import HistoryDay from '../components/HistoryDay'

class HistoryScreen extends Component {
  render () {
    return (
      <DocumentTitle title='Mon historique'>
        <div>
          <FlatButton label='Retour'
            icon={<ArrowBack />} containerElement={<Link to='/' />}
          />
          <Card className='history'>
            <CardTitle title='Historique' />
            <CardText>
              <p>Coming soon: history</p>
            </CardText>
            <CardActions>
              <RaisedButton label='Réinitialiser'
                icon={<ClearIcon />}
              />
            </CardActions>
          </Card>
        </div>
      </DocumentTitle>
    )
  }
}

const mapStateToProps = ({ goals, history }) => ({ goals, history })

export default connect(mapStateToProps)(HistoryScreen)
