var React = require('react');
var ReactDOM = require('react-dom');
import {Editor, EditorState} from 'draft-js';


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
  render() {
    return (
      <div>
        <p className="docHeader">Edit your docs:</p>
        <p>Document ID: testID</p>
        <button type="button" className="saveButton">Save Changes</button>
        <div className="toolbar">
          <button className="styleButton" type="button"> <span className="glyphicon glyphicon-bold"></span></button>
          <button className="styleButton" type="button"><span className="glyphicon glyphicon-italic"></span></button>
          <button className="styleButton" type="button"><span className="glyphicon glyphicon-text-color"></span></button>
          <button className="styleButton" type="button"><span className="glyphicon glyphicon-align-left"></span></button>
          <button className="styleButton" type="button"><span className="glyphicon glyphicon-align-center"></span></button>
          <button className="styleButton" type="button"><span className="glyphicon glyphicon-align-right"></span></button>
          <button className="styleButton" type="button"><span className="glyphicon glyphicon-list"></span></button>
          <button className="styleButton" type="button"><span className="glyphicon glyphicon-text-color"></span></button>
          <button className="styleButton" type="button"><span className="glyphicon glyphicon-tint"></span></button>
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
