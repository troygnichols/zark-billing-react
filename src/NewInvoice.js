import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link } from 'react-router-dom';
import InvoiceForm from './InvoiceForm.js';
import { getConfig } from './config.js';
import { buildInvoicePayload } from './lib/util.js';
import { getAuthToken, getUserProfile } from './lib/auth.js';
import { toast } from 'react-toastify';
import ModalError from './ModalError.js';

class NewInvoice extends Component {

  constructor(props) {
    super(props);
    const profile = getUserProfile();
    this.state = {
      invoice: {
        entity_name: profile.name,
        entity_address: profile.address
      },
    };
  }

  handleChange = (invoice) => {
    this.setState((prevState) => ({...prevState, invoice: invoice}));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const history = this.props.history;
    fetch(`${getConfig('api.baseUrl')}/invoices/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getAuthToken()
      },
      body: buildInvoicePayload(this.state.invoice)
    }).then(resp => {
      switch(resp.status) {
        case 201:
          resp.json().then(({invoice: {id}}) => {
            toast.success('Successfully created invoice');
            history.push(`/invoices/${id}`);
          });
          break;
        case 401:
          history.push('/login');
          break;
        case 422:
          resp.json().then(errors => this.setState({errors}));
          ReactDOM.findDOMNode(this.refs.top).scrollIntoView();
          break;
        default:
          console.error('Could not load invoice data', resp);
          this.setState({
            modalError: 'Server error, could not load invoices!'
          });
      }
    }).catch(err => {
      console.error('Communication error', err);
      this.setState({
        modalError: 'There was a problem communicating with the server!'
      });
    });
  };

  render() {
    const { invoice, modalError, errors } = this.state;
    return (
      <div ref="top" className="container">
        <ModalError if={modalError}>
          <p className="has-text-centered">
            {modalError}
          </p>
          <p className="has-text-centered">
            <a className="button"
              onClick={() => window.location.reload()}>Reload page</a>
          </p>
        </ModalError>
        <nav className="breadcrumb">
          <ul>
            <li><Link to="/invoices">Invoices</Link></li>
            <li><Link to={`/invoices/${invoice.id}`}>Invoice {invoice.invoice_id}</Link></li>
            <li className="is-active"><a href="#new">New Invoice</a></li>
          </ul>
        </nav>
        <InvoiceForm
          invoice={invoice} errors={errors}
          onChange={this.handleChange} />

        <hr/>
        <div className="field is-grouped">
          <div className="control">
            <a href="#save" className="button is-link"
              onClick={this.handleSubmit}>Save</a>
          </div>
          <div className="control">
            <Link to="/invoices" className="cancel button">Cancel</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(NewInvoice);
