import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login.js';
import { Link, Route, Redirect } from 'react-router-dom';
import { Switch } from 'react-router';
import axios from 'axios'

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      password: '',
      redirect: false
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    axios({
      method: 'post',
      url: 'http://localhost:3000/register',
      data: {
        username: this.state.name,
        password: this.state.password
      }
    })
    .then(response => {
      if (response.status === 200) {
        this.setState({redirect: true})
      }
    })
  }

  handleChangeName(e) {
    this.setState({name: e.target.value})
  }

  handleChangePass(e) {
    this.setState({password: e.target.value})
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/login"/>
    }
    return (
      <div>
        <div className="body">
          <p className="docHeader">Register!</p>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <div className="form-group">
              <label>Username</label>
              <input
                onChange={(e) => this.handleChangeName(e)}
                type="text"
                name="name"
                className="form-control registerInput"
                placeholder="Enter Username"
                value={this.state.name}
                required></input>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                onChange={(e) => this.handleChangePass(e)}
                type="password"
                name="password"
                className="form-control registerInput"
                placeholder="Password"
                value={this.state.password}
                required></input>
            </div>
            <button className="saveButton" type="submit">
              Register
            </button>
          </form>
          <Link to="/login">
            <button className="saveButton" type="button">
              Skip to Login
            </button>
          </Link>
        </div>
        <Route path="/login" component={Login} />
      </div>
    )
  }
}

export default Register;
