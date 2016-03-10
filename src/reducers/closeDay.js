// Fermeture de journée (reducer)
// ==============================

import moment from 'moment'

// On se préoccupe d’une seule action.
import { CLOSE_DAY } from '../action-creators'

// La valeur par défaut est gérée par le meta-réducteur dans `index.js`
export default function closeDay (state, action) {
  switch (action.type) {
    case CLOSE_DAY:
      return {
        // On garde l'état d'origine, en écrasant toutefois trois champs :
        ...state,
        // * `history` (on ajoute une entrée pour le `today` précédent)
        history: tallyPreviousDay(state),
        // * `today` (la journée “active” se recale sur aujourd'hui)
        today: moment().format('YYYY-MM-DD'),
        todaysProgress: {}
      }

    default:
      return state
  }
}

// Calcul de l’historisation
// -------------------------
function tallyPreviousDay ({ goals, history, today, todaysProgress }) {
  const historyEntry = {
    // À ce stade, `today` n’a pas encore été modifié, il vaut le dernier
    // jour pris en compte par l’état.  Il sert donc pour la date de l’entrée
    // dans l’historique.
    date: today,
    progresses: goals.reduce((acc, { id, target }) => {
      const progress = todaysProgress[id] || 0
      // On n’historise que les progrès non nuls…
      if (progress > 0) {
        // On n’oublie pas de préciser la valeur cible en vigueur, des fois
        // qu’elle changerait par la suite.
        acc[id] = [progress, target]
      }
      return acc
    }, {})
  }

  // …et comme d’habitude, la version non-modifiante de `push`…
  return [historyEntry, ...history]
}
