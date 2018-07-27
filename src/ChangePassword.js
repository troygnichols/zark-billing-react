import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getConfig } from './config.js';
import { getAuthToken } from './lib/auth.js';
import Message from './Message.js';
import { toast } from 'react-toastify';
import { getErrorMessages } from './lib/util.js';
import ModalError from './ModalError.js';

class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fields: {
        password: '',
        password_confirmation: ''
      }
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    const {target: {name, value}} = event;
    this.setState((prevState) => (
      { ...prevState, fields:
        { ...prevState.fields, [name]: value }
      }
    ));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { history } = this.props;
    fetch(`${getConfig('api.baseUrl')}/update_password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getAuthToken()
      },
      body: JSON.stringify(this.state.fields)
    }).then(resp => {
      switch(resp.status) {
        case 200:
          toast.success('Changed password successfully.');
          this.props.history.push('/profile');
          break;
        case 401:
          history.push('/login');
          break;
        case 422:
          resp.json().then((errors) => this.setState({errors}));
          break;
        default:
          console.error('Update password failed', resp);
          this.setState({
            modalError: 'Server error, could not update password!'
          });
      }
    }).catch(err => {
      console.error('Communication error', err);
      this.setState({
        modalError: 'There was a problem communicating with the server!'
      });
    });
  };

  render() {
    const {
      errors, modalError, password, password_confirmation
    } = this.state;
    const errMsgs = getErrorMessages(errors);

    return (
      <div>
        <ModalError if={modalError}>
          <p className="has-text-centered">
            {modalError}
          </p>
          <p className="has-text-centered">
            <a className="button"
              onClick={() => window.location.reload()}>Reload page</a>
          </p>
        </ModalError>
        <nav className="breadcrumb">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile">Edit Profile</Link></li>
            <li className="is-active"><a href="#profile">Change Password</a></li>
          </ul>
        </nav>
        <Message danger if={errMsgs.length}>
          {errMsgs.map((msg, i) => (
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
                    value={password} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="field">
                <label className="label">Confirm Password</label>
                <div className="control">
                  <input className="input" type="password"
                    name="password_confirmation"
                    value={password_confirmation}
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

