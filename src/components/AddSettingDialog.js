import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'

import Checkbox from 'material-ui/Checkbox'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ContentEdit from 'material-ui/svg-icons/content/create'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

import { GoalPropType } from '../prop-types'

const DEFAULT_STATE = { id: undefined, name: '', target: 5, units: '', keepOpen: true }

export default class AddSettingDialog extends Component {
  static propTypes = {
    goal: PropTypes.oneOfType([GoalPropType, PropTypes.shape({})]),
    onAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
  }

  constructor (...args) {
    super(...args)
    this.state = DEFAULT_STATE
  }

  componentWillReceiveProps ({ goal }) {
    this.setState({ ...DEFAULT_STATE, ...goal, keepOpen: goal.id === undefined })
  }

  handleChange (event, field, checked) {
    if (field === 'keepOpen') {
      this.setState({ keepOpen: checked })
    } else {
      const caster = field === 'target' ? Number : String
      this.setState({ [field]: caster(event.target.value) })
    }
  }

  render () {
    const { open, onCancel } = this.props
    const isEditing = 'id' in this.props.goal

    const actions = [
      <FlatButton label='Annuler' secondary onTouchTap={onCancel} />
    ]
    if (isEditing) {
      actions.push(<FlatButton label='Modifier' primary onTouchTap={this.triggerAdd} icon={<ContentEdit />} />)
    } else {
      actions.push(<FlatButton label='Ajouter' primary onTouchTap={this.triggerAdd} icon={<ContentAdd />} />)
    }

    return (
      <Dialog
        title={isEditing ? 'Modifier un objectif' : 'Ajouter un objectif'}
        actions={actions}
        open={open}
        onRequestClose={onCancel}
      >
        <div>
          <TextField name='name' floatingLabelText='Nom' required fullWidth autoFocus
            value={this.state.name} onChange={(event) => this.handleChange(event, 'name')}
          />
          <TextField name='target' floatingLabelText='Quantité par jour' type='number' required
            value={this.state.target} onChange={(event) => this.handleChange(event, 'target')}
          />
          {' '}
          <TextField name='units' floatingLabelText='Unité' hintText='pas, minutes de course…' required
            value={this.state.units} onChange={(event) => this.handleChange(event, 'units')}
          />
          {isEditing || (
            <Checkbox
              label='Garder ouvert pour l’ajout suivant'
              checked={this.state.keepOpen}
              onCheck={(event, checked) => this.handleChange(event, 'keepOpen', checked)}
              style={{ marginTop: '1em' }}
            />
          )}
        </div>
      </Dialog>
    )
  }

  @autobind
  triggerAdd () {
    this.props.onAdd(this.state)
    this.setState(DEFAULT_STATE)
  }
}
