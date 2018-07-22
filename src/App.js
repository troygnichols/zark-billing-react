import React, { Component } from 'react';
import './App.css';

import { Switch, Route, Redirect, Link } from 'react-router-dom';

import InvoiceList from './InvoiceList.js';
import Invoice from './Invoice.js';
import EditInvoice from './EditInvoice.js';
import NewInvoice from './NewInvoice.js';
import Login from './Login.js';

import { isLoggedIn, logout } from './auth.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    logout();
    window.location = '/login';
  }

  render() {
    return (
      <div className="App">
        <div className="wrap">
          <header>
            <div className="container clearfix">
              <ul className="main-nav">
                <li><Link to='/invoices'>Home</Link></li>
              </ul>
              <ul className="login-nav">
                {isLoggedIn() ? <li><a href="#profile">Profile</a></li> : null}
                {isLoggedIn() ? <li><a href="#logout" onClick={this.handleLogout}>Log Out</a></li> : null}
              </ul>
            </div>
          </header>
          <div className="container">
            <Switch>
              <Redirect exact from='/' to='/invoices' />
              <Route exact path='/login' component={Login} />
              <Route exact path='/invoices' component={InvoiceList} />
              <Route exact path='/invoices/new' component={NewInvoice} />
              <Route exact path='/invoices/:id' component={Invoice} />
              <Route exact path='/invoices/:id/edit' component={EditInvoice} />
            </Switch>
          </div>
        </div>
        <footer>
          <div className="container">The source code for this project is <a href="https://github.com/troygnichols/zark-billing-react" target="_blank" rel="noopener noreferrer">here</a></div>
        </footer>
      </div>
    );
  }
}

export default App;
