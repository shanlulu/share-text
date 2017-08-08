import React from 'react';
import ReactDOM from 'react-dom';
import Register from './Register.js';
import DocLibrary from './DocLibrary.js'
import { Link, Route, IndexRoute } from 'react-router-dom';
import { Switch } from 'react-router'

class Login extends React.Component {
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
          <p className="docHeader">Login!</p>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" name="name" className="form-control registerInput" placeholder="Enter Username"></input>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="name" className="form-control registerInput" placeholder="Password"></input>
            </div>
            <Link to="/library">
              <button className="saveButton" type="button">
                Login
              </button>
            </Link>
          </form>
          <Link to="/register">
            <button className="saveButton" type="button">
              Not registered?
            </button>
          </Link>
        </div>
        <Route path="/library" component={DocLibrary} />
        <Route path="/register" component={Register} />
      </div>
    )
  }
}


export default Login;
