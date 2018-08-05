import React, { Component } from 'react';
import { withErrors } from './ErrorProvider.js';
import * as queryString from 'query-string';
import { Link } from 'react-router-dom';
import ChangePasswordForm from './ChangePasswordForm.js';
import { getConfig } from './config.js';
import { toast } from 'react-toastify';
import { storeAuthToken, storeUserProfile } from './lib/auth.js';
import ButtonControls from './ButtonControls.js';

class ResetPasswordEdit extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errors: {}
    };
  }

  getQueryStringParams() {
    return queryString.parse(window.location.search);
  }

  handleSubmit = (fields) => {
    const { history, error: globalError } = this.props;
    const { token, email } = this.getQueryStringParams();
    fetch(`${getConfig('api.baseUrl')}/reset_password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email, token, ...fields
      })
    }).then(resp => {
      switch(resp.status) {
        case 200:
          resp.json().then(({auth_token, profile}) => {
            toast.success('Reset password successfully');
            storeAuthToken(auth_token);
            storeUserProfile(profile);
            history.push('/');
          });
          break;
        case 400:
          history.push('/reset_password/expired');
          break;
        case 422:
          resp.json().then((errors) => this.setState({errors}));
          break;
        default:
          console.error('Reset password failed', resp);
          globalError('Server error, could not reset password!');
      }
    }).catch(err => {
      console.error('Communication error', err);
      globalError('There was a problem communicating with the server!');
    });
  }

  render() {
    const { email } = this.getQueryStringParams();
    const { errors } = this.state;
    return (
      <div refs="top">
        <nav className="breadcrumb">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li className="is-active"><a href="#change-password">Enter New Password</a></li>
          </ul>
          <ChangePasswordForm
            email={email} onSubmit={this.handleSubmit} errors={errors}>
              <ButtonControls className="is-pulled-right">
                <button type="submit"
                  className="button is-link has-text-weight-bold">
                  Reset Password</button>
              </ButtonControls>
            </ChangePasswordForm>
        </nav>
      </div>
    );
  }
}

export default withErrors(ResetPasswordEdit);
