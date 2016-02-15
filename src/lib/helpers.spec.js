// Utilitaires (spec)
// ==================

import { expect } from 'chai'
import { formatDate, getCompletionRatio, getDayCounts } from './helpers'
import moment from 'moment'
import sinon from 'sinon'

describe('formatDate', () => {
  const sandbox = sinon.sandbox.create()

  afterEach(() => {
    sandbox.restore()
  })

  it('should render today properly', () => {
    const today = new Date()
    expect(formatDate(today)).to.equal('Aujourd’hui')
  })

  it('should render yesterday properly', () => {
    const yesterday = moment().subtract(1, 'day').toDate()
    expect(formatDate(yesterday)).to.equal('Hier')
  })

  it('should render the day before yesterday properly', () => {
    const twoDaysAgo = moment().subtract(2, 'days').toDate()
    expect(formatDate(twoDaysAgo)).to.equal('Avant-hier')
  })

  it('should render any other date with a long date form', () => {
    sandbox.useFakeTimers(moment('2016-03-06').valueOf())
    const threeDaysAgo = moment().subtract(3, 'days').toDate()
    expect(formatDate(threeDaysAgo)).to.equal('jeudi 3 mars 2016')
  })

  it('should honor a custom format in French, if provided', () => {
    expect(formatDate(moment('2016-03-06').toDate(), 'LL')).to.equal('6 mars 2016')
  })
})

describe('getCompletionRatio', () => {
  const sandbox = sinon.sandbox.create()

  afterEach(() => {
    sandbox.restore()
  })

  const SIX_HOURS = 6 * 60 * 60 * 1000

  it('should compute the proper values at various moments of the day', () => {
    const clock = sandbox.useFakeTimers(moment('2016-03-06').valueOf())
    // 0h
    expect(getCompletionRatio(0, 24)).to.equal(1)
    expect(getCompletionRatio(3, 24)).to.equal(1)
    // 6h (H-18)
    clock.tick(SIX_HOURS)
    expect(getCompletionRatio(0, 24)).to.equal(0)
    expect(getCompletionRatio(3, 24)).to.equal(0.5)
    expect(getCompletionRatio(6, 24)).to.equal(1)
    expect(getCompletionRatio(9, 24)).to.equal(1.5)
    // 12h (H-12)
    clock.tick(SIX_HOURS)
    expect(getCompletionRatio(0, 24)).to.equal(0)
    expect(getCompletionRatio(3, 24)).to.equal(0.25)
    expect(getCompletionRatio(6, 24)).to.equal(0.5)
    expect(getCompletionRatio(12, 24)).to.equal(1)
    expect(getCompletionRatio(18, 24)).to.equal(1.5)
    // 18h (H-6)
    clock.tick(SIX_HOURS)
    expect(getCompletionRatio(0, 24)).to.equal(0)
    expect(getCompletionRatio(9, 24)).to.equal(0.5)
    expect(getCompletionRatio(18, 24)).to.equal(1)
  })

  it('should automatically return a ratio >= 1 if target is zero', () => {
    expect(getCompletionRatio(0, 0)).to.be.at.least(1)
    expect(getCompletionRatio(3, 0)).to.be.at.least(1)
  })
})

describe('getDayCounts', () => {
  const goals = [
    { id: 0, target: 10 },
    { id: 1, target: 5 },
    { id: 2, target: 27 }
  ]

  it('should properly compute totals on full progress info', () => {
    expect(getDayCounts({ 0: 1, 1: 2, 2: 3 }, goals)).to.deep.equal([6, 42])
  })

  it('should properly compute totals on partial progress info', () => {
    expect(getDayCounts({ 0: 1, 2: 3 }, goals)).to.deep.equal([4, 42])
  })

  it('should properly compute zero totals on empty progress info', () => {
    expect(getDayCounts({}, goals)).to.deep.equal([0, 42])
  })

  it('should properly compute zero totals on empty goals', () => {
    expect(getDayCounts({}, [])).to.deep.equal([0, 0])
    expect(getDayCounts({ 0: 1, 1: 2, 2: 3 }, [])).to.deep.equal([0, 0])
  })
})
