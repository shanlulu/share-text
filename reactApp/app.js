var React = require('react');
var ReactDOM = require('react-dom');
import {Editor, EditorState, RichUtils} from 'draft-js';


/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
// .then(resp => resp.text())
// .then(text => console.log(text))
// .catch(err => {throw err})

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
  }

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      "BOLD"
    ));
  }

  _onItalicClick() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      "ITALIC"
    ));
  }

  _onItalicClick() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      "ITALIC"
    ));
  }

  _onUnderlineClick() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      "UNDERLINE"
    ));
  }

  _onStrikeClick() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'STRIKETHROUGH'
    ));
  }

  render() {
    return (
      <div style={{ margin: "20px" }}>
        <p className="docHeader">Edit your docs:</p>
        <p>Document ID: testID</p>
        <button type="button" className="saveButton">Save Changes</button>
        <div className="toolbar">
          <button className="styleButton" type="button" onClick={this._onBoldClick.bind(this)}><span title="Change Text Size"><span className="glyphicon glyphicon-text-size"></span></span></button>
          <button className="styleButton" type="button" onClick={this._onItalicClick.bind(this)}><span title="Change Text Color"><span className="glyphicon glyphicon-tint"></span></span></button>
          <button className="styleButton" type="button" onClick={this._onUnderlineClick.bind(this)}><span title="Bold"><span className="glyphicon glyphicon-bold"></span></span></button>
          <button className="styleButton" type="button" onClick={this._onStrikeClick.bind(this)}><span title="Italicize"><span className="glyphicon glyphicon-italic"></span></span></button>
          <button className="styleButton" type="button" onClick={this._onStrikeClick.bind(this)}><span title="Underline"><span className="glyphicon glyphicon-text-color"></span></span></button>
          <button className="styleButton" type="button" onClick={this._onStrikeClick.bind(this)}><span title="Align Left"><span className="glyphicon glyphicon-align-left"></span></span></button>
          <button className="styleButton" type="button" onClick={this._onStrikeClick.bind(this)}><span title="Align Center"><span className="glyphicon glyphicon-align-center"></span></span></button>
          <button className="styleButton" type="button" onClick={this._onStrikeClick.bind(this)}><span title="Align Right"><span className="glyphicon glyphicon-align-right"></span></span></button>
          <button className="styleButton" type="button" onClick={this._onStrikeClick.bind(this)}><span title="Bullet List"><span className="glyphicon glyphicon-list"></span></span></button>
        </div>
        <div className="editor">
          <Editor editorState={this.state.editorState} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <MyEditor />,
  document.getElementById('root')
);


// ReactDOM.render(<p>React lives!</p>,
//    document.getElementById('root'));
