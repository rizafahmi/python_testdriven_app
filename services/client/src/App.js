import React from 'react'
import axios from 'axios'
import { Route, Switch } from 'react-router-dom'

import UsersList from './components/UsersList'
import About from './components/About'
import NavBar from './components/NavBar'
import Form from './components/Form'
import Logout from './components/Logout'
import UserStatus from './components/UserStatus'

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
      },
      isAuthenticated: false
    }

    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)
    this.logoutUser = this.logoutUser.bind(this)
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
    const formType = window.location.href.split('/').reverse()[0]
    let data = {
      email: this.state.formData.email,
      password: this.state.formData.password
    }

    if (formType === 'register') {
      data.username = this.state.formData.username
    }
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${formType}`
    axios
      .post(url, data)
      .then(res => {
        this.setState({
          formData: { username: '', password: '', email: '' },
          username: '',
          email: '',
          isAuthenticated: true
        })
        window.localStorage.setItem('authToken', res.data.auth_token)
        this.getUsers()
      })
      .catch(err => console.error(err))
  }
  handleFormChange (event) {
    const { formData } = this.state
    formData[event.target.name] = event.target.value
    this.setState(formData)
  }
  logoutUser () {
    window.localStorage.clear()
    this.setState({ isAuthenticated: false })
  }
  render () {
    return (
      <div>
        <NavBar
          title={this.state.title}
          isAuthenticated={this.state.isAuthenticated}
        />
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
                        handleFormChange={this.handleFormChange}
                        isAuthenticated={this.state.isAuthenticated}
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
                      handleFormChange={this.handleFormChange}
                      isAuthenticated={this.state.isAuthenticated}
                    />
                  )}
                />
                <Route exact path='/about' component={About} />
                <Route
                  exact
                  path='/logout'
                  render={() => (
                    <Logout
                      logoutUser={this.logoutUser}
                      isAuthenticated={this.state.isAuthenticated}
                    />
                  )}
                />
                <Route
                  exact
                  path='/status'
                  render={() => (
                    <UserStatus isAuthenticated={this.state.isAuthenticated} />
                  )}
                />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default App
