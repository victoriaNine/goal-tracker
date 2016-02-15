import React, { PropTypes } from 'react'

import ContentClear from 'material-ui/svg-icons/content/clear'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

const DeleteSettingDialog = ({ goal = {}, onCancel, onDelete, open }) => {
  const actions = [
    <FlatButton label='Ouh là, non !' secondary onTouchTap={onCancel} keyboardFocused />,
    <FlatButton label='Adios !' primary onTouchTap={onDelete} icon={<ContentClear />} />
  ]

  return (
    <Dialog
      title='Supprimer un objectif'
      actions={actions}
      open={open}
      onRequestClose={onCancel}
    >
      <p>Supprimer l’objectif « {goal.name} » ?</p>
    </Dialog>
  )
}

DeleteSettingDialog.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default DeleteSettingDialog
