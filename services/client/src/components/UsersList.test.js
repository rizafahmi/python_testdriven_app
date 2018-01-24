import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import UsersList from './UsersList'

const users = [
  {
    active: true,
    email: 'riza@hacktiv8.com',
    id: 1,
    username: 'riza',
    admin: false
  },
  {
    active: true,
    admin: false,
    email: 'rizafahmi@gmail.com',
    id: 2,
    username: 'rizafahmi'
  }
]

test('UsersList renders properly', () => {
  const wrapper = shallow(<UsersList users={users} />)
  expect(wrapper.find('h1').get(0).props.children).toBe('All Users')

  const element = wrapper.find('tbody > tr')
  expect(element.length).toBe(2)
})

test('UsersList renders a snapshot properly', () => {
  const tree = renderer.create(<UsersList users={users} />).toJSON()
  expect(tree).toMatchSnapshot()
})
