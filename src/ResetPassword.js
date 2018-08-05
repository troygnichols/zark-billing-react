import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getConfig } from './config.js';
import InputField from './InputField.js';
import { withErrors } from './ErrorProvider.js';
import Message from './Message.js';
import { getErrorMessages } from './lib/util.js';
import ReactDOM from 'react-dom';

class ResetPassword extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: ''
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { email } = this.state;
    const { error: globalError, history } = this.props;
    fetch(`${getConfig('api.baseUrl')}/send_password_reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({email})
    }).then(resp => {
      switch(resp.status) {
        case 200:
          history.push('/reset_password/sent')
          break;
        case 422:
          resp.json().then(errors => {
            this.setState(prev => ({...prev, errors}))
          });
          ReactDOM.findDOMNode(this.refs.top).scrollIntoView();
          break;
        default:
          console.error('Error sending password reset email');
          globalError('Server error, could not reset password!');
      }
    }).catch(err => {
      console.error('Communication error', err);
      globalError('There was a problem communicating with the server!');
    });
  }

  handleChange = (event) => {
    event.preventDefault();
    this.setState({email: event.target.value});
  }

  render() {
    const { errors } = this.state;
    const errMsgs = getErrorMessages(errors);
    return (
      <form onSubmit={this.handleSubmit} ref="top">
        <nav className="breadcrumb">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li className="is-active"><a href="#forgot-password">Reset Password</a></li>
          </ul>
        </nav>
        <Message danger if={errMsgs.length}>
          {errMsgs.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </Message>
        <div className="card">
          <div className="card-content">
            <h1 className="title">Forgot password?</h1>
            <p>Enter your email and click the link below to reset your password:</p>
            <hr/>
            <div className="columns">
              <div className="column is-half">
                <InputField required autoFocus label="Email" name="email"
                  type="email" object={this.state}
                  onChange={this.handleChange} errors={errors} />
              </div>
            </div>
            <button type="submit"
              className="button is-primary has-text-weight-bold"
            >Reset Password</button>
          </div>
          <hr/>
        </div>
      </form>
    );
  }
}

export default withErrors(ResetPassword);
