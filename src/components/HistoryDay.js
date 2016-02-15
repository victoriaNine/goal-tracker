import React, { PropTypes } from 'react'

import Divider from 'material-ui/Divider'
import { List } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'

import { formatDate } from '../lib/helpers'
import { GoalPropType, HistoryDayStatsPropType } from '../prop-types'
import HistoryDayGoal from './HistoryDayGoal'

const HistoryDay = ({ goals, stats: { date, progresses } }) => (
  <div>
    <Divider />
    <List>
      <Subheader>{formatDate(date)}</Subheader>
      {goals.map((goal) => {
        const goalStats = progresses[goal.id]
        if (goalStats) {
          return <HistoryDayGoal key={goal.id} goal={goal} stats={goalStats} />
        }
      })}
    </List>
  </div>
)

HistoryDay.propTypes = {
  goals: PropTypes.arrayOf(GoalPropType).isRequired,
  stats: HistoryDayStatsPropType.isRequired
}

export default HistoryDay
