import { connect } from 'react-redux'
import { Link } from 'react-router'
import React, { Component } from 'react'

import '../styles/TrackerScreen.styl'

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import HistoryIcon from 'material-ui/svg-icons/action/history'
import RaisedButton from 'material-ui/RaisedButton'
import SettingsIcon from 'material-ui/svg-icons/action/settings'

import { formatDate, getDayCounts } from '../lib/helpers'
import Gauge from '../components/Gauge'
import GoalTrackerWidget from '../components/GoalTrackerWidget'
import { progressOnGoal } from '../action-creators'

export class TrackerScreen extends Component {
  overallProgress () {
    const { todaysProgress, goals } = this.props
    const [totalProgress, totalTarget] = getDayCounts(todaysProgress, goals)

    return totalTarget === 0 ? 0 : Math.floor(totalProgress * 100 / totalTarget)
  }

  render () {
    const { dispatch, goals, todaysProgress } = this.props
    return (
      <Card className='goalTracker'>
        <CardTitle
          title={formatDate(new Date(), 'LL')}
          subtitle={<Gauge value={this.overallProgress()} />}
        />
        <CardText>
          {
            goals.map((goal) => (
              <GoalTrackerWidget
                key={goal.id}
                goal={goal}
                progress={todaysProgress[goal.id] || 0}
                onProgress={() => dispatch(progressOnGoal(goal.id))}
              />
            ))
          }
        </CardText>
        <CardActions>
          <RaisedButton label='Historique' secondary
            icon={<HistoryIcon />} containerElement={<Link to='/history' />}
          />
          <RaisedButton label='Paramètres'
            icon={<SettingsIcon />} containerElement={<Link to='/settings' />}
          />
        </CardActions>
      </Card>
    )
  }
}

const mapStateToPops = ({ goals, todaysProgress }) => ({ goals, todaysProgress })

export default connect(mapStateToPops)(TrackerScreen)
