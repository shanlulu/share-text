import React from 'react';
import ReactDOM from 'react-dom';
import Register from './Register.js';
import Login from './Login.js';
import DocLibrary from './DocLibrary.js';
import DocEditor from './Editor.js';
import { BrowserRouter, Link, Route } from 'react-router-dom';
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
    // axios.get(dbUrl)
    // .then((todoItems) => {
    //   this.setState({documents: todoItems.data});
    // })
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <h5 className="main">Welcome!</h5>
          {/* <Switch> */}
          <Route path="/register" component={Register}/>
          <Route path="/login" component={Login} login={this.state.login}/>
          <Route path="/library" component={DocLibrary} />
          <Route path="/editor" component={DocEditor} />
          {/* </Switch> */}
          {/* {this.state.login ? return ( */}
              <div className="main">
                <Link className="link" to="/login">
                  Log in
                </Link>
                <Link className="link" to="/register">
                  Register
                </Link>
              </div>
            {/* ) : return (<div></div>) } */}
        </div>
      </BrowserRouter>
    )
  }
}

export default MainApp;
