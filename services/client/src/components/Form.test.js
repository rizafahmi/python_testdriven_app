import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import Form from './Form'

const formData = {
  username: '',
  email: '',
  password: ''
}

test('Register form renders properly', () => {
  const component = <Form formType={'Register'} formData={formData} />
  const wrapper = shallow(component)
  const h1 = wrapper.find('h1')
  expect(h1.length).toBe(1)
  expect(h1.get(0).props.children).toBe('Register')

  const formGroup = wrapper.find('.form-group')
  expect(formGroup.length).toBe(3)
  expect(formGroup.get(0).props.children.props.name).toBe('username')
  expect(formGroup.get(0).props.children.props.value).toBe('')
})

test('Login form renders properly', () => {
  const component = <Form formType={'Login'} formData={formData} />
  const wrapper = shallow(component)
  const h1 = wrapper.find('h1')
  expect(h1.length).toBe(1)
  expect(h1.get(0).props.children).toBe('Login')

  const formGroup = wrapper.find('.form-group')
  expect(formGroup.length).toBe(2)
  expect(formGroup.get(0).props.children.props.name).toBe('email')
  expect(formGroup.get(0).props.children.props.value).toBe('')
})

test('Registered user redirect properly', () => {
  const component = (
    <Form formType={'Register'} formData={formData} isAuthenticated />
  )
  const wrapper = shallow(component)
  expect(wrapper.find('Redirect')).toHaveLength(1)
})

test('Login user redirect properly', () => {
  const component = (
    <Form formType={'Login'} formData={formData} isAuthenticated />
  )
  const wrapper = shallow(component)
  expect(wrapper.find('Redirect')).toHaveLength(1)
})

test('Register form submit properly', () => {
  const testValue = {
    formType: 'Register',
    formData: {
      username: '',
      email: '',
      password: ''
    },
    handleUserFormSubmit: jest.fn(),
    handleFormChange: jest.fn(),
    isAuthenticated: false
  }
  const wrapper = shallow(<Form {...testValue} />)
  const input = wrapper.find('input[type="text"]')
  expect(testValue.handleFormChange).toHaveBeenCalledTimes(0)
  input.simulate('change')
  expect(testValue.handleFormChange).toHaveBeenCalledTimes(1)
  expect(testValue.handleUserFormSubmit).toHaveBeenCalledTimes(0)
  wrapper.find('form').simulate('submit', testValue.formData)
  expect(testValue.handleUserFormSubmit).toHaveBeenCalledWith(
    testValue.formData
  )
  expect(testValue.handleUserFormSubmit).toHaveBeenCalledTimes(1)
})

test('Login form submit properly', () => {
  const testValue = {
    formType: 'Login',
    formData: {
      email: '',
      password: ''
    },
    handleUserFormSubmit: jest.fn(),
    handleFormChange: jest.fn(),
    isAuthenticated: false
  }
  const wrapper = shallow(<Form {...testValue} />)
  const input = wrapper.find('input[type="email"]')
  expect(testValue.handleFormChange).toHaveBeenCalledTimes(0)
  input.simulate('change')
  expect(testValue.handleFormChange).toHaveBeenCalledTimes(1)
  expect(testValue.handleUserFormSubmit).toHaveBeenCalledTimes(0)
  wrapper.find('form').simulate('submit', testValue.formData)
  expect(testValue.handleUserFormSubmit).toHaveBeenCalledWith(
    testValue.formData
  )
  expect(testValue.handleUserFormSubmit).toHaveBeenCalledTimes(1)
})

test('Register snapshot', () => {
  const component = <Form formType={'Register'} formData={formData} />
  const tree = renderer.create(component).toJSON()
  expect(tree).toMatchSnapshot()
})

test('Login snapshot', () => {
  const component = <Form formType={'Login'} formData={formData} />
  const tree = renderer.create(component).toJSON()
  expect(tree).toMatchSnapshot()
})
