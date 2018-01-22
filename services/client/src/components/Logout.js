import React from 'react'
import { Link } from 'react-router-dom'

class Logout extends React.Component {
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    this.props.logoutUser()
  }
  render () {
    return (
      <div>
        <p>
          You are now logged out. Click <Link to='/login'>here</Link> to login.
        </p>
      </div>
    )
  }
}

export default Logout
