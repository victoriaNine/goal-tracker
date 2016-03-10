// Réinitialisation quotidienne
// ============================

// Les progrès du jour sont réinitialisés tous les soirs à minuit,
// après avoir été ajoutés à l’historique.  Par ailleurs, lorsque
// l’application se  lance, si la journée “en cours” dans l’état
// global est désormais passée, une historisation est immédiatement
// déclenchée.
//
// C’est en fait le *reducer* consolidé qui fait tout le boulot
// côté données : ce module est surtout charger de déclencher
// (`store.dispatch(…)`) la bonne action (`CLOSE_DAY`) au bon
// moment, et de notifier l’utilisateur.

import moment from 'moment'

import clockIcon from '../icons/clock-reset.png'
import { closeDay } from '../action-creators'
import { getCompletionRatio, getDayCounts } from '../lib/helpers'
import lateIcon from '../icons/reminder-late.png'
import okayishIcon from '../icons/reminder-okayish.png'
import superLateIcon from '../icons/reminder-super-late.png'
import store from '../store'

// Activation du vérificateur d'historisation et de rappels à des moments précis de la journée
const clock = setInterval(checkClock, 1000)
let permissionGranted = false

// 1. On vérifie si on a la permission d’afficher des notifications
//    système (et sinon, on la (re)demande).
checkForPermissions()
// 2. On vérifie si on n’a pas déjà les progrès d’une journée désormais
//    passée dans l’état global, auquel cas il faut commencer par
//    l’historiser.
checkForTodaysFirstUse()

if (module.hot) {
  module.hot.accept()
  // Le HMR sur ce module doit prendre soin d’annuler l’intervalle de
  // vérification en vigueur, puisque l’initialisation de la nouvelle
  // version du module va en ré-inscrire un tout de suite.
  module.hot.dispose(() => {
    clearInterval(clock)
  })
}

// En production, on réinitialise à minuit.
// En développement, 10 secondes après le chargement, c’est plus
// pratique pour les tests interactifs…
const HISTORY_TRIGGER_TIME = process.env.NODE_ENV === 'production'
  ? '00:00:00'
  : moment().add(10, 'seconds').format('HH:mm:ss')

// À des heures précises (12h, 18h, 21h, 23h) l’appli fait le point sur
// la progression générale et, le cas échéant, affichera un rappel si on
// est plus ou moins à la bourre.
//
// En développement, on fait ça 5 secondes après le chargement.
const REMINDER_TIMES = process.env.NODE_ENV === 'production'
  ? ['12:00:00', '18:00:00', '21:00:00', '23:00:00']
  : [moment().add(5, 'seconds').format('HH:mm:ss')]

// Vérification des échéances
// --------------------------

// Quand la webapp est ouverte, on vérifie chaque seconde si on a atteint
// une échéance de réinitialisation ou de rappel.  Si tel est le cas, on agit.
function checkClock () {
  const now = moment().format('HH:mm:ss')

  if (now === HISTORY_TRIGGER_TIME) {
    closePreviousDay()
  }

  if (permissionGranted && REMINDER_TIMES.includes(now)) {
    notifyReminder()
  }
}

// Permission de notifier
// ----------------------

// Le recours aux [notifications](https://developer.mozilla.org/fr/docs/Web/API/notification/Using_Web_Notifications)
// “système” n’est pas automatiquement
// possible : l’utilisateur doit nous l’avoir accordé.  Au démarrage
// de la webapp, quand ce module est initialisé, on vérifie si on
// la permission, et si tel n’est pas le cas, on la redemande. Le
// résultat est stocké comme booléen dans `permissionGranted`.
function checkForPermissions () {
  if (typeof window === 'undefined' || !window.Notification) {
    return
  }

  permissionGranted = window.Notification.permission === 'granted'
  if (!permissionGranted) {
    window.Notification.requestPermission((status) => {
      permissionGranted = status === 'granted'
    })
  }
}

// Historisation au démarrage
// --------------------------

// Au démarrage de la webapp, quand ce module est initialisé, on
// vérifie si la journée “en cours” de l’état central n’est pas
// passée, ce qui veut dire que la webapp n’était pas ouverte à
// minuit cette journée-là, et que l’historisation reste à faire;
// On la déclenche donc.
function checkForTodaysFirstUse () {
  const storesLastDay = store.getState().today
  if (storesLastDay && moment(storesLastDay).isBefore(moment(), 'day')) {
    closePreviousDay()
  }
}

// Fonctions utilitaires
// ---------------------

// Déclenchement de l’historisation auprès du *store* central,
// et notification si on en a le droit.
function closePreviousDay () {
  store.dispatch(closeDay())

  notify({
    title: 'Fin de journée !',
    text: 'Vos objectifs ont été historisés et repartent à zéro.',
    // Remarquez qu’ici `clockIcon` est en fait une URL, obtenue
    // via l’`import` grâce aux
    // [`url-loader`](https://github.com/webpack/url-loader) et
    // [`file-loader`](https://github.com/webpack/file-loader) de
    // Webpack.  Si le PNG correspondant faisait moins de 10Ko,
    // il aurait même était injecté sous forme base64 plutôt que
    // comme un fichier distinct, économisant une requête HTTP.
    icon: clockIcon,
    secondsVisible: 4
  })
}

// Notification générique avec fermeture automatique.
function notify ({ title, text, icon, secondsVisible = 0 }) {
  if (!permissionGranted) {
    return
  }

  const notif = new window.Notification(title, { body: text, tag: 'goal-tracker', icon })
  if (secondsVisible > 0) {
    notif.addEventListener('show', () => {
      setTimeout(() => notif.close(), secondsVisible * 1000)
    })
  }
}

// Notification de retard à contenu variable.
function notifyReminder () {
  const { todaysProgress, goals } = store.getState()
  const [totalProgress, totalTarget] = getDayCounts(todaysProgress, goals)
  const ratio = getCompletionRatio(totalProgress, totalTarget)

  if (ratio >= 0.9) {
    return
  }

  let title = 'Tu es un peu à la bourre…'
  let icon = okayishIcon

  if (ratio < 0.5) {
    title = 'Tu es super à la bourre !'
    icon = superLateIcon
  } else if (ratio < 0.75) {
    title = 'Tu es à la bourre…'
    icon = lateIcon
  }

  notify({
    title,
    text: `Il te reste ${totalTarget - totalProgress} tâches (sur ${totalTarget}) à accomplir aujourd’hui.`,
    icon,
    secondsVisible: 8
  })
}
