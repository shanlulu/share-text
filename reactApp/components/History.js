var React = require('react');
var ReactDOM = require('react-dom');
import DocEditor from './Editor.js'
import {
  Editor,
  EditorState,
  SelectionState,
  RichUtils,
  DefaultDraftBlockRenderMap,
  getDefaultKeyBinding,
  KeyBindingUtil,
  ContentState,
  convertFromRaw,
  convertToRaw,
  createWithContent,
  Modifier
} from 'draft-js';
import { Link, Route, Redirect } from 'react-router-dom'
import axios from 'axios'

class History extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      doc: {},
      history: [],
      current: '',
      old: 'Select a saved version of this document to compare',
      index: -1
    }
  }

  componentDidMount() {
    axios({
      method: 'post',
      url: 'http://localhost:3000/getdoc',
      data: {
        id: this.props.match.params.docId
      }
    })
    .then(response => {
      this.setState({
        doc: response.data,
        history: response.data.history,
        current: response.data.content
      })
    })
    .catch(err => {
      console.log("Error catching too many users", err)
    })
  }

  select(log, i) {
    this.setState({old: log.text, index: i})
  }

  restore(index) {
    console.log("AT ", this.state.history[index])
    axios({
      method: 'post',
      url: 'http://localhost:3000/version',
      data: {
        id: this.state.doc._id,
        log: this.state.history[index],
        content: this.state.doc.content
      }
    })
    .then(response => {
      console.log('DID IT')
    })
    .catch(err => {
      console.log("DIDN'T", err)
    })
  }

  render() {
    var time = new Date().toDateString() + ' @ ' + new Date().toLocaleTimeString();
    return (
      <div>
        <div style={{ margin: "20px" }} className="body">
          <p className="docHeader">Document History: {this.state.doc.title}</p>

          <p className="docID">Document ID: {this.state.doc._id}</p>
          <p className="docID">As of {time}</p>
          <div className="bigBox">
            <div className="editContainer">
              <div className="editBox">
                <p className="libraryHeader">Current Doc</p>
                <p className="docID">{this.state.current}</p>
                {/* <Editor
                  customStyleMap={styleMap}
                  editorState={this.state.editorState}
                  onChange={this.onChange}
                  placeholder="Enter your text below"
                  blockRenderMap={extendedBlockRenderMap}
                  keyBindingFn={keyBindingFn}
                  handleKeyCommand={this.handleKeyCommand}
                  readOnly="true"
                /> */}
              </div>
              <div className="editBox">
                <p className="libraryHeader">Saved Doc</p>
                <p className="docID">{this.state.old}</p>
                {/* <Editor
                  customStyleMap={styleMap}
                  editorState={this.state.editorState}
                  onChange={this.onChange}
                  placeholder="Enter your text below"
                  blockRenderMap={extendedBlockRenderMap}
                  keyBindingFn={keyBindingFn}
                  handleKeyCommand={this.handleKeyCommand}
                  readOnly="true"
                /> */}
              </div>
            </div>
            <div className="histContainer">
              <div className="editBox scrollmenu">
                <p className="libraryHeader">Save Logs</p>
                {
                  this.state.history.map((log, i) => {
                    return (
                      <div key={i} className="log" onClick={() => this.select(log, i)}>
                        <text className="docID" style={{color: '#94B0DA'}}>{"Revision " + (i+1)}</text><br/>
                        <text className="docID">{log.date.slice(0, 10)}</text><br/>
                        <text className="docID">{log.time}</text>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          {/* <div className="editor">
            <Editor
              customStyleMap={styleMap}
              editorState={this.state.editorState}
              onChange={this.onChange}
              placeholder="Enter your text below"
              blockRenderMap={extendedBlockRenderMap}
              keyBindingFn={keyBindingFn}
              handleKeyCommand={this.handleKeyCommand}
            />
          </div> */}
          <Link to={"/editor/"+this.state.doc._id} onClick={() => this.restore(this.state.index)}>
            <button type="button" className="backButton">
              Restore History
            </button>
          </Link>
          <Link to={"/editor/"+this.state.doc._id}>
            <button type="button" className="backButton">
              Back to Document Editor
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

export default History;
