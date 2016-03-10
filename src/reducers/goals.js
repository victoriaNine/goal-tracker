// Objectifs (reducer)
// ===================

// On se préoccupe de 3 actions…
import { ADD_GOAL, REMOVE_GOAL, UPDATE_GOAL } from '../action-creators'

// Par défaut, `goals` vaut `[]` (pas d’objectifs définis)
export default function goals (state = [], action) {
  switch (action.type) {
    // Ajout d’objectif
    // ----------------
    case ADD_GOAL: {
      // On prend les champs qui nous intéressent
      const { name, target, units } = action
      // On calcule un nouvel ID d’objectif, qui vaut le maximum
      // de ceux existants, plus un.
      //
      // L’approche un poil moins « pure fonctionnelle » serait :
      // ```js
      // const id = Math.max(...state.map((goal) => goal.id), -1) + 1
      // ````
      //
      // Si aucun objectif n’est défini,
      // on ferait un `Math.max()` sans argument, ce qui renverrait
      // `-Infinity`, pas top ; par conséquent, on ajoute un dernier
      // argument, `-1`, qui garantit une valeur valide au démarrage.
      // Ainsi, le premier `id` sera fatalement zéro (-1 + 1).
      const id = state.reduce((max, { id }) => max > id ? max : id, -1) + 1
      // Version “immutable” (génère une nouvelle valeur plutôt que
      // de modifier le tableau existant) de `.push(…)`.
      return [...state, { id, name, target, units }]
    }

    // Retrait d’objectif
    // ------------------
    case REMOVE_GOAL:
      return state.filter(({ id }) => id !== action.id)

    // Mise à jour (voire ajout) d’objectif
    // ------------------------------------
    case UPDATE_GOAL: {
      const { id, name, target, units } = action
      const newGoal = { id, name, target, units }
      // Si l’objectif existait bien dans le tableau, on crée le nouveau
      // tableau en partant de l’existant pour ne remplacer que l’entrée idoine.
      if (state.find(({ id }) => id === action.id)) {
        return state.map((goal) => goal.id === id ? newGoal : goal)
      }

      // Si ça se trouve, on ne l’avait pas en fait, cet objectif…  Ça ne
      // devrait pas arriver, mais autant se blinder.  On l’ajoute à la fin,
      // dans un tel as, comme un ajout mais en préservant l'ID.
      return [...state, newGoal]
    }

    default:
      // Rappel : un *reducer* doit **toujours** renvoyer l’état
      // sans modification si l’action n’est pas applicable.
      return state
  }
}
