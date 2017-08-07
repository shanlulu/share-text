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
    this.toggleBlockType = (type) => this._toggleBlockType(type);
  }

  // _onStrikeClick() {
  //   this.onChange(RichUtils.toggleInlineStyle(
  //     this.state.editorState,
  //     'STRIKETHROUGH'
  //   ));
  // }
  //
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

  _onLeftAlignClick() {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      "ALIGN-LEFT"
    ));
  }

  _onCenterAlignClick() {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      "ALIGN-CENTER"
    ));
  }

  _onRightAlignClick() {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      "ALIGN-RIGHT"
    ));
  }

  render() {
    return (
      <div style={{ margin: "20px" }}>
        <p className="docHeader">Edit your docs:</p>
        <p>Document ID: testID</p>
        <button type="button" className="saveButton">Save Changes</button>
        <div className="toolbar">
          <span title="Change Text Size"><button className="styleButton glyphicon glyphicon-text-size" type="button"> <select>
            <option value="10">10</option>
            <option value="12">12</option>
            <option value="14">14</option>
            <option value="16">16</option>
            <option value="18">18</option>
            <option value="20">20</option>
            <option value="24">24</option>
          </select></button></span>
          <span title="Change Text Color"><button className="styleButton" type="button" onClick={this._onStrikeClick.bind(this)}><span className="glyphicon glyphicon-tint"></span></button></span>
          <span title="Bold"><button className="styleButton" type="button" onClick={this._onBoldClick.bind(this)}><span className="glyphicon glyphicon-bold"></span></button></span>
          <span title="Italicize"><button className="styleButton" type="button" onClick={this._onItalicClick.bind(this)}><span className="glyphicon glyphicon-italic"></span></button></span>
          <span title="Underline"><button className="styleButton" type="button" onClick={this._onUnderlineClick.bind(this)}><span className="glyphicon glyphicon-text-color"></span></button></span>
          <span title="Align Left"><button className="styleButton" type="button" onClick={this._onLeftAlignClick.bind(this)}><span className="glyphicon glyphicon-align-left"></span></button></span>
          <span title="Align Center"><button className="styleButton" type="button" onClick={this._onCenterAlignClick.bind(this)}><span className="glyphicon glyphicon-align-center"></span></button></span>
          <span title="Align Right"><button className="styleButton" type="button" onClick={this._onRightAlignClick.bind(this)}><span className="glyphicon glyphicon-align-right"></span></button></span>
          <span title="Bullet List"><button className="styleButton" type="button" onClick={this._onStrikeClick.bind(this)}><span className="glyphicon glyphicon-list"></span></button></span>
          <span title="Numbered List"><button className="styleButton" type="button"><span className="glyphicon glyphicon-sort-by-order"></span></button></span>
        </div>
        <div className="editor">
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            placeholder="Enter your text below"
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <MyEditor />,
  document.getElementById('root')
);
