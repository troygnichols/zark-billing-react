import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import { getConfig } from './config.js';
import { getAuthToken } from './lib/auth.js';
import Message from './Message.js';
import titleize from 'titleize';
import { humanize } from 'inflection';
import { toast } from 'react-toastify';

class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fields: {
        password: '',
        password_confirmation: ''
      },
      errors: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    const {target: {name, value}} = event;
    this.setState((prevState) => (
      { ...prevState, fields:
        { ...prevState.fields, [name]: value }
      }
    ));
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch(`${getConfig('api.baseUrl')}/update_password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getAuthToken()
      },
      body: JSON.stringify(this.state.fields)
    })
      .then(resp => {
        if (resp.ok) {
          return new Promise(resolve => resolve(null));
        } else {
          return resp.json()
        }
      })
      .then(errors => {
        if (errors) {
          this.setState(prevState => (
            { ...prevState, errors: errors }
          ));
        } else {
          toast.success('Changed password successfully.');
          this.props.history.push('/profile');
        }
      });
  }

  getErrorMessages() {
    const errors = this.state.errors;
    const keys = Object.keys(errors);
    if (keys.length === 0) {
      return [];
    }
    return keys.reduce((acc, key) => (
      acc.concat(errors[key].map(msg => (
        `${titleize(humanize(key))} ${msg}`
      )))
    ), []);
  }

  render() {
    const errors = this.getErrorMessages();
    return (
      <div>
        <nav className="breadcrumb">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile">Edit Profile</Link></li>
            <li className="is-active"><a href="#profile">Change Password</a></li>
          </ul>
        </nav>
        <Message danger if={errors.length}>
          {errors.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </Message>
        <form onSubmit={this.handleSubmit} className="profile-form">
          <div className="card">
            <div className="card-content">
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input className="input" type="password" name="password"
                    value={this.state.password} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="field">
                <label className="label">Confirm Password</label>
                <div className="control">
                  <input className="input" type="password"
                    name="password_confirmation"
                    value={this.state.password_confirmation}
                    onChange={this.handleChange}/>
                </div>
              </div>
              <div className="is-clearfix">
                <div className="field is-grouped is-pulled-right">
                  <div className="control">
                    <Link to="/profile" className="button">Cancel</Link>
                  </div>
                  <div className="control">
                    <button type="submit"
                      className="button is-link has-text-weight-bold">
                      Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default ChangePassword;

