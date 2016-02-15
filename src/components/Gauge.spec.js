import chai, { expect } from 'chai'
import createChaiEnzyme from 'chai-enzyme'
import enzymeToJSON from 'enzyme-to-json'
import jestExpect from 'jest-matchers'
import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import Gauge from './Gauge'

chai.use(createChaiEnzyme())

describe('<Gauge />', () => {
  it('should render appropriately', () => {
    const wrapper = shallow(<Gauge value={50} />)

    expect(wrapper).to.have.prop('mode', 'determinate')
    expect(wrapper).to.have.prop('max', 100)
    expect(wrapper).to.have.prop('value', 50)
    expect(wrapper.prop('style')).to.deep.equal({ height: 8 })
  })

  it('should honor custom max', () => {
    const wrapper = shallow(<Gauge value={50} max={75} />)

    expect(wrapper).to.have.prop('max', 75)
  })

  it('should otherwise match the expected snapshot', () => {
    const mock = sinon.useFakeTimers()
    try {
      const wrapper = shallow(<Gauge value={50} />)

      jestExpect(enzymeToJSON(wrapper)).toMatchSnapshot()
    } finally {
      mock.restore()
    }
  })
})
