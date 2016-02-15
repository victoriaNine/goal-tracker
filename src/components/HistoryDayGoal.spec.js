import chai, { expect } from 'chai'
import createChaiEnzyme from 'chai-enzyme'
import dirtyChai from 'dirty-chai'
import enzymeToJSON from 'enzyme-to-json'
import jestExpect from 'jest-matchers'
import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import HistoryDayGoal from '../../src/components/HistoryDayGoal'

chai.use(createChaiEnzyme()).use(sinonChai).use(dirtyChai)

describe('<HistoryDayGoal />', () => {
  const goal = { id: 0, name: 'Demo goal', target: 5, units: 'wombats' }

  it('should use proper stats propTypes', () => {
    checkFailPropType(
      'stats in HistoryDayGoal must be an array.',
      () => <HistoryDayGoal goal={goal} />
    )
    checkFailPropType(
      'stats in HistoryDayGoal must be a pair of integers.',
      () => <HistoryDayGoal goal={goal} stats={[42]} />
    )
    checkFailPropType(
      'stats in HistoryDayGoal must start with a non-negative progress value.',
      () => <HistoryDayGoal goal={goal} stats={[-1, 10]} />
    )
    checkFailPropType(
      'stats in HistoryDayGoal must end with a positive target value.',
      () => <HistoryDayGoal goal={goal} stats={[0, 0]} />
    )
  })

  it('should otherwise match the expected snapshot', () => {
    const mock = sinon.useFakeTimers()
    try {
      const wrapper = shallow(<HistoryDayGoal goal={goal} stats={[2, 5]} />)

      jestExpect(enzymeToJSON(wrapper)).toMatchSnapshot()
    } finally {
      mock.restore()
    }
  })
})

function checkFailPropType (message, block) {
  const cErr = sinon.stub(console, 'error')
  try {
    block()
    expect(cErr).to.have.been.calledWith(sinon.match(
      new RegExp(`Failed prop type: ${message.replace(/[\].*+?(){}[]/g, '\\$&')}`)
    ))
  } finally {
    cErr.restore()
  }
}
