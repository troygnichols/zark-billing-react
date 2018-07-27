import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import InvoiceForm from './InvoiceForm.js';
import { getConfig } from './config.js';
import { buildInvoicePayload } from './lib/util.js';
import { getAuthToken, getUserProfile } from './lib/auth.js';

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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(invoice) {
    this.setState((prevState) => ({...prevState, invoice: invoice}));
  }

  handleSubmit(event) {
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
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.error) {
          history.push('/login');
        } else {
          history.push(`/invoices/${data.invoice.id}`);
        }
      });
  }

  render() {
    const invoice = this.state.invoice;
    return (
      <div className="container">
        <nav className="breadcrumb">
          <ul>
            <li><Link to="/invoices">Invoices</Link></li>
            <li><Link to={`/invoices/${invoice.id}`}>Invoice {invoice.invoice_id}</Link></li>
            <li className="is-active"><a href="#new">New Invoice</a></li>
          </ul>
        </nav>
        <InvoiceForm
          invoice={this.state.invoice}
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
