import React from 'react';
import ReactDOM from 'react-dom';
import Register from './Register.js';
import Login from './Login.js';
import DocLibrary from './DocLibrary.js';
import DocEditor from './Editor.js'

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
      <div>
        <Register />
        <Login />
        <DocLibrary />
        <DocEditor
          // _onFontSizeClick={this.onFontSizeClick.bind(this)}
          // _onColorClick={this.onColorClick.bind(this)}
          // _onBoldClick={this.onBoldClick.bind(this)}
          // _onItalicClick={this.onItalicClick.bind(this)}
          // _onUnderlineClick={this.onUnderlineClick.bind(this)}
          // _onLeftAlignClick={this.onLeftAlignClick.bind(this)}
          // _onCenterAlignClick={this.onCenterAlignClick.bind(this)}
          // _onRightAlignClick={this.onRightAlignClick.bind(this)}
          // _onULClick={this.onULClick.bind(this)}
          // _onOLClick={this.onOLClick.bind(this)}
        />
      </div>
    )
  }
}

export default MainApp;
