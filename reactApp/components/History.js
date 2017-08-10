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
import Immutable from 'immutable'
import axios from 'axios'

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

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: {},
      history: [],
      current: EditorState.createEmpty(),
      old: EditorState.createWithContent(ContentState.createFromText('Select a saved version of this document to compare')),
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
      const contentState = convertFromRaw(JSON.parse(response.data.content));
      // console.log('CONTENT STATE', contentState.getPlainText());
      //const editorState = EditorState.createWithContent(contentState);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        doc: response.data,
        history: response.data.history,
        current: editorState
      })
    })
    .catch(err => {
      console.log("Error catching too many users", err)
    })
  }

  select(log, i) {
    const contentState = convertFromRaw(JSON.parse(log.text));
    console.log('OLD STATE', contentState.getPlainText());
    const editorState = EditorState.createWithContent(contentState);
    // this.setState({ current: editorState });
    this.setState({old: editorState, index: i})
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
                {/*<p className="docID">{this.state.current}</p> */}
                <Editor
                  customStyleMap={styleMap}
                  editorState={this.state.current}
                  onChange={(e) => {console.log(e);}}
                  // placeholder="Enter your text below"
                  blockRenderMap={extendedBlockRenderMap}
                  // keyBindingFn={keyBindingFn}
                  // handleKeyCommand={this.handleKeyCommand}
                  readOnly="true"
                />
              </div>
              <div className="editBox">
                <p className="libraryHeader">Saved Doc</p>
                {/* <p className="docID">{this.state.old}</p> */}
                <Editor
                  customStyleMap={styleMap}
                  editorState={this.state.old}
                  onChange={(e) => {console.log(e);}}
                  blockRenderMap={extendedBlockRenderMap}
                  readOnly="true"
                />
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
