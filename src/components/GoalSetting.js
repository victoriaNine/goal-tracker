// Paramétrage d’un objectif
// =========================

// Section de l'écran de paramétrage, dédiée à un objectif.
// Fournit notamment le descriptif de l'objectif et le menu déroulant
// pour les actions de modification et suppression.

import React, { PropTypes } from 'react'

import DeleteIcon from 'material-ui/svg-icons/content/clear'
import EditIcon from 'material-ui/svg-icons/content/create'
import { grey400 } from 'material-ui/styles/colors'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import { ListItem } from 'material-ui/List'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

import { GoalPropType } from '../prop-types'

// Notez la déstructuration profonde…
const GoalSetting = ({ goal: { name, target, units }, onDeleteClick, onEditClick }) => {
  const rightIconMenu = (
    <IconMenu iconButtonElement={<IconButton><MoreVertIcon color={grey400} /></IconButton>}>
      <MenuItem leftIcon={<EditIcon />} onClick={onEditClick}>Modifier</MenuItem>
      <MenuItem leftIcon={<DeleteIcon />} onClick={onDeleteClick}>Supprimer</MenuItem>
    </IconMenu>
  )

  return (
    <ListItem
      primaryText={name}
      secondaryText={`${target} ${units}`}
      rightIconButton={rightIconMenu}
    />
  )
}

// Comme toujours, on définit les propriétés attendues/autorisées pour validation.
GoalSetting.propTypes = {
  goal: GoalPropType,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired
}

export default GoalSetting
