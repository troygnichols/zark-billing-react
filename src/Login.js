import React, { Component } from 'react';
import { getConfig } from './config';
import Message from './Message.js';
import { storeAuthToken } from './auth.js';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '', password: '', loginFailed: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
  }

  login() {
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
      .then(resp => resp.json())
      .then(data => {
        if (data.auth_token) {
          storeAuthToken(data.auth_token);
          self.props.history.push('/invoices');
        } else {
          handleBadCreds();
        }
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
      <div>
        <h1>Login</h1>
        <Message if={this.state.loginFailed}>Bad username/password</Message>
        <form onSubmit={this.login}>
          <div>
            <label>Email</label><br/>
            <input autoFocus type="text" name="email"
              value={this.state.email} onChange={this.handleChange}/>
          </div>
          <div>
            <label>Password</label><br/>
            <input type="password" name="password"
              value={this.state.password} onChange={this.handleChange}/>
          </div>
        </form>
        <div className="action-controls">
          <a href="#login" onClick={this.login} className="button">Login</a>
        </div>
      </div>
    );
  }
}

export default Login;
