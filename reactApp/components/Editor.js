var React = require('react');
var ReactDOM = require('react-dom');
import DocLibrary from './DocLibrary.js'
import {
  Editor,
  EditorState,
  RichUtils,
  DefaultDraftBlockRenderMap,
  getDefaultKeyBinding,
  KeyBindingUtil,
  ContentState,
  convertFromRaw,
  convertToRaw,
  createWithContent
} from 'draft-js';
import Immutable from 'immutable'
import { Link, Route } from 'react-router-dom'
import axios from 'axios'

const { hasCommandModifier } = KeyBindingUtil;

function keyBindingFn(e: SyntheticKeyboardEvent): string {
  if (e.keyCode === 66 && hasCommandModifier(e)) {
    return 'bold';
  } else if (e.keyCode === 73 && hasCommandModifier(e)) {
    return 'italicize';
  } else if (e.keyCode === 85 && hasCommandModifier(e)) {
    return 'underline';
  } else if (e.keyCode === 37 && hasCommandModifier(e)) {
    return 'leftAlign';
  } else if (e.keyCode === 39 && hasCommandModifier(e)) {
    return 'rightAlign';
  }
  return getDefaultKeyBinding(e);
}

const styleMap = {
  'SIZE_10': {
    fontSize: 10
  },
  'SIZE_12': {
    fontSize: 12
  },
  'SIZE_16': {
    fontSize: 16
  },
  'SIZE_20': {
    fontSize: 20
  },
  'SIZE_24': {
    fontSize: 24
  },
  'SIZE_48': {
    fontSize: 48
  },
  'BLACK': {
    color: 'black'
  },
  'RED': {
    color: 'red'
  },
  'ORANGE': {
    color: 'orange'
  },
  'YELLOW': {
    color: 'yellow'
  },
  'GREEN': {
    color: 'green'
  },
  'BLUE': {
    color: 'blue'
  },
  'PURPLE': {
    color: 'purple'
  },
  'HIGHLIGHT': {
    backgroundColor: '#fff493'
  }
}

const blockRenderMap = Immutable.Map({
  'ALIGN_LEFT': {
    wrapper: <div className='left' />
  },
  'ALIGN_CENTER': {
    wrapper: <div className='center' />
  },
  'ALIGN_RIGHT': {
    wrapper: <div className='right' />
  }
})

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

class DocEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      doc: {},
      socket: io('http://localhost:3000')
    };
    this.onChange = (editorState) => {
      console.log('SELECTION', this.state.editorState.getSelection());
      // if (this.previousHighlight)
      // highlightStyle
      // acceptSelection
      //
      const rawContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
      this.state.socket.emit('change', rawContent);
      this.setState({editorState});
      this.state.socket.emit('newEdit', editorState);
    }
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  componentWillMount() {

    this.state.socket.on('connect', () => {
      console.log('Connect Editor');
    });

    this.state.socket.on('errorMessage', message => {
      alert('There was an error connecting!', message)
    });
    axios({
      method: 'get',
      url: 'http://localhost:3000/checkuser'
    })
    .then(user => {
      var name = '@' + user.data.username;
      axios({
        method: 'post',
        url: 'http://localhost:3000/getdoc',
        data: {
          id: this.props.match.params.docId
        }
      })
      .then(response => {
        console.log(response.data)
        this.setState({doc: response.data})
        this.state.socket.emit('username', name);
        this.state.socket.emit('room', response.data._id);
        this.setEditorContent(response.data.content)
      })
    })
    .catch(err => {
      console.log("Error fetching user", err)
    })
  }

  componentDidMount() {

    var highlight = window.getSelection();
    this.state.socket.emit('highlight', highlight);

    this.state.socket.on('message', data => {
      let newMsg= data.username + ' joined room ' + data.content
      console.log(newMsg)
    })

    this.state.socket.on('change', data => {
      console.log('CHANGE DATA', data);
      this.setEditorContent(data.rawContent);
    })

    this.state.socket.on('highlight', data => {
      console.log('EDITOR HIGHLIGHT', data);
    })


    // setInterval(() => {
    //   var selObj = window.getSelection();
    //   window.alert(selObj);
    // }, 9000);
    this.state.socket.on('newEdit', content => {
      console.log('NEW EDIT: ', content);
      this.setState({ editor})
    });
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

  _onHighlight() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      "HIGHLIGHT"
    ));
  }

  handleKeyCommand(command: string): DraftHandleValue {
    if (command === 'bold') {
      this.onChange(RichUtils.toggleInlineStyle(
        this.state.editorState,
        "BOLD"
      ));
      return 'handled';
    } else if (command === 'italicize') {
      this.onChange(RichUtils.toggleInlineStyle(
        this.state.editorState,
        "ITALIC"
      ));
      return 'handled';
    } else if (command === 'underline') {
      this.onChange(RichUtils.toggleInlineStyle(
        this.state.editorState,
        "UNDERLINE"
      ));
      return 'handled';
    } else if (command === 'leftAlign') {
      this.onChange(RichUtils.toggleBlockType(
        this.state.editorState,
        "ALIGN_LEFT"
      ));
      return 'handled';
    } else if (command === 'rightAlign') {
      this.onChange(RichUtils.toggleBlockType(
        this.state.editorState,
        "ALIGN_RIGHT"
      ));
      return 'handled';
    }
    return 'not-handled';
  }

  saveEditorContent() {
    const rawDraftContentState = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    console.log('RAW', rawDraftContentState);
    axios({
      method: 'post',
      url: 'http://localhost:3000/savedoc',
      data: {
        id: this.state.doc._id,
        content: rawDraftContentState
      }
    })
    .then(updatedDoc => {
      console.log('SAVED', updatedDoc)
      this.setState({doc: updatedDoc.data})
    })
  }

  setEditorContent (rawDraftContentState) {
    console.log('RAW', rawDraftContentState);
    const contentState = convertFromRaw(JSON.parse(rawDraftContentState));
    const editorState = EditorState.createWithContent(contentState);
    this.setState({ editorState });
  }

  render() {
    return (
      <div>
        <div style={{ margin: "20px" }} className="body">
          <p className="docHeader">Edit your doc: {this.state.doc.title}</p>

          <p className="docID">Document ID: {this.state.doc._id}</p>
          <button type="button" className="shareButton">Share Document</button><br></br>
          <button type="button" className="saveButton" onClick={this.saveEditorContent.bind(this)}>Save Changes</button>
          <div className="toolbar">
            <span title="Change Text Size">
              <button
                className="styleButton glyphicon glyphicon-text-size"
                type="button"
                onChange={this._onFontSizeClick.bind(this)}>
                <select id="textSizePicker" className="drop" defaultValue="12">
                  <option value="10">10</option>
                  <option value="12">12</option>
                  <option value="16">16</option>
                  <option value="20">20</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
                </select>
              </button>
            </span>
            <span title="Change Text Color">
              <button
                className="styleButton glyphicon glyphicon-tint"
                type="button"
                onChange={this._onColorClick.bind(this)}>
                <select id="textColorPicker" className="drop" defaultValue="black">
                  <option value="black">black</option>
                  <option value="red">red</option>
                  <option value="orange">orange</option>
                  <option value="yellow">yellow</option>
                  <option value="green">green</option>
                  <option value="blue">blue</option>
                  <option value="purple">purple</option>
                </select>
              </button>
            </span>
            <span title="Bold"><button className="styleButton" type="button" onClick={this._onBoldClick.bind(this)}><span className="glyphicon glyphicon-bold"></span></button></span>
            <span title="Italicize"><button className="styleButton" type="button" onClick={this._onItalicClick.bind(this)}><span className="glyphicon glyphicon-italic"></span></button></span>
            <span title="Underline"><button className="styleButton" type="button" onClick={this._onUnderlineClick.bind(this)}><span className="glyphicon glyphicon-text-color"></span></button></span>
            <span title="Align Left"><button className="styleButton" type="button" onClick={this._onLeftAlignClick.bind(this)}><span className="glyphicon glyphicon-align-left"></span></button></span>
            <span title="Align Center"><button className="styleButton" type="button" onClick={this._onCenterAlignClick.bind(this)}><span className="glyphicon glyphicon-align-center"></span></button></span>
            <span title="Align Right"><button className="styleButton" type="button" onClick={this._onRightAlignClick.bind(this)}><span className="glyphicon glyphicon-align-right"></span></button></span>
            <span title="Bullet List"><button className="styleButton" type="button" onClick={this._onULClick.bind(this)}><span className="glyphicon glyphicon-list"></span></button></span>
            <span title="Numbered List"><button className="styleButton" type="button" onClick={this._onOLClick.bind(this)}><span className="glyphicon glyphicon-sort-by-order"></span></button></span>
            <span title="Highlight"><button className="styleButton" type="button" onClick={this._onHighlight.bind(this)}><span className="glyphicon glyphicon-adjust"></span></button></span>

          </div>
          <div className="editor">
            <Editor
              customStyleMap={styleMap}
              editorState={this.state.editorState}
              onChange={this.onChange}
              placeholder="Enter your text below"
              blockRenderMap={extendedBlockRenderMap}
              keyBindingFn={keyBindingFn}
              handleKeyCommand={this.handleKeyCommand}
            />
          </div>
          <Link to="/library">
            <button type="button" className="backButton">
              Back to Document Library
            </button>
          </Link>
        </div>
        <Route path="/library" component={DocLibrary} />
      </div>
    );
  }
}
export default DocEditor;
