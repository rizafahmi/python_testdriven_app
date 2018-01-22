import React from 'react'
import { Redirect } from 'react-router-dom'

const Form = props => {
  if (props.isAuthenticated) {
    return <Redirect to='/' />
  }
  return (
    <div>
      <h1>{props.formType}</h1>
      <form onSubmit={event => props.handleUserFormSubmit(event)}>
        {props.formType === 'Register' && (
          <div className='form-group'>
            <input
              className='form-control input-lg'
              name='username'
              type='text'
              placeholder='Enter a username'
              required
              value={props.formData.username}
              onChange={props.handleFormChange}
            />
          </div>
        )}
        <div className='form-group'>
          <input
            className='form-control input-lg'
            name='email'
            type='email'
            placeholder='Enter an email address'
            required
            value={props.formData.email}
            onChange={props.handleFormChange}
          />
        </div>
        <div className='form-group'>
          <input
            className='form-control input-lg'
            name='password'
            type='password'
            placeholder='Enter a password'
            required
            value={props.formData.password}
            onChange={props.handleFormChange}
          />
        </div>
        <input
          type='submit'
          className='btn btn-warning btn-lg btn-block'
          value='Submit'
        />
      </form>
    </div>
  )
}

export default Form
