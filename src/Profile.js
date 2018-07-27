import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import { getConfig } from './config.js';
import { getAuthToken } from './lib/auth.js';
import { toast } from 'react-toastify';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {profile: {}};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const history = this.props.history;
    fetch(`${getConfig('api.baseUrl')}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getAuthToken()
      }
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.error) {
          history.push('/login')
        } else {
          this.setState(prevState => (
            { ...prevState, profile: data.profile })
          );
        }
      })
  }

  handleChange(event) {
    event.preventDefault();
    const {target: {name, value}} = event;
    this.setState(({profile, ...rest}) => (
      { ...rest, profile: { ...profile, [name]: value }}
    ));
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch(`${getConfig('api.baseUrl')}/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getAuthToken()
      },
      body: JSON.stringify(this.state.profile)
    })
      .then(resp => resp.json())
      .then(data => {
        toast.success('Saved profile');
        this.props.history.push('/');
      });
  }

  render() {
    return (
      <div>
        <nav className="breadcrumb">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li className="is-active"><a href="#profile">Edit Profile</a></li>
          </ul>

        </nav>
        <form onSubmit={this.handleSubmit} className="profile-form">
          <div className="card">
            <div className="card-content">
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input className="input" type="email" name="email"
                    value={this.state.profile.email||''} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="field">
                <label className="label">Name/Default Client Name</label>
                <div className="control">
                  <input className="input" type="text" name="name"
                    value={this.state.profile.name||''} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="field">
                <label className="label">Address</label>
                <div className="control">
                  <textarea className="textarea" name="address"
                    value={this.state.profile.address||''}
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

export default Profile;
