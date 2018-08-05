import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getConfig } from './config.js';
import { getAuthToken, getUserProfile } from './lib/auth.js';
import { toast } from 'react-toastify';
import { withErrors } from './ErrorProvider.js';
import ChangePasswordForm from './ChangePasswordForm.js';
import ButtonControls from './ButtonControls.js';

class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errors: {},
    };
  }

  handleSubmit = (fields) => {
    const { history, error: globalError } = this.props;
    fetch(`${getConfig('api.baseUrl')}/update_password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getAuthToken()
      },
      body: JSON.stringify(fields)
    }).then(resp => {
      switch(resp.status) {
        case 200:
          toast.success('Changed password successfully.');
          history.push('/profile');
          break;
        case 401:
          history.push('/login');
          break;
        case 422:
          resp.json().then((errors) => this.setState({errors}));
          break;
        default:
          console.error('Update password failed', resp);
          globalError('Server error, could not update password!');
      }
    }).catch(err => {
      console.error('Communication error', err);
      globalError('There was a problem communicating with the server!');
    });
  };

  render() {
    const { errors } = this.state;
    const { email } = getUserProfile();

    return (
      <div>
        <nav className="breadcrumb">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile">Edit Profile</Link></li>
            <li className="is-active"><a href="#profile">Change Password</a></li>
          </ul>
        </nav>
        <ChangePasswordForm autoFocus
          email={email} onSubmit={this.handleSubmit} errors={errors}>
          <ButtonControls className="is-pulled-right">
            <Link to="/profile" className="button">Cancel</Link>
            <button type="submit"
              className="button is-link has-text-weight-bold">
              Save</button>
          </ButtonControls>
        </ChangePasswordForm>
      </div>
    );
  }
}

export default withErrors(ChangePassword);
