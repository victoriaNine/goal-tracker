import moment from 'moment'

export default function today (state = moment().format('YYYY-MM-DD'), action) {
  return state
}
