import moment from 'moment'

moment.locale('fr')

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

export function getCompletionRatio (current, target) {
  const todaysRatio = moment().diff(moment().startOf('day'), 'day', true)
  const targetRatio = target > 0 ? current / target : 1

  return todaysRatio > 0 ? targetRatio / todaysRatio : 1
}

export function getDayCounts (todaysProgress, goals) {
  const [totalProgress, totalTarget] = goals.reduce((acc, { id, target }) => {
    acc[0] += todaysProgress[id] || 0
    acc[1] += target
    return acc
  }, [0, 0])

  return [totalProgress, totalTarget]
}
