import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ResetPasswordSent extends Component {
  render() {
    return (
      <div>
        <nav className="breadcrumb">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/reset_password">Reset Password</Link></li>
            <li className="is-active"><a href="#forgot-password">Email Sent</a></li>
          </ul>
        </nav>
        <h1 className="title">Password Reset Email Sent</h1>
        <p>We sent you an email with a link to reset your password. Please check your email.</p>
      </div>
    );
  }
}

export default ResetPasswordSent;

