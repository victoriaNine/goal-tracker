// Écran principal (conteneur)
// ===========================

import { connect } from 'react-redux'
import React, { Component } from 'react'

import LoginScreen from './LoginScreen'
import TrackerScreen from './TrackerScreen'

// Le composant conteneur
// ----------------------
export class HomeScreen extends Component {
  render () {
    // Si on a un compte “connecté”, notre URL (la racine) affiche
    // l’écran de suivi des objectifs.  Sinon, on affiche l’écran
    // de connexion.
    return this.props.loginState === 'success'
      ? <TrackerScreen />
      : <LoginScreen />
  }
}

// Connexion au *store* Redux
// --------------------------

// On s’intéresse uniquement au chemin `currentUser.loginState` de l’état global.
// Par ricochet, seuls les changements apportés à ce champ (connexion, déconnexion)
// entraîneront un éventuel *re-render* de notre conteneur.
const mapStateToProps = ({ currentUser: { loginState } }) => ({ loginState })

// C’est `connect(…)`, fourni par Redux, qui fait les connexions nécessaires pour nous
// fournir la propriété, implémenter notre `shouldComponentUpdate(…)` et nous fournir
// aussi une propriété `dispatch(…)`, pré-associée au *store* Redux transmis via le
// contexte React.
export default connect(mapStateToProps)(HomeScreen)
