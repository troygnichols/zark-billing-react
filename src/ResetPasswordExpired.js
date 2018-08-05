import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withErrors } from './ErrorProvider.js';

class ResetPasswordExpired extends Component {

  render() {
    return (
      <div>
        <nav className="breadcrumb">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/reset_password">Reset Password</Link></li>
            <li className="is-active"><a href="#expired">Expired</a></li>
          </ul>
        </nav>
        <h1 className="title">Password Reset Expired</h1>
        <p>Your password reset link has expired</p>
        <hr/>
        <Link to="/reset_password" className="button is-link">Click here to send another</Link>
      </div>
    );
  }
}

export default withErrors(ResetPasswordExpired);
