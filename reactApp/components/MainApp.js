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
  }

  componentDidMount() {
    // axios.get(dbUrl)
    // .then((todoItems) => {
    //   this.setState({documents: todoItems.data});
    // })
  }

  handleSubmit(e) {
    e.preventDefault();
    // this.setState({
    //   items: this.state.items.concat({
    //     text: this.state.text,
    //     completed: false,
    //     _id: this.state.text + Date.now()
    //   }),
    //   text: ''
    // }, () => {
    //   axios.post(dbUrl+'/add', {
    //     todoItem: this.state.items[this.state.items.length - 1]
    //   })
    //   .then((response) => {
    //     console.log("success posting")
    //   })
    //   .catch((error) => {
    //     console.log("error posting")
    //   })
    // })
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <h5 className="main">Welcome!</h5>
          <Switch>
            <Route path="/register" component={Register}/>
            <Route path="/login" component={Login} />
          </Switch>
          <div className="main">
            <Link className="link" to="/login">
              Log in
            </Link>
            <Link className="link" to="/register">
              Register
            </Link>
          </div>
        </div>
      </BrowserRouter>
    )
  }
}

export default MainApp;
