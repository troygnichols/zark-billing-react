import React, { Component } from 'react';
import './styles/Signup.css';
import { getConfig } from './config.js';
import { withErrors } from './ErrorProvider.js';
import ReactDOM from 'react-dom';
import Message from './Message.js';
import { getErrorMessages, storeEmail } from './lib/util.js';
import InputField from './InputField.js';
import TextArea from './TextArea.js';
import ButtonControls from './ButtonControls.js';
import { Link } from 'react-router-dom';

class Signup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      signup: {
        email:                 '',
        name:                  '',
        address:               '',
        password:              '',
        password_confirmation: '',
      }
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    const {target: {name, value}} = event;
    this.setState((prev) => (
      {...prev, signup: {
        ...prev.signup, [name]: value }}
    ));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { error: globalError, history } = this.props;
    const { signup } = this.state;
    fetch(`${getConfig('api.baseUrl')}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({signup}),
    }).then(resp => {
      switch(resp.status) {
        case 201:
          storeEmail(signup.email);
          history.push('/signup/success');
          break;
        case 422:
          resp.json().then(errors => (
            this.setState(prev => ({...prev, errors}))
          ));
          ReactDOM.findDOMNode(this.refs.top).scrollIntoView();
          break;
        default:
          console.error('Could not post signup data', resp);
          globalError('Server error, could not sign up!');
      }
    }).catch(err => {
      console.error('Communication error', err);
      globalError('There was a problem communicating with the server!');
    });
  }

  render() {
    const { signup, errors } = this.state;
    const errMsgs = getErrorMessages(errors);
    return (
      <div ref="top">
        <h1 className="title has-text-centered">Create New Account</h1>
        <Message danger if={errMsgs.length}>
          {errMsgs.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </Message>
        <div className="signup-form">
          <div className="card">
            <div className="card-content">
              <form onSubmit={this.handleSubmit}>
                <InputField autoFocus label="Email" name="email" type="email"
                  errors={errors} object={signup} onChange={this.handleChange} />
                <InputField label="Name" name="name"
                  errors={errors} object={signup} onChange={this.handleChange} />
                <TextArea label="Address" name="address" rows={3}
                  errors={errors} object={signup} onChange={this.handleChange} />
                <InputField label="Password" name="password" type="password"
                  errors={errors} object={signup} onChange={this.handleChange} />
                <InputField label="Confirm Password" name="password_confirmation"
                  errors={errors} type="password" object={signup}
                  onChange={this.handleChange} />
                <ButtonControls className="is-pulled-right">
                  <Link to="/" className="button">Cancel</Link>
                  <button type="submit"
                    className="button is-success has-text-weight-bold">
                    Create Account</button>
                </ButtonControls>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withErrors(Signup);
