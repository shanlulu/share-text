import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login.js';
import { Link, Route, IndexRoute } from 'react-router-dom';
import { Switch } from 'react-router'

class Register extends React.Component {
  constructor(props) {
    super(props)
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div className="body">
          <p className="docHeader">Register!</p>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" name="name" className="form-control registerInput" placeholder="Enter Username"></input>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="name" className="form-control registerInput" placeholder="Password"></input>
            </div>
            <Link to="/login">
              <button className="saveButton" type="button">
                Register
              </button>
            </Link>
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
