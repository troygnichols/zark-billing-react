import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { buildInvoicePayload } from './util';
import { getConfig } from './config.js';
import difference from 'lodash.difference';
import InvoiceForm from './InvoiceForm.js';

class EditInvoice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      invoice: {
        entity_name: '',
        client_name: '',
        invoice_id: '',
        due_date: '',
        issue_date: '',
        paid_date: '',
        subject: '',
        items: {}
      },
      originalItemIds: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    fetch(`${getConfig('api.baseUrl')}/invoices/${id}`)
      .then(resp => resp.json())
      .then((data) => {
        this.setState((prevState) => (
          {
            ...prevState,
            invoice: data.invoice,
            originalItemIds: (data.invoice.items || []).map(item => (item.id))
          }
        ));
      });
  }

  handleChange(invoice) {
    this.setState((prevState) => ({...prevState, invoice: invoice}));
  }

  handleSubmit(event) {
    event.preventDefault();
    const history = this.props.history;
    const invoice = this.state.invoice;
    const idsToDel = this.findIdsToDel();
    fetch(`${getConfig('api.baseUrl')}/invoices/${invoice.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: buildInvoicePayload(this.state.invoice, idsToDel)
    })
      .then(resp => resp.json)
      .then(data => {
        history.push(`/invoices/${invoice.id}`);
      });
  }

  findIdsToDel() {
    const items = this.state.invoice.items;
    const newItemIds = Object.keys(items).map((key) => (items[key].id));
    return difference(this.state.originalItemIds, newItemIds);
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
        <h1>Edit Invoice</h1>
        <InvoiceForm invoice={this.state.invoice} onChange={this.handleChange} />
        <a href="#save" className="button" onClick={this.handleSubmit}>Save</a>
        <Link to={`/invoices/${invoice.id}`} className="cancel button">Cancel</Link>
        <br/>
        <br/>
      </div>
    );
  }
}

export default withRouter(EditInvoice);
