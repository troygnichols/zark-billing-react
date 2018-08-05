import React, { Component } from 'react';

import './styles/bulma/bulma.cyborg-theme.css';
import './styles/bulma/bulma.custom.css';
import './styles/App.css';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import InvoiceList from './InvoiceList.js';
import Invoice from './Invoice.js';
import EditInvoice from './EditInvoice.js';
import NewInvoice from './NewInvoice.js';
import Login from './Login.js';
import Profile from './Profile.js';
import ChangePassword from './ChangePassword.js';
import NavBar from './NavBar.js';
import { Zoom, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from './Signup.js';
import SignupSuccess from './SignupSuccess.js';
import ModalError from './ModalError';
import { ErrorProvider } from './ErrorProvider.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  error = (errorMessage, callback) => {
    this.setState(prev => (
      { ...prev, errorMessage, errorDismissCallback: callback })
    );
  }

  dismissError = () => {
    const { errorDismissCallback: callback } = this.state;
    callback && callback();
    this.setState(prev => (
      { ...prev,
        errorMessage: null,
        errorDismissCallback: null
      })
    );
  }

  render() {
    const { errorMessage } = this.state;
    return (
      <ErrorProvider value={{error: this.error}}>
        <div id="wrap">
          <ModalError if={errorMessage}>
            <i className="delete is-pulled-right"
              onClick={this.dismissError}></i>
            <p className="has-text-centered">
              {errorMessage}
            </p>
            <p className="has-text-centered">
              <a className="button"
                onClick={this.dismissError}>Dismiss</a>
            </p>
          </ModalError>
          <BrowserRouter className="App">
            <div className="App">
              <NavBar/>

              <div className="section">
                <div className="container">
                  <ToastContainer position={toast.POSITION.TOP_RIGHT}
                    className="toast-message"
                    hideProgressBar={true}
                    draggable
                    autoClose={5000}
                    newestOnTop={false}
                    closeOnClick={false}
                    pauseOnVisibilityChange={false}
                    transition={Zoom} />
                  <Switch>
                    <Redirect exact from='/' to='/invoices' />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/signup' component={Signup} />
                    <Route exact path='/signup/success' component={SignupSuccess} />
                    <Route exact path='/profile' component={Profile} />
                    <Route exact path='/change_password' component={ChangePassword} />
                    <Route exact path='/invoices' component={InvoiceList} />
                    <Route exact path='/invoices/new' component={NewInvoice} />
                    <Route exact path='/invoices/:id' component={Invoice} />
                    <Route exact path='/invoices/:id/edit' component={EditInvoice} />
                  </Switch>
                </div>
              </div>
            </div>
          </BrowserRouter>
        </div>

        <footer className="footer">
          <div className="container has-text-centered">
            <p>
              The source code for this project is <strong><a href="https://github.com/troygnichols/zark-billing-react"
                  target="_blank" rel="noopener noreferrer">here</a></strong>.
            </p>
          </div>
        </footer>

      </ErrorProvider>
    );
  }
}

export default App;
