import React, { Component } from 'react';
import './App.css';

import { Switch, Route, Redirect, Link } from 'react-router-dom';

import InvoiceList from './InvoiceList.js';
import Invoice from './Invoice.js';
import EditInvoice from './EditInvoice.js';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="wrap">
          <header>
            <div className="container clearfix">
              <ul className="main-nav">
                <li><Link to='/invoices'>Home</Link></li>
                <li><a href="https://www.google.com">Google</a></li>
              </ul>
              <ul className="login-nav">
                <li><a href="javascript:alert('TODO');">Login</a></li>
                <li><a href="javascript:alert('TODO');">Logout</a></li>
                <li><a href="javascript:alert('TODO');">User</a></li>
              </ul>
            </div>
          </header>
          <div className="container">
            <Switch>
              <Redirect exact from='/' to='/invoices' />
              <Route exact path='/invoices' component={InvoiceList} />
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
