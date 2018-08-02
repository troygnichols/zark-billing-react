import React, { Component } from 'react';

import { getStoredEmail } from './lib/util.js';

class SignupSuccess extends Component {

  componentWillMount() {
    const { history } = this.props;
    const email = getStoredEmail();
    this.setState({ email });
    if (!email) {
      history.push('/');
    }
  }

  render() {
    const { email } = this.state;
    return (
      <div className="has-text-centered">
        <h1 className="title">Thank You!</h1>
        <p>We've sent an email to <strong>{email}</strong>.</p>
        <hr/>
        <strong>Please check your mail to continue.</strong>
      </div>
    );
  }
}

export default SignupSuccess;
