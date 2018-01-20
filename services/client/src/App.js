import React from 'react'
import axios from 'axios'
import { Route, Switch } from 'react-router-dom'

import UsersList from './components/UsersList'
import AddUser from './components/AddUser'
import About from './components/About'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      users: [],
      username: '',
      email: ''
    }
  }
  componentDidMount () {
    this.getUsers()
  }
  getUsers () {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then(res => {
        this.setState({
          users: res.data.data.users
        })
      })
      .catch(err => console.log(err))
  }
  handleAddUser (event) {
    event.preventDefault()
    const data = {
      username: this.state.username,
      email: this.state.email
    }
    axios
      .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
      .then(res => {
        this.getUsers()
        this.setState({
          username: '',
          email: ''
        })
      })
      .catch(err => console.log(err))
  }
  handleInputChange (event) {
    const obj = {}
    obj[event.target.name] = event.target.value
    this.setState(obj)
  }
  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-4'>
            <br />
            <Switch>
              <Route
                exact
                path='/'
                render={() => (
                  <div>
                    <h1>All Users</h1>
                    <hr />
                    <br />
                    <AddUser
                      handleAddUser={this.handleAddUser.bind(this)}
                      handleInputChange={this.handleInputChange.bind(this)}
                      username={this.state.username}
                      email={this.state.email}
                    />
                    <br />
                    <UsersList users={this.state.users} />
                  </div>
                )}
              />
              <Route exact path='/about' component={About} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}
export default App
