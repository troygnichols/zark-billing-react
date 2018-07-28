import React, { Component } from 'react';
import { getConfig } from './config';
import Message from './Message.js';
import { storeAuthToken, storeUserProfile } from './lib/auth.js';
import './styles/Login.css';
import { Link } from 'react-router-dom';
import InputField from './InputField.js';
import { withErrors } from './ErrorProvider.js';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '', password: '', loginFailed: false
    };
  }

  handleLogin = (event) => {
    event.preventDefault();
    const { history, error: globalError } = this.props;
    fetch(`${getConfig('api.baseUrl')}/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        include_profile: true
      })
    }).then(resp => {
      switch(resp.status) {
        case 200:
          resp.json().then(({auth_token, profile}) => {
            storeAuthToken(auth_token);
            storeUserProfile(profile);
            history.push('/invoices');
          });
          break;
        case 401:
          this.setState(prevState => (
            {...prevState, password: '', loginFailed: true}
          ));
          break;
        default:
          console.error('Login attempt failed', resp);
          globalError(
            'Server error, login failed! Something went wrong ' +
            'in our system.');
      };
    }).catch(err => {
      console.error('Communication error', err);
      globalError(
        'There was a problem communicating with the server!');
    });
  }

  handleChange = (event) => {
    event.preventDefault();
    const {target: {name, value}} = event;
    this.setState((prevState) => (
      { ...prevState, [name]: value }
    ));
  }

  render() {
    return (
      <div className="login-form">
        <h1 className="title">Login</h1>
        <Message danger if={this.state.loginFailed}>Bad username/password</Message>
        <div className="card">
          <div className="card-content">
            <form onSubmit={this.handleLogin}>
              <InputField label="Email" name="email" object={this.state}
                onChange={this.handleChange} />
              <InputField label="Password" type="password" name="password"
                object={this.state} onChange={this.handleChange} />
              <div className="is-clearfix">
                <Link to="reset_password" className="is-pulled-left">Forgot password</Link>
                <div className="control">
                  <button type="submit"
                    className="button is-primary has-text-weight-bold is-pulled-right">
                    <span>Login</span></button>
                </div>
              </div>
            </form>
            <hr className="divider"/>
            <div className="create-account">
              <div className="spacer">&#8212; or &#8212;</div>
              <Link to="/signup" className="button is-success">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withErrors(Login);
