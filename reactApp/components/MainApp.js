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

  _onFontSizeClick() {
    var size = document.getElementById('textSizePicker').value;
    var command;
    if (size === "10") {
      command = 'SIZE_10'
    } else if (size === "12") {
      command = 'SIZE_12'
    } else if (size === "16") {
      command = 'SIZE_16'
    } else if (size === "20") {
      command = 'SIZE_20'
    } else if (size === "24") {
      command = 'SIZE_24'
    } else if (size === "48") {
      command = 'SIZE_48'
    }
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      command
    ));
  }

  _onColorClick() {
    var color = document.getElementById('textColorPicker').value;
    var command;
    if (color === "black") {
      command = 'BLACK'
    } else if (color === "red") {
      command = 'RED'
    } else if (color === "orange") {
      command = 'ORANGE'
    } else if (color === "yellow") {
      command = 'YELLOW'
    } else if (color === "green") {
      command = 'GREEN'
    } else if (color === "blue") {
      command = 'BLUE'
    } else if (color === "purple") {
      command = 'PURPLE'
    }
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      command
    ));
  }

  _onStrikeClick() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'STRIKETHROUGH'
    ));
  }

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      "BOLD"
    ));
  }

  _onUnderlineClick() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      "UNDERLINE"
    ));
  }

  _onItalicClick() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      "ITALIC"
    ));
  }

  _onLeftAlignClick() {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      "ALIGN_LEFT"
    ));
  }

  _onCenterAlignClick() {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      "ALIGN_CENTER"
    ));
  }

  _onRightAlignClick() {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      "ALIGN_RIGHT"
    ));
  }

  _onULClick() {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      'unordered-list-item'
    ));
  }

  _onOLClick() {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      'ordered-list-item'
    ));
  }

  render() {
    return (
      <div>
        <Register />
        <Login />
        <DocLibrary />
        {/* <DocEditor /> */}
      </div>
    )
  }
}

export default MainApp;
