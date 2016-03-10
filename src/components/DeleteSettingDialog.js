// Suppression de paramètre
// ========================

// C’est en fait une boîte de dialogue, inclue d’office dans
// le conteneur parent (`SettingsScreen`), et qui va donc être
// initialement *rendered* sans objectif (`goal`), puis verra ses
// propriétés mises à jour à chaque utilisation.  Mais comme c’est
// un composant pur fonctionnel, donc sans état aucun, nul besoin
// comme pour `AddSettingDialog` d’un `componentWillReceiveProps`.
// La fonction est simplement rappelée à chaque fois.  Nickel…

import React, { PropTypes } from 'react'

import ContentClear from 'material-ui/svg-icons/content/clear'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

// Il y a vraiment quelque chose de délicieux dans la déstructuration,
// surtout pour un argument objet et en ajoutant des valeurs par défaut,
// comme ici…
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

// Sur un composant “bête”, préciser les propriétés attendues / autorisées est
// [une bonne pratique incontournable](http://facebook.github.io/react/docs/reusable-components.html).
// Quand on n’est pas dans une classe ES6 (et en effet, les composants purs fonctionnels
// sont le cas majoritaire), on colle juste la propriété `propTypes` directement sur la
// fonction (ça rend exactement pareil qu'une propriété `static` dans une classe ES6).
DeleteSettingDialog.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default DeleteSettingDialog
