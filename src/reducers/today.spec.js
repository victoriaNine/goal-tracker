// Date du jour (spec reducer)
// ===========================

import { expect } from 'chai'
import moment from 'moment'

import reducer from '../../src/reducers/today'

// Le *reducer* est censé…
describe('Today’s date reducer', () => {
  // …fournir son état par défaut
  // ----------------------------
  it('should return its initial state', () => {
    const initialState = undefined
    const expectedState = moment().format('YYYY-MM-DD')

    // On teste toujours que l’état par défaut est bien fourni.  Le plus simple consiste
    // à envoyer un état `undefined` et une action vide, et à vérifier le résultat (ici,
    // la date du jour).
    expect(reducer(initialState, {}))
      .to.equal(expectedState)
  })
})
