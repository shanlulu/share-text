var React = require('react');
var ReactDOM = require('react-dom');
import DocLibrary from './DocLibrary.js'
import History from './History.js'
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
  Modifier,
  CompositeDecorator
} from 'draft-js';
import Immutable from 'immutable'
import { Link, Route, Redirect } from 'react-router-dom'
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

const generateDecorator = (highlightTerm) => {
  const regex = new RegExp(highlightTerm, 'g');
  return new CompositeDecorator([{
    strategy: (contentBlock, callback) => {
      if (highlightTerm !== '') {
        findWithRegex(regex, contentBlock, callback);
      }
    },
    component: SearchHighlight,
  }])
};

const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr, start, end;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    end = start + matchArr[0].length;
    callback(start, end);
  }
};

const SearchHighlight = (props) => (
  <span className="highlightText">{props.children}</span>
);

class DocEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      doc: {},
      socket: io('http://localhost:3000'),
      workers: [],
      redirect: false,
      cursor: {
        anchorKey: '',
        anchorOffset: 0,
        focusKey: '',
        focusOffset: 0,
        isBackward: false
      },
      search: ''
    };
    this.onChange = (editorState) => {
      const selectionState = editorState.getSelection();
      if (!selectionState.isCollapsed()) {
        // const anchorKey = selectionState.getAnchorKey();
        // const currentContent = editorState.getCurrentContent();
        // const currentContentBlock = currentContent.getBlockForKey(anchorKey);
        // const start = selectionState.getStartOffset();
        // const end = selectionState.getEndOffset();
        // const selectedText = currentContentBlock.getText().slice(start, end);
        this.state.socket.emit('highlight', selectionState);
      } else {
        this.setState({cursor: {
          anchorKey: selectionState.anchorKey,
    			anchorOffset: selectionState.anchorOffset,
    			focusKey: selectionState.focusKey,
    			focusOffset: selectionState.focusOffset,
    			isBackward: selectionState.isBackward
        }})
        const rawContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
        this.state.socket.emit('change', rawContent);
      }
      this.setState({editorState});
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
          id: this.props.match.params.docId,
          mount: true
        }
      })
      .then(response => {
        console.log('IN', response.data.currWorkers)
        this.setState({
          doc: response.data,
          workers: response.data.currWorkers
        })
        this.state.socket.emit('username', name);
        this.state.socket.emit('room', response.data._id);
        this.state.socket.emit('newWorker', response.data.currWorkers);
        this.setEditorContent(response.data.content)
      })
      .catch(err => {
        console.log("Error catching too many users", err)
      })
    })
    .catch(err => {
      console.log("Error fetching user", err)
    })
  }

  componentDidMount() {

    this.state.socket.on('joinMessage', data => {
      console.log(data.content)
    })
    this.state.socket.on('leaveMessage', data => {
      console.log(data.content)
    })
    this.state.socket.on('newWorker', data => {
      console.log('Hi', data)
      this.setState({workers: data})
    })
    this.state.socket.on('leaveWorker', data => {
      console.log('Bye', data)
      this.setState({workers: data})
    })
    this.state.socket.on('change', data => {
      const ownSelectionState = new SelectionState(this.state.cursor);
      const contentState = convertFromRaw(JSON.parse(data));
      const editorState = EditorState.createWithContent(contentState);
      console.log('OWN', editorState.getSelection());
      let newEditorState = EditorState.acceptSelection(
        editorState,
        ownSelectionState
      );
      newEditorState = EditorState.forceSelection(newEditorState, newEditorState.getSelection());
      this.setState({editorState: newEditorState});
    })

    this.state.socket.on('highlight', selection => {
      console.log('EDITOR ON HIGHLIGHT', selection);
      const updateSelection = new SelectionState({
  			anchorKey: selection.anchorKey,
  			anchorOffset: selection.anchorOffset,
  			focusKey: selection.focusKey,
  			focusOffset: selection.focusOffset,
  			isBackward: selection.isBackward
  		});
      let newEditorState = EditorState.acceptSelection(
        this.state.editorState,
        updateSelection
      );
      newEditorState = EditorState.forceSelection(newEditorState, newEditorState.getSelection());
      // const newContentState = Modifier.applyInlineStyle(
      //   newEditorState.getCurrentContent(),
      //   updateSelection,
      //   'HIGHLInGHT'
      // )
      // newEditorState = EditorState.createWithContent(newContentState);
      //this.onChange(newEditorState);
      // EditorState.push(
      //   newEditorState,
      //   newContentState,
      //   'change-inline-style'
      // )
      // this._onHighlight.bind(this)
      this.setState({editorState: newEditorState});
    })
  }

  componentWillUnmount() {
    axios({
      method: 'post',
      url: 'http://localhost:3000/getdoc',
      data: {
        id: this.state.doc._id,
        mount: false
      }
    })
    .then(response => {
      console.log('OUT', response.data.currWorkers)
      this.state.socket.emit('leave', this.state.doc._id)
      this.state.socket.emit('leaveWorker', response.data.currWorkers);
      this.state.socket.on('leaveMessage', data => {
        console.log(data.content)
      })
      this.state.socket.on('leaveWorker', data => {
        console.log('OUTTA HERE', data)
      })
    })
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
    // const selectionState = this.state.editorState.getSelection();
    // const anchorKey = selectionState.getAnchorKey();
    // const currentContent = this.state.editorState.getCurrentContent();
    // const currentContentBlock = currentContent.getBlockForKey(anchorKey);
    // const start = selectionState.getStartOffset();
    // const end = selectionState.getEndOffset();
    // const selectedText = currentContentBlock.getText().slice(start, end);
    // console.log('CURRENT CONTENT', currentContent);
    // console.log('CURRENT CONTENT BLOCK', currentContentBlock);
    // console.log('SELECTED TEXT', selectedText);
    // this.state.socket.emit('highlight', {
    //   block: currentContentBlock,
    //   target: this
    // });
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
    // console.log('RAW', rawDraftContentState);
    axios({
      method: 'post',
      url: 'http://localhost:3000/savedoc',
      data: {
        id: this.state.doc._id,
        content: rawDraftContentState
      }
    })
    .then(updatedDoc => {
      // console.log('SAVED', updatedDoc)
      this.setState({doc: updatedDoc.data})
    })
  }

  setEditorContent (rawDraftContentState) {
    // console.log('RAW', rawDraftContentState);
    const contentState = convertFromRaw(JSON.parse(rawDraftContentState));
    const editorState = EditorState.createWithContent(contentState);
    this.setState({ editorState });
  }

  onChangeSearch(e){
  const search = e.target.value;
  this.setState({
    search,
    editorState: EditorState.set(this.state.editorState, { decorator: generateDecorator(search) }),
  })
}

  render() {
    // if (this.state.redirect) {
    //   return <Redirect to="/library"/>
    // }

    return (
      <div>
        <div style={{ margin: "20px" }} className="body">
          <p className="docHeader">Edit your doc: {this.state.doc.title}</p>

          <p className="docID">Document ID: {this.state.doc._id}</p>
          <button type="button" className="shareButton">Share Document</button><br></br>
          <ul className="docList">
            <p className="libraryHeader">Current Workers</p>
            {this.state.workers.map((worker, i) => {
              return (
                <li key={i} className="doc" style={{color: worker.color}}>
                  {worker.name}
                </li>
              )
            })}
          </ul>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <button type="button" className="saveButton" onClick={this.saveEditorContent.bind(this)}>Save Changes</button>
            <form onSubmit={(e) => this.handleSubmit(e)}>
              <div style={{display: 'flex', width: 500, flex: 1}} className="form-group">
                <label>Search: </label>
                <input
                  onChange={this.onChangeSearch.bind(this)}
                  type="text"
                  name="search"
                  className="form-control registerInput"
                  placeholder="Search in document"
                  value={this.state.search}
                  required></input>
              </div>
            </form>
          </div>
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
          <Link to={"/history/"+this.state.doc._id}>
            <button type="button" className="backButton">
              Document Save History
            </button>
          </Link>
        </div>
      </div>
    );
  }
}
export default DocEditor;
