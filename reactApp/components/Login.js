import React from 'react';
import ReactDOM from 'react-dom';
import Register from './Register.js';
import DocLibrary from './DocLibrary.js'
import { Link, Route, Redirect } from 'react-router-dom';
import { Switch } from 'react-router';
import axios from 'axios';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      password: '',
      redirect: false,
      valid: true
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    axios({
      method: 'post',
      url: 'http://localhost:3000/login',
      data: {
        username: this.state.name,
        password: this.state.password
      }
    })
    .then(response => {
      if (response.data === "SUCCESS") {
        // this.props.login = true;
        this.setState({redirect: true, valid: true})
      } else {
        this.setState({valid: false})
      }
    })
    .catch(err => {
      this.setState({valid: false})
      console.log('Error logging in', err)
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
      return <Redirect to="/library" />
    }
    return (
      <div>
        <div className="body">
          <p className="docHeader">Login!</p>
          {(!this.state.valid) ? <p className="error">Invalid Login</p> : null}
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
              Login
            </button>
          </form>
          <Link to="/register">
            <button className="saveButton" type="button">
              Not registered?
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Login;
