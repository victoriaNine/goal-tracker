// Actions Creators pour Redux
// ===========================

import callAPI from './lib/api'

// Avec Redux, on [recommande de centraliser](http://redux.js.org/docs/recipes/ReducingBoilerplate.html)
// le code qui crée des objets représentant les actions
// vers le *store* central.  Pour rappel, une action
// est une demande de modification de l’état central.
// Ce sont par défaut des objets JS basiques, avec
// au moins une propriété `type`, qui vaut généralement
// une `String` unique (aussi complexe soit-elle).
//
// En centralisant leur création, **on garantit que d’un
// endroit de l'appli à un autre, on ne créera pas des
// objets hétérogènes pour une même action**.

// Réglages d’objectifs
// --------------------

// On prend soin d’exporter les constantes de type aussi,
// afin notamment que le code des *reducers* puisse les
// utiliser et **garantir la concordance** avec les champs
// `type` dans les objets actions.
export const ADD_GOAL = '@@GOALTRACKER/GOALS_ADD'
export const REMOVE_GOAL = '@@GOALTRACKER/GOALS_DEL'
export const UPDATE_GOAL = '@@GOALTRACKER/GOALS_UPDATE'

export function addGoal (name, target, units) {
  return { type: ADD_GOAL, name, target, units }
}

export function removeGoal (id) {
  return { type: REMOVE_GOAL, id }
}

export function updateGoal (id, name, target, units) {
  return { type: UPDATE_GOAL, id, name, target, units }
}

// Utilisation quotidienne
// -----------------------

export const CLEAR_HISTORY = '@@GOALTRACKER/HISTORY_CLEAR'
export const CLOSE_DAY = '@@GOALTRACKER/CLOSE_DAY'
// Pour les actions asynchrones, on découpe en général en trois actions
// synchrone : lancement, réussite, échec.
export const LOGIN_FAILURE = '@@GOALTRACKER/AUTH_LOGIN_FAILURE'
export const LOGIN_START = '@@GOALTRACKER/AUTH_LOGIN_START'
export const LOGIN_SUCCESS = '@@GOALTRACKER/AUTH_LOGIN_SUCCESS'
export const LOGOUT = '@@GOALTRACKER/AUTH_LOGOUT'
export const PROGRESS = '@@GOALTRACKER/PROGRESS'

export function clearHistory () {
  return { type: CLEAR_HISTORY }
}

export function closeDay () {
  return { type: CLOSE_DAY }
}

// Et voici un *action creator* **asynchrone** !  Cette action de
// login se fera sur notre serveur de dev, via une requête Ajax, et
// ne peut donc se contenter de renvoyer un objet action inerte, seule
// chose pourtant que Redux permet de base…
//
// On utilisera donc le middleware [redux-thunk](https://github.com/gaearon/redux-thunk#readme)
// lorsqu’on créera le *store*, afin d’avoir le droit de renvoyer des
// *thunks*, en l’occurence des fonctions que le middleware appellera ensuite
// en leur fournissant le `dispatch` du *store* : à charge pour elle ensuite
// de faire les bons appels à `dispatch` au fil du traitement asynchrone.
export function logIn (email, password) {
  return async (dispatch) => {
    // 1. On commence par *dispatcher* l’action synchrone qui marque le début
    // du traitement.  Ainsi, l’UI peut refléter qu’un traitement est en cours,
    // par exemple avec un spinner, ou en désactivant un bouton…
    dispatch(logInStart())

    try {
      // 2. On lance l’appel réseau à notre serveur de dev.  Ici, simple requête
      // 100% JSON sur le point d’appel prévu.
      const { status } = await callAPI({
        url: '/sessions',
        body: { email, password }
      })
      // 3a. On a bien reçu une réponse du serveur.  S'il nous dit OK, on
      // *dispatche* l’action synchrone de succès.  Sinon, celle d’échec.
      if (status === 'authenticated') {
        dispatch(logInSuccess(email))
      } else {
        dispatch(logInFailure())
      }
    } catch (err) {
      // 3b.  Un souci réseau est survenu.  On logue l’erreur tout en
      // *dispatchant* l’action synchrone d’échec.
      dispatch(logInFailure())
      console.error(err)
    }
  }
}

// Notez que ces actions synchrones « d’étapes » pour le login (asynchrone)
// sont exportées juste histoire de pouvoir les traiter dans les tests du
// réducteur associé.  Notre code « de production » pourrait se passer des exports.
export function logInFailure () {
  return { type: LOGIN_FAILURE }
}

export function logInStart () {
  return { type: LOGIN_START }
}

export function logInSuccess (email) {
  return { type: LOGIN_SUCCESS, email }
}

export function logOut () {
  return { type: LOGOUT }
}

export function progressOnGoal (goalId, increment = 1) {
  return { type: PROGRESS, goalId, increment }
}
