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
          <button
            type="button"
            className="saveButton">
            Create New Document
          </button>
        </form>
        <ul className="docList">
          <p className="libraryHeader">Choose a doc to edit</p>
          {this.state.documents.map(doc => {
            return (<li key={doc} className="doc">{doc}</li>)
          })}
        </ul>
        <form className="form-group" onSubmit={(e) => this.props.handleSubmit(e)}>
          <button
            type="button"
            className="saveButton">
            Add Shared Document
          </button>
        </form>
      </div>
    )
  }
}

export default DocLibrary;
