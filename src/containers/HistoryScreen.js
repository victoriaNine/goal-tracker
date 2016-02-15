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
    const { goals, history, dispatch } = this.props
    return (
      <DocumentTitle title='Mon historique'>
        <div>
          <FlatButton label='Retour'
            icon={<ArrowBack />} containerElement={<Link to='/' />}
          />
          <Card className='history'>
            <CardTitle title='Historique' />
            <CardText>
              {history.map((dayStats) =>
                <HistoryDay key={dayStats.date} goals={goals} stats={dayStats} />
              )}
              {history.length === 0 && (
                <p>Aucun historique disponible</p>
              )}
            </CardText>
            {history.length > 0 && (
              <CardActions>
                <RaisedButton label='Réinitialiser'
                  icon={<ClearIcon />} onClick={() => dispatch(clearHistory())}
                />
              </CardActions>
            )}
          </Card>
        </div>
      </DocumentTitle>
    )
  }
}

const mapStateToProps = ({ goals, history }) => ({ goals, history })

export default connect(mapStateToProps)(HistoryScreen)
