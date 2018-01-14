import React from 'react'

const AddUser = props => {
  return (
    <form onSubmit={props.handleAddUser}>
      <div className='form-group'>
        <input
          name='username'
          className='form-control input-lg'
          type='text'
          placeholder='Enter a username'
          required
          value={props.username}
          onChange={props.handleInputChange}
        />
      </div>
      <div className='form-group'>
        <input
          name='email'
          className='form-control input-lg'
          type='email'
          placeholder='Enter your email'
          required
          value={props.email}
          onChange={props.handleInputChange}
        />
      </div>
      <input
        type='submit'
        className='btn btn-warning btn-lg btn-block'
        value='Submit'
      />
    </form>
  )
}

export default AddUser
