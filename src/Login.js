import React, { Component } from 'react';
import { getConfig } from './config';
import Message from './Message.js';
import { storeAuthToken, storeUserProfile } from './lib/auth.js';
import './styles/Login.css';
import { Link } from 'react-router-dom';
import ModalError from './ModalError.js';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '', password: '', loginFailed: false
    };
  }

  handleLogin = (event) => {
    event.preventDefault();
    const { history } = this.props;
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
          this.setState({
            modalError: 'Server error, login failed! Something went wrong in our system.'
          });
      };
    }).catch(err => {
      console.error('Communication error', err);
      this.setState({
        modalError: 'There was a problem communicating with the server!'
      });
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
    const { modalError } = this.state;
    return (
      <div className="login-form">
        <ModalError if={modalError}>
          <p className="has-text-centered">
            {modalError}
          </p>
          <p className="has-text-centered">
            <a className="button"
              onClick={() => window.location.reload()}>Reload page</a>
          </p>
        </ModalError>
        <h1 className="title">Login</h1>
        <Message danger if={this.state.loginFailed}>Bad username/password</Message>
        <div className="card">
          <div className="card-content">
            <form onSubmit={this.handleLogin}>
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input className="input" autoFocus type="text" name="email"
                    value={this.state.email} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <input type="password" name="password"
                  value={this.state.password} onChange={this.handleChange}
                  className="input"/>
              </div>
              <div className="is-clearfix">
                <Link to="reset_password" className="is-pulled-left">Forgot password</Link>
                <div className="control">
                  <button type="submit"
                    className="button is-primary has-text-weight-bold is-pulled-right">
                    <span>Login</span></button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
