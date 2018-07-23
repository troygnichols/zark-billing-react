import React, { Component } from 'react';

import './styles/bulma/bulma.cyborg-theme.css';
import './styles/App.css';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import InvoiceList from './InvoiceList.js';
import Invoice from './Invoice.js';
import EditInvoice from './EditInvoice.js';
import NewInvoice from './NewInvoice.js';
import Login from './Login.js';
import NavBar from './NavBar.js';

class App extends Component {

  render() {
    return (
      <BrowserRouter className="App">
        <div className="App">
          <NavBar/>

          <div className="section">
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

          <footer className="footer">
            <div className="container has-text-centered">
              <p>
                The source code for this project is <strong><a href="https://github.com/troygnichols/zark-billing-react"
                    target="_blank" rel="noopener noreferrer">here</a></strong>.
              </p>
            </div>
          </footer>
        </div>
    </BrowserRouter>
    );
  }
}

export default App;
