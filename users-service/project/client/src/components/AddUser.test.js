import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import AddUser from './AddUser'

test('AddUser renders properly', () => {
  const wrapper = shallow(<AddUser />)
  const element = wrapper.find('form')
  const input = element.find('input')
  expect(input.length).toBe(3)
  expect(input.get(0).props.name).toBe('username')
  expect(input.get(1).props.name).toBe('email')
  expect(input.get(2).props.type).toBe('submit')
})
test('AddUser renders a snapshot properly', () => {
  const tree = renderer.create(<AddUser />).toJSON()
  expect(tree).toMatchSnapshot()
})
