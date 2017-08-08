import React from 'react';
import ReactDOM from 'react-dom';
import DocEditor from './Editor.js'

class DocLibrary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      documents: []
    }
  }

  render() {
    return (
      <div style={{ margin: "20px" }} className="body">
        <p className="docHeader">Your Document Library</p>
        <form className="form-group" onSubmit={(e) => this.props.handleSubmit(e)}>
          <input
            type="text"
            name="newDoc"
            placeholder="Create a document"
            className="input"></input>
          <button
            type="button"
            className="styleButton">
            Create
          </button>
        </form>
        <ul className="docList">
          {this.state.documents.map(doc => {
            return (<li key={doc} className="doc">{doc}</li>)
          })}
        </ul>
        <form className="form-group" onSubmit={(e) => this.props.handleSubmit(e)}>
          <input type="text" name="sharedDoc" placeholder="Share a document" className="input"></input>
          <button type="button" className="styleButton">Share</button>
        </form>
      </div>
    )
  }
}

export default DocLibrary;
