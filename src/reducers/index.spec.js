// Store-level (spec reducer)
// ==========================

import { expect } from 'chai'
import moment from 'moment'

import reducer from '../../src/reducers'

// Le *reducer* est censé…
describe('Store-level reducer', () => {
  // …correctement déléguer l’état par défaut
  // ----------------------------------------
  //
  // On vérifie qu’îl délègue bien à ses *slice reducers* combinés
  // leurs définitions d’état par défaut (on suppose, en tout cas,
  // qu’il procède ainsi pour pondre un état par défaut complet).
  it('should properly accrue its initial state', () => {
    const initialState = undefined
    const expectedState = {
      currentUser: { loginState: 'logged-out' },
      goals: [],
      history: [],
      today: moment().format('YYYY-MM-DD'),
      todaysProgress: {}
    }

    expect(reducer(initialState, {}))
      .to.deep.equal(expectedState)
  })
})
