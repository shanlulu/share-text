import React from 'react';
import ReactDOM from 'react-dom';
import Register from './Register.js';
import Login from './Login.js';
import DocLibrary from './DocLibrary.js';
import DocEditor from './Editor.js';
import { HashRouter, Link, Route } from 'react-router-dom';
import { Switch } from 'react-router'

import axios from 'axios';

class MainApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      login: false
    }
  }

  componentDidMount() {
    axios({
      method: 'get',
      url: 'http://localhost:3000/checkuser'
    })
    .then(response => {
      console.log(response)
      if (response.data) {
        var login = true;
        this.setState({login: login})
      }
    })
  }

  render() {
    return (
      <HashRouter>
        <div>
          <h5 className="main">Welcome!</h5>
          <Switch>
            <Route path="/register" component={Register}/>
            <Route path="/login" component={Login}/>
            <Route path="/logout" component={Login}/>
            <Route path="/library" component={DocLibrary}/>
            <Route path="/editor/:docId" component={DocEditor}/>
          </Switch>
          <div className="main">
            <Link className="link" to="/login">Log in</Link>
            <Link className="link" to="/register">Register</Link>
            <Link className="link" to="/logout">Logout</Link>
            {/* {
              (!this.state.login)
              ? <div><Link className="link" to="/login">Log in</Link><Link className="link" to="/register">Register</Link></div>
              : <div><Link className="link" to="/logout">Logout</Link></div>
            } */}
          </div>
        </div>
      </HashRouter>
    )
  }
}

export default MainApp;
