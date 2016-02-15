import chai, { expect } from 'chai'
import createChaiEnzyme from 'chai-enzyme'
import dirtyChai from 'dirty-chai'
import enzymeToJSON from 'enzyme-to-json'
import jestExpect from 'jest-matchers'
import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up'
import ContentAdd from 'material-ui/svg-icons/content/add'

import Gauge from './Gauge'
import GoalTrackerWidget from './GoalTrackerWidget'

chai.use(createChaiEnzyme()).use(sinonChai).use(dirtyChai)

describe('<GoalTrackerWidget />', () => {
  const goal = { id: 0, name: 'My goal', target: 42, units: 'wombats' }

  describe('when not completed', () => {
    it('should render appropriately', () => {
      for (const progress of [0, 1, 21, 41]) {
        const wrapper = shallow(<GoalTrackerWidget goal={goal} progress={progress} />)

        expect(wrapper.find('h2')).to.have.text(goal.name)
        expect(wrapper).to.contain(<Gauge value={progress} max={goal.target} />)
        expect(wrapper).to.contain.text(`${progress} ${goal.units} sur ${goal.target}`)
        expect(wrapper).to.contain(<ContentAdd />)
      }
    })

    it('should trigger its onProgress on click', () => {
      const progress = 21
      const onProgress = sinon.spy()
      const wrapper = shallow(<GoalTrackerWidget goal={goal} progress={progress} onProgress={onProgress} />)

      wrapper.find('FloatingActionButton').simulate('click')
      expect(onProgress).to.have.been.calledOnce()
    })

    it('should otherwise match the expected snapshot', () => {
      const mock = sinon.useFakeTimers()
      try {
        const wrapper = shallow(<GoalTrackerWidget goal={goal} progress={21} />)

        jestExpect(enzymeToJSON(wrapper)).toMatchSnapshot()
      } finally {
        mock.restore()
      }
    })
  })

  describe('when completed (or exceeded)', () => {
    it('should render appropriately', () => {
      for (const progress of [goal.target, goal.target + 1, goal.target + 10]) {
        const wrapper = shallow(<GoalTrackerWidget goal={goal} progress={progress} />)

        expect(wrapper).not.to.contain(<ContentAdd />)
        expect(wrapper).to.contain(<ActionThumbUp />)
      }
    })

    it('should otherwise match the expected snapshot', () => {
      const mock = sinon.useFakeTimers()
      try {
        const wrapper = shallow(<GoalTrackerWidget goal={goal} progress={42} />)

        jestExpect(enzymeToJSON(wrapper)).toMatchSnapshot()
      } finally {
        mock.restore()
      }
    })
  })
})
