// Progrès du jour (reducer)
// =========================

// On se préoccupe d’une seule action…
import { PROGRESS } from '../action-creators'

// Par défaut, `todaysProgress` vaut `{}`
// (les clés sont les IDs des objectifs, les valeurs leur progrès du jour.
// Ici, pas de progrès renseignés par défaut.)
export default function todaysProgress (state = {}, action) {
  switch (action.type) {
    // Progression d’un objectif
    // -------------------------
    case PROGRESS:
      // Les `|| 0` sont pour les cas `undefined` (si pas de progrès renseigné
      // jusqu’ici) et `NaN` (si `increment` n’est pas convertible en nombre
      // valide).
      const previous = state[action.goalId] || 0
      const increment = Number(action.increment) || 0
      // Notez la propriété calculée, dont le nom reprend l'ID de l’objectif !
      return { ...state, [action.goalId]: previous + increment }

    default:
      // Rappel : un *reducer* doit **toujours** renvoyer l’état
      // sans modification si l’action n’est pas applicable.
      return state
  }
}
