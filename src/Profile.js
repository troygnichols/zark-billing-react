import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/Profile.css';
import { getConfig } from './config.js';
import { getAuthToken, storeUserProfile } from './lib/auth.js';
import { toast } from 'react-toastify';
import ModalLoading from './ModalLoading.js';
import Message from './Message.js';
import { getErrorMessages } from './lib/util.js';
import { withErrors } from './ErrorProvider.js';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      profile: {},
    };
  }

  componentDidMount() {
    const { history, error: globalError } = this.props;
    fetch(`${getConfig('api.baseUrl')}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getAuthToken()
      }
    }).then(resp => {
      switch(resp.status) {
        case 200:
          resp.json().then(({profile}) =>
            this.setState({profile, hasLoaded: true}));
          break;
        case 401:
          history.push('/login')
          break;
        default:
          console.error('Could not load profile data', resp);
          globalError('Server error, could not load profile!', () =>
            history.push('/'));
      }
    }).catch(err => {
      console.error('Communication error', err);
      globalError('There was a problem communicating with the server!');
    }).finally(() => {
      this.setState(prev => ({...prev, hasLoaded: true}));
    });
  }

  handleChange = (event) => {
    event.preventDefault();
    const {target: {name, value}} = event;
    this.setState(({profile, ...rest}) => (
      { ...rest, profile: { ...profile, [name]: value }}
    ));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { history, error: globalError } = this.props;
    fetch(`${getConfig('api.baseUrl')}/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getAuthToken()
      },
      body: JSON.stringify(this.state.profile)
    }).then(resp => {
      switch(resp.status) {
        case 200:
          resp.json().then(({profile}) => {
            storeUserProfile(profile);
            toast.success('Saved profile');
            this.props.history.push('/');
          })
          break;
        case 401:
          history.push('/login');
          break;
        case 422:
          resp.json().then((errors) => this.setState({errors}));
          break;
        default:
          console.error('Save profile failed', resp);
          globalError('Server error, could not save profile!');
      }
    }).catch(err => {
      console.error('Communication error', err);
      globalError(
        'There was a problem communicating with the server!');
    });
  }

  render() {
    const { profile, errors, hasLoaded } = this.state;
    const errMsgs = getErrorMessages(errors);

    return (
      <div>
        <ModalLoading if={!hasLoaded} />
        <nav className="breadcrumb">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li className="is-active"><a href="#profile">Edit Profile</a></li>
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
                <label className="label">Email</label>
                <div className="control">
                  <input className="input" type="email" name="email"
                    value={profile.email||''} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="field">
                <label className="label">Name/Default Client Name</label>
                <div className="control">
                  <input className="input" type="text" name="name"
                    value={profile.name||''} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="field">
                <label className="label">Address</label>
                <div className="control">
                  <textarea className="textarea" name="address"
                    value={profile.address||''}
                    rows={2} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="is-clearfix">
                <Link to='/change_password' className="is-pulled-left">Change Password</Link>
                <div className="field is-grouped is-pulled-right">
                  <div className="control">
                    <Link to="/" className="button">Cancel</Link>
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

export default withErrors(Profile);
