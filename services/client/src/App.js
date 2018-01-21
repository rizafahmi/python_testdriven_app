import React from 'react'
import axios from 'axios'
import { Route, Switch } from 'react-router-dom'

import UsersList from './components/UsersList'
import AddUser from './components/AddUser'
import About from './components/About'
import NavBar from './components/NavBar'
import Form from './components/Form'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      users: [],
      username: '',
      email: '',
      title: 'TestDriven.io',
      formData: {
        username: '',
        email: '',
        password: ''
      }
    }

    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this)
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
      .catch(() => {})
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
  handleUserFormSubmit (event) {
    event.preventDefault()
    console.log('sanity check')
  }
  render () {
    return (
      <div>
        <NavBar title={this.state.title} />
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
                <Route
                  path='/register'
                  render={() => {
                    return (
                      <Form
                        formType={'Register'}
                        formData={this.state.formData}
                        handleUserFormSubmit={this.handleUserFormSubmit}
                      />
                    )
                  }}
                />
                <Route
                  path='/login'
                  render={() => (
                    <Form
                      formType={'Login'}
                      formData={this.state.formData}
                      handleUserFormSubmit={this.handleUserFormSubmit}
                    />
                  )}
                />
                <Route exact path='/about' component={About} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default App
