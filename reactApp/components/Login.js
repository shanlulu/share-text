import React from 'react';
import ReactDOM from 'react-dom';
import Register from './Register.js';
import { Link, Route, IndexRoute } from 'react-router-dom';
import { Switch } from 'react-router'

class Login extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div className="body">
          <p className="docHeader">Login!</p>
          <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control registerInput" placeholder="Enter Username"></input>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control registerInput" placeholder="Password"></input>
          </div>
          <button className="saveButton" type="button">Login</button>
          <Link to="/register">
            <button className="saveButton" type="button">
              Not registered?
            </button>
          </Link>
        </div>
        <Route path="/register" component={Register} />
      </div>
    )
  }
}


export default Login;
