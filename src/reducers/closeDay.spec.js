// Historisation quotidienne (spec reducer)
// ========================================

import { expect } from 'chai'
import moment from 'moment'

import { closeDay } from '../../src/action-creators'
import reducer from '../../src/reducers/closeDay'

// Le *reducer* est censé…
describe('Close Day reducer', () => {
  // …historiser la journée courante
  // -------------------------------
  //
  // (calcul des données à historiser, ajout en début d’historique,
  // réinitialisation des données du jour courant)
  it('should properly add the current progressions to the history and reset for a new day', () => {
    const initialState = {
      goals: [
        { id: 1, target: 5 },
        { id: 2, target: 10 },
        { id: 3, target: 15 }
      ],
      history: [
        { date: '2017-02-16', progresses: { 1: [2, 5] } }
      ],
      today: '2017-02-17',
      todaysProgress: { 2: 4, 3: 10 }
    }

    const expectedState = {
      goals: initialState.goals,
      history: [
        { date: initialState.today, progresses: { 2: [4, 10], 3: [10, 15] } },
        ...initialState.history
      ],
      today: moment().format('YYYY-MM-DD'),
      todaysProgress: {}
    }

    expect(reducer(initialState, closeDay()))
      .to.deep.equal(expectedState)
  })
})
