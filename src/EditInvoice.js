import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { buildInvoicePayload } from './lib/util.js';
import { getConfig } from './config.js';
import difference from 'lodash.difference';
import InvoiceForm from './InvoiceForm.js';
import { getAuthToken } from './lib/auth.js';

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
    const history = this.props.history;
    fetch(`${getConfig('api.baseUrl')}/invoices/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getAuthToken()
      }
    })
      .then(resp => resp.json())
      .then((data) => {
        if (data.error) {
          history.push('/login');
        } else {
          this.setState((prevState) => (
            {
              ...prevState,
              invoice: data.invoice,
              originalItemIds: (data.invoice.items || []).map(item => (item.id))
            }
          ));
        }
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
        'Accept': 'application/json',
        'Authorization': getAuthToken()
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
        <nav className="breadcrumb">
          <ul>
            <li><Link to="/invoices">Invoices</Link></li>
            <li><Link to={`/invoices/${invoice.id}`}>Invoice {invoice.invoice_id}</Link></li>
            <li className="is-active"><a href="#edit">Edit Invoice</a></li>
          </ul>
        </nav>
        <h1 className="title">Edit Invoice</h1>
        <InvoiceForm invoice={this.state.invoice} onChange={this.handleChange} />

        <hr/>
        <div className="field is-grouped">
          <p className="control">
            <a href="#save" className="is-link button" onClick={this.handleSubmit}>Save</a>
          </p>
          <p className="control">
            <Link to={`/invoices/${invoice.id}`} className="cancel button">Cancel</Link>
          </p>
        </div>
      </div>
    );
  }
}

export default withRouter(EditInvoice);
