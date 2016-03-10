// Paramètres (conteneur)
// ======================

// Ce conteneur est particulièrement intéressant car il illustre de nombreux
// aspects de React et ES6.  On y trouve notamment un import “espace de noms”,
// une surcharge de constructeur, des méthodes métier décorées ou non, des
// méthodes de cycle de vie de composant React, et le recours à `bindActionCreators`
// et `mapDispatchToProps`.  Pas mal!

import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { browserHistory as history, Link } from 'react-router'
import React, { Component } from 'react'

import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import { List, ListItem } from 'material-ui/List'
import Logout from 'material-ui/svg-icons/action/exit-to-app'
import RaisedButton from 'material-ui/RaisedButton'
import Subheader from 'material-ui/Subheader'

import { addGoal, logOut, removeGoal, updateGoal } from '../action-creators'
import AddSettingDialog from '../components/AddSettingDialog'
import DeleteSettingDialog from '../components/DeleteSettingDialog'
import GoalSetting from '../components/GoalSetting'

const DEFAULT_STATE = { goal: {}, dialog: null }

// Le composant conteneur
// ----------------------

class SettingsScreen extends Component {
  // Lorsqu’une classe ES6 de composant React a un état transient
  // (`this.state`), la norme est de l'initialiser à la construction
  // (par défaut, il vaut `null`).
  constructor (...args) {
    super(...args)
    this.state = DEFAULT_STATE
  }

  // Pour plus de détails sur cette syntaxe `@autobind`, voyez la documentation
  // du conteneur de connexion.
  @autobind
  addOrUpdateGoal ({ id, name, target, units, keepOpen }) {
    const { addGoal, updateGoal } = this.props
    if (id !== undefined) {
      updateGoal(id, name, target, units)
      keepOpen = false
    } else {
      addGoal(name, target, units)
    }
    if (!keepOpen) {
      this.closeDialogs()
    }
  }

  @autobind
  closeDialogs () {
    this.setState(DEFAULT_STATE)
  }

  // Méthode de cycle de vie React qui est déclenchée chaque fois que le
  // composant reçoit un jeu de propriétés *après sa construction initiale*.
  //
  // On en a besoin ici à cause de la déconnexion, qui se produit depuis ce
  // composant, et entraîne une mise à autre chose que `success` de la propriété
  // `loginState`, transmise par le `connect` et le `mapStateToProps` en bas de
  // fichier.
  //
  // En effet, si on est déconnecté-e, on n'a plus “le droit” d'être sur cet
  // écran (qui n'est de toutes façons plus pertinent), mais vu que la route
  // n'a pas changé, on ne s'est pas faits attraper par le col grâce au hook
  // `onEnter` de la route.  On détecte donc ce cas de figure pour naviguer
  // manuellement (via la méthode `push(…)` de l'API de notre gestion d’historique)
  // sur la racine, qui affichera du coup l’écran de connexion.
  componentWillReceiveProps ({ currentUser: { loginState } }) {
    if (loginState !== 'success') {
      history.push('/')
    }
  }

  @autobind
  deleteSelectedGoal () {
    this.props.removeGoal(this.state.goal.id)
    this.closeDialogs()
  }

  @autobind
  openGoalAdder () {
    this.setState({ goal: {}, dialog: 'add-or-update' })
  }

  openGoalDeleter (goal) {
    this.setState({ goal, dialog: 'delete' })
  }

  openGoalEditor (goal) {
    this.setState({ goal, dialog: 'add-or-update' })
  }

  render () {
    const { currentUser, goals, logOut } = this.props
    const logoutButton = (
      <IconButton onClick={logOut}>
        <Logout />
      </IconButton>
    )

    return (
      // Enrobage par un
      // [`<DocumentTitle>`](https://github.com/gaearon/react-document-title)
      // pour modifier automatiquement le titre de la fenêtre lorsqu’on affiche
      // ce composant conteneur.
      <DocumentTitle title='Mes paramètres'>
        <div>
          <FlatButton label='Retour'
            icon={<ArrowBack />} containerElement={<Link to='/' />}
          />
          <Card className='settings'>
            <CardTitle title='Paramètres' />
            <CardText>
              <List>
                <ListItem
                  primaryText='Vous êtes connecté-e en tant que'
                  // Le `…|| {}` ici sert à éviter une erreur au `render` après
                  // déconnexion, une fraction de seconde avant qu’on navigue vers
                  // l’URL racine.  Ainsi, en cas de `currentUser` à `null`, on se
                  // retrouve juste avec une valeur de propriété à `undefined`.
                  secondaryText={(currentUser || {}).email}
                  rightIconButton={logoutButton}
                />
              </List>
              <Divider />
              <List>
                <Subheader>Mes objectifs</Subheader>
                {goals.map((goal) =>
                  <GoalSetting key={goal.id} goal={goal}
                    // Remarquez que puisqu’on a besoin de passer un argument à nos
                    // méthodes ici, on doit utiliser une fonction dédiée, et comme
                    // c'est une fonction fléchée, on préserve le `this`.  Du coup,
                    // inutile de décorer ces deux méthodes par `@autobind`.
                    onDeleteClick={() => this.openGoalDeleter(goal)}
                    onEditClick={() => this.openGoalEditor(goal)}
                  />
                )}
                {goals.length === 0 && (
                  <ListItem secondaryText='Aucun objectif pour le moment' />
                )}
              </List>
            </CardText>
            <CardActions>
              <RaisedButton label='Ajouter un objectif' primary
                // En revanche, ici, on passe une référence (et pareil pour les
                // dialogues ci-après), du coup les méthodes concernées sont *bound*.
                icon={<ContentAdd />} onClick={this.openGoalAdder}
              />
            </CardActions>
          </Card>
          <AddSettingDialog
            goal={this.state.goal}
            open={this.state.dialog === 'add-or-update'}
            onCancel={this.closeDialogs}
            onAdd={this.addOrUpdateGoal}
          />
          <DeleteSettingDialog
            goal={this.state.goal}
            open={this.state.dialog === 'delete'}
            onCancel={this.closeDialogs}
            onDelete={this.deleteSelectedGoal}
          />
        </div>
      </DocumentTitle>
    )
  }
}

// Connexion au *store* Redux
// --------------------------

// On s’intéresse uniquement aux champs `goals` et `currentUser` de l’état global,
// qu’on veut retrouver dans nos propriétés sous les mêmes noms.  Par ricochet,
// seuls les changements apportés à ces champs entraîneront un éventuel *re-render*
// de notre conteneur.
const mapStateToProps = ({ goals, currentUser }) => ({ goals, currentUser })

// C’est [`connect(…)`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options),
// fourni par Redux, qui fait les connexions nécessaires pour nous
// fournir les propriétés, implémenter notre `shouldComponentUpdate(…)` et nous fournir
// aussi une propriété `dispatch(…)`, pré-associée au *store* Redux transmis via le
// contexte React.
//
// Voici le seul exemple de `mapDispatchToProps` de l’application.  On s'en sert
// pour fournir comme propriétés des fonctions qui ne sont pas juste les *action
// creators* nus (qui renverraient simplement le descripteur d'action), mais carrément
// des *appels `dispatch` préconfigurés.  Puisqu’ici on passe un objet plutôt que notre
// propre implémentation, il applique ce comportement par défaut en supposant que toutes
// les valeurs de l’objet sont des *action creators*.
export default connect(
  mapStateToProps,
  { addGoal, logOut, removeGoal, updateGoal }
)(SettingsScreen)
