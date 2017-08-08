import React from 'react';
import ReactDOM from 'react-dom';
import DocEditor from './Editor.js';
import Modal from 'react-modal';
import axios from 'axios';

class DocLibrary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      documents: [],
      modalIsOpen: false,
      title: '',
      password: '',
      }
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.createDocument = this.createDocument.bind(this);
    this.inputChangeTitle = this.inputChangeTitle.bind(this);
    this.inputChangePassword = this.inputChangePassword.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    this.subtitle.style.color = 'black';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  inputChangeTitle(e) {
   this.setState({title: e.target.value})
   console.log("TITLE: ", this.state.title)

 }

 inputChangePassword(e) {
  this.setState({password: e.target.value})
  console.log("PASSWORD: ", this.state.password)
}

  createDocument(e) {
    e.preventDefault()
    axios({
      method: 'post',
      url: 'http://localhost:3000/newdoc',
      data: {
        title: this.state.title,
        password: this.state.password
      }
    })
      .then(response => {
        console.log("Saved new doc!!")
      })
    console.log('HERE: ', this.state.title, this.state.password)
    }


  render() {
    return (
      <div style={{ margin: "20px" }} className="body">
        <p className="docHeader">Your Document Library</p>
        <form className="form-group" onSubmit={(e) => this.props.handleSubmit(e)}>
          <button
            type="button"
            className="saveButton"
            onClick={this.openModal}>
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
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
          className={{
            afterOpen: 'modalBody',
          }}
        >
          <h2 className="docHeader" ref={subtitle => this.subtitle = subtitle}>Create a new Document</h2>
          <form onSubmit={(e) => this.createDocument(e)}>
            <h2 className="modalText ">Give it a name:</h2><input type="text" onChange={(e) => this.inputChangeTitle(e)} className="form-control registerInput" placeholder="Document Title"></input><br></br>
            <h2 className="modalText">Password:</h2><input type="password" onChange={(e) => this.inputChangePassword(e)} className="form-control registerInput" placeholder="Password"></input><br></br>
            <input className="saveButton" type="submit" value="Create Document" />
            <button className="saveButton" onClick={this.closeModal}>cancel</button>
          </form>
        </Modal>
      </div>
    )
  }
}

export default DocLibrary;
