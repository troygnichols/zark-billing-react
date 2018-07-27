import React, { Component } from 'react';
import { getConfig } from './config';
import Message from './Message.js';
import { storeAuthToken, storeUserProfile } from './lib/auth.js';
import './styles/Login.css';
import { Link } from 'react-router-dom';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '', password: '', loginFailed: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event) {
    event.preventDefault();
    const self = this;
    const handleBadCreds = () => {
      self.setState(prevState => (
        { ...prevState, password: '', loginFailed: true }
      ));
    };
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
    })
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        console.error('Server gave bad response to login request', resp);
        throw new Error('Login failed');
      })
      .then(({auth_token, profile}) => {
        storeAuthToken(auth_token);
        storeUserProfile(profile);
        self.props.history.push('/invoices');
      })
      .catch(handleBadCreds);
  }

  handleChange(event) {
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
