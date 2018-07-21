import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import InvoiceForm from './InvoiceForm.js';
import { getConfig } from './config.js';
import { buildInvoicePayload } from './util.js';

class NewInvoice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      invoice: {},
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
        'Accept': 'application/json'
      },
      body: buildInvoicePayload(this.state.invoice)
    })
      .then(resp => resp.json())
      .then(data => {
        history.push(`/invoices/${data.invoice.id}`);
      });
  }

  render() {
    const invoice = this.state.invoice;
    return (
      <div className="container">
        <nav>
          <ul className="breadcrumb">
            <li><Link to="/invoices">Invoices</Link></li>
            <li><Link to={`/invoices/${invoice.id}`}>Invoice {invoice.invoice_id}</Link></li>
            <li>Edit Invoice</li>
          </ul>
        </nav>
        <InvoiceForm
          invoice={this.state.invoice}
          onChange={this.handleChange} />
        <a href="#" className="button" onClick={this.handleSubmit}>Save</a>
        <Link to="/invoices" className="cancel button">Cancel</Link>
        <br/>
        <br/>
      </div>
    );
  }
}

export default withRouter(NewInvoice);
