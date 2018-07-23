import React, { Component } from 'react';
import orangeCatImg from './images/orange-cat.png';
import { isLoggedIn, logout } from './lib/auth.js';
import { withRouter, Link } from 'react-router-dom';

class NavBar extends Component {

  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }



  handleLogout() {
    logout();
    this.props.history.push('/login');
  }

  render() {
    return (
      <nav className=" navbar has-shadow is-spaced zark-navbar">
        <div className="container">
          <div className="navbar-brand">
            <img className="logo-image" alt="" src={orangeCatImg} />
            <p style={{marginTop: 12, fontSize: 20}}>Zark Billing</p>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="field is-grouped is-grouped-multiline">
                <p className="control">
                  {isLoggedIn() ?
                      <Link className="button is-primary"
                        to="/invoices">Profile</Link>
                      : null}
                </p>
                <p className="control">
                  {isLoggedIn() ?
                      <button className="button is-priamry"
                        onClick={this.handleLogout}>Logout</button>
                      : null}
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(NavBar);
