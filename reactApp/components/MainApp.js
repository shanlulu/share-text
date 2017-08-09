import React from 'react';
import ReactDOM from 'react-dom';
import Register from './Register.js';
import Login from './Login.js';
import DocLibrary from './DocLibrary.js';
import DocEditor from './Editor.js';
import LogBar from './LogBar.js';
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

  loginClick() {
    this.setState({login: !this.state.login})
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
          <LogBar loginClick={() => this.loginClick()} login={this.state.login}/>
        </div>
      </HashRouter>
    )
  }
}

export default MainApp;
