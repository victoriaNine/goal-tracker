import React from 'react'

import { ListItem } from 'material-ui/List'

import Gauge from './Gauge'
import { GoalPropType, HistoryDayProgressesPropType } from '../prop-types'

const HistoryDayGoal = ({ goal: { name, units }, stats: [progress = 0, target] = [] }) => {
  const details = (
    <div>
      <Gauge value={progress} max={target} />
      {progress} {units} sur {target}
    </div>
  )

  return (
    <ListItem
      primaryText={name}
      secondaryText={details}
      secondaryTextLines={2}
      disabled
    />
  )
}

HistoryDayGoal.propTypes = {
  goal: GoalPropType.isRequired,
  stats: HistoryDayProgressesPropType.isRequired
}

export default HistoryDayGoal
