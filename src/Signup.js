import React, { Component } from 'react';
import './styles/Signup.css';
import InputField from './InputField.js';
import { Link } from 'react-router-dom';
import ButtonControls from './ButtonControls.js';
import { getConfig } from './config.js';
import { withErrors } from './ErrorProvider.js';
import { getErrorMessages } from './lib/util.js';
import Message from './Message.js';

class Signup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fields: {}
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    const {target: {name, value}} = event;
    this.setState((prevState) => (
      { ...prevState, [name]: value }
    ));
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { history, error: globalError } = this.props;
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
          history.push('/signup_success');
          break;
        case 422:
          resp.json().then(errors => (
            this.setState(prevState => ({...prevState, errors}))
          ));
          break;
        default:
          console.error('Could post signup data', resp);
          globalError('Server error, could not sign up!');
      }
    }).catch(err => {
      console.error('Communication error', err);
      globalError('There was a problem communicating with the server!');
    });
  }

  buildSignupPayload(signup) {
    return {}
  }

  render() {
    const { fields, errors } = this.state;
    const errMsgs = getErrorMessages(errors);
    return (
      <div className="signup-form">
        <h1 className="title">Create New Account</h1>
        <Message danger if={errMsgs.length}>
          {errMsgs.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </Message>
        <div className="card">
          <div className="card-content">
            <form onSubmit={this.handleSubmit}>
              <InputField autoFocus label="Email" name="email"
                errors={errors} object={fields} onChange={this.handleChange} />
              <InputField label="Name" name="name"
                errors={errors} object={fields} onChange={this.handleChange} />
              <InputField label="Password" name="password" type="password"
                errors={errors} object={fields} onChange={this.handleChange} />
              <InputField label="Confirm Password" name="password_confirmation"
                errors={errors} type="password" object={fields}
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
    );
  }
}

export default withErrors(Signup);
