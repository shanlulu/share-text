import React from 'react';
import ReactDOM from 'react-dom';

class Register extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="body">
        <p className="docHeader">Register!</p>
        <div className="form-group">
          <label>Username</label>
          <input type="text" className="form-control registerInput" placeholder="Enter Username"></input>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control registerInput" placeholder="Password"></input>
        </div>
        <button className="saveButton" type="button">Register</button>
        <button className="saveButton" type="button">Skip to Login</button>
      </div>
    )
  }
}

export default Register;
