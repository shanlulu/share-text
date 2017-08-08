import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Route, Redirect } from 'react-router-dom';
import { Switch } from 'react-router';
import axios from 'axios';

class LogBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loginClick: props.loginClick
    }
  }

  componentDidUpdate() {
    axios({
      method: 'get',
      url: 'http://localhost:3000/checkuser'
    })
    .then(response => {
      // console.log('r', response.data)
      if (response.data && !this.props.login) {
        // console.log('in')
        this.state.loginClick();
      }
    })
  }

  handle() {
    axios({
      method: 'get',
      url: 'http://localhost:3000/logout'
    })
    .then(response => {
      // console.log(this.props.login)
      if (this.props.login) {
        // console.log('out')
        this.state.loginClick();
      }
    })
  }

  render() {
    return (
      <div className="main">
        {
          (!this.props.login)
          ? <div>
            <Link className="link" to="/login">
              Log in
            </Link>
            <Link className="link" to="/register">Register</Link>
          </div>
          : <Link onClick={() => this.handle()} className="link" to="/logout">
              Logout
            </Link>
        }
      </div>
    )
  }
}

export default LogBar
