// Utilisateur courant (reducer)
// =============================

// On se préoccupe de 4 actions…
import { LOGIN_FAILURE, LOGIN_START, LOGIN_SUCCESS, LOGOUT } from '../action-creators'

// Par défaut, on n’est pas identifiés…
export default function currentUser (state = { loginState: 'logged-out' }, action) {
  switch (action.type) {
    // Connexion
    // ---------
    //
    // L’action de login est asynchrone, nous la transformons en trois actions
    // synchrones au fil du temps : démarrage, succès ou erreur.  Vous trouverez
    // le code qui orchestre ça dans la fonction `logIn` de
    // [action-creators.js](../action-creators.html).
    case LOGIN_START:
      return { loginState: 'pending' }

    case LOGIN_FAILURE:
      return { loginState: 'failure' }

    case LOGIN_SUCCESS: {
      const { email } = action
      return { loginState: 'success', email }
    }

    // Déconnexion
    // -----------
    case LOGOUT:
      // Déconnexion = retour au contenu adapté
      return { loginState: 'logged-out' }

    default:
      // Rappel : un *reducer* doit **toujours** renvoyer l’état
      // sans modification si l’action n’est pas applicable.
      return state
  }
}
