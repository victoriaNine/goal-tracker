// Historique (reducer)
// ====================

// On se préoccupe d’une seule action…
import { CLEAR_HISTORY } from '../action-creators'

// Par défaut, `history` vaut `[]` (pas d’historique)
export default function history (state = [], action) {
  switch (action.type) {
    // Nettoyage de l’historique
    // -------------------------
    case CLEAR_HISTORY:
      // Facile : on remet à vide.
      return []

    default:
      // Rappel : un *reducer* doit **toujours** renvoyer l’état
      // sans modification si l’action n’est pas applicable.
      return state
  }
}
