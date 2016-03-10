// Journée historique d’un objectif
// ================================

// Sous-section de l'écran d’historique, dédiée à un objectif sur un jour précis.
// Rendu en fait à l'intérieur d'un autre composant bête: `HistoryDay`.

import React from 'react'

import { ListItem } from 'material-ui/List'

import Gauge from './Gauge'
import { GoalPropType, HistoryDayProgressesPropType } from '../prop-types'

// La déstructuration et les valeurs par défaut en force !
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

// Comme toujours, on définit les propriétés attendues/autorisées pour validation.
HistoryDayGoal.propTypes = {
  goal: GoalPropType.isRequired,
  stats: HistoryDayProgressesPropType.isRequired
}

export default HistoryDayGoal
