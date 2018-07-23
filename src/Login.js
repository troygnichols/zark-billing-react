import React, { Component } from 'react';
import { getConfig } from './config';
import Message from './Message.js';
import { storeAuthToken } from './lib/auth.js';
import './styles/Login.css';

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
        password: this.state.password
      })
    })
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        console.error('Server gave bad response to login request', resp);
        throw new Error('Login failed');
      })
      .then(({auth_token}) => {
        storeAuthToken(auth_token);
        self.props.history.push('/invoices');
      })
      .catch(handleBadCreds);
  }

  handleChange(event) {
    event.preventDefault();

    const target = event.target;
    const name = target.name;
    const value = target.value;

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
              <div className="control is-clearfix">
                <button type="submit"
                  className="button is-primary has-text-weight-bold is-pulled-right">
                  <span>Login</span></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
