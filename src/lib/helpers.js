// Utilitaires
// ===========

import moment from 'moment'

// Calage de la bibliothèque [Moment.js](http://momentjs.com/) en français.
moment.locale('fr')

// Formatage de date de façon “pratique”.
//
// Si un format est passé (`String`), il est utilisé directement
// (c’est le cas pour le titre de `TrackerScreen` par exemple, qui
// utilise le code de format local semi-long `'LL'`), sinon on
// utilise des textes spéciaux pour aujourd’hui, hier et avant-hier,
// et des formats longs pour toute date autre.
export function formatDate (date, format) {
  date = moment(date)
  if (format) {
    return date.format(format)
  }
  if (date.isSame(moment(), 'day')) {
    return 'Aujourd’hui'
  }
  if (date.isSame(moment().subtract(1, 'day'), 'day')) {
    return 'Hier'
  }
  if (date.isSame(moment().subtract(2, 'days'), 'day')) {
    return 'Avant-hier'
  }
  return date.format('dddd D MMMM YYYY')
}

// Détermine le rapport entre l’avancée de la journée (0h–minuit) et le taux de complétion d’une tâche
// ou d’un ensemble de tâches.  Si on est bien dans les temps, ce rapport doit approcher de 1 (si on est
// en avance, il dépasse 1, si on est bien à la bourre, il est vers 0.5 voire en-dessous).
//
// Utilisé notamment pour les codes couleurs des jauges, mais aussi d’une manière générale pour déterminer
// si on est en retard à des moments donnés de la journée.
export function getCompletionRatio (current, target) {
  const todaysRatio = moment().diff(moment().startOf('day'), 'day', true)
  const targetRatio = target > 0 ? current / target : 1

  return todaysRatio > 0 ? targetRatio / todaysRatio : 1
}

// Calcule les totaux de progression et d’objectifs sur la journée, pour déterminer ensuite par exemple
// le taux global de progression, ou le retard potentiel (avec des données résultats permettant de l’affiche
// de façon explicite).
export function getDayCounts (todaysProgress, goals) {
  // Le plus intéressant ici, c'est le parcours unique de la liste en effectuant
  // un `reduce` composite sur deux compteurs : celui de nos progressions, et celui
  // de nos objectifs quotidiens.
  const [totalProgress, totalTarget] = goals.reduce((acc, { id, target }) => {
    acc[0] += todaysProgress[id] || 0
    acc[1] += target
    return acc
  }, [0, 0])

  return [totalProgress, totalTarget]
}
