import {
  and,
  between,
  integer,
  nonNegativeInteger
} from 'airbnb-prop-types'
import { PropTypes } from 'react'

export { nonNegativeInteger }

export const positiveInteger = and([integer(), between({ gt: 0 })])

export const GoalPropType = PropTypes.shape({
  id: nonNegativeInteger.isRequired,
  name: PropTypes.string.isRequired,
  target: PropTypes.number.isRequired,
  units: PropTypes.string.isRequired
})
