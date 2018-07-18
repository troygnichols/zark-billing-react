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
        <nav>
          <Link to='/invoices'>Invoices</Link>
        </nav>
        <div>
          <Switch>
            <Redirect exact from='/' to='/invoices' />
            <Route exact path='/invoices' component={InvoiceList} />
            <Route exact path='/invoices/:id' component={Invoice} />
            <Route exact path='/invoices/:id/edit' component={EditInvoice} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
