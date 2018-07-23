import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { createInvoice } from './pdf.js';
import blobStream from 'blob-stream';
import { calcAmount, calcTotalAmount } from './util';
import './Invoice.css';
import { getConfig } from './config.js';
import { getAuthToken } from './auth.js';

class Invoice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      invoice: { items: [] }
    };
    this.handleGeneratePdf = this.handleGeneratePdf.bind(this);
    this.handleDeleteInvoice = this.handleDeleteInvoice.bind(this);
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
          this.setState({
            invoice: data.invoice
          });
        }
      });
  }

  handleGeneratePdf(event) {
    event.preventDefault();

    const stream = blobStream();
    stream.on('finish', function() {
      const url = this.toBlobURL('application/pdf');
      window.open(url);
    });
    createInvoice(stream, this.state.invoice);
  }

  handleDeleteInvoice(event) {
    event.preventDefault();
    const id = this.state.invoice.id;
    const history = this.props.history;
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      fetch(`${getConfig('api.baseUrl')}/invoices/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthToken()
        }
      })
        .then(resp => resp.json)
        .then(data => {
          history.push('/invoices');
        });
    }
  }

  renderLineItems() {
    return this.state.invoice.items.map((item) => (
      <tr key={item.id}>
        <td>{item.description}</td>
        <td>{item.quantity}</td>
        <td>{item.unit_price}</td>
        <td>${calcAmount(item)}</td>
      </tr>
    ));
  }

  render() {
    const invoice = this.state.invoice;
    const totalStyle = { backgroundColor: '#99CC33', color: '#000', fontSize: '120%'};
    return (
      <div>
        <nav>
          <ul className="breadcrumb">
            <li><Link to='/invoices'>Invoices</Link></li>
            <li>Invoice {invoice.invoice_id}</li>
          </ul>
        </nav>
        <table className="invoice-table">
          <tbody>
            <tr>
              <td>Invoice ID</td>
              <td>{invoice.invoice_id}</td>
            </tr>
            <tr>
              <td>Your Business</td>
              <td>{invoice.entity_name}</td>
            </tr>
            <tr>
              <td>Your Address</td>
              <td style={{whiteSpace: 'pre-line'}}>{(invoice.entity_address || '')}</td>
            </tr>
            <tr>
              <td>Client</td>
              <td>{invoice.client_name}</td>
            </tr>
            <tr>
              <td>Issued On</td>
              <td>{invoice.issue_date}</td>
            </tr>
            <tr>
              <td>Due On</td>
              <td>{invoice.due_date}</td>
            </tr>
            <tr>
              <td>Subject</td>
              <td>{invoice.subject}</td>
            </tr>
            <tr>
              <td>Payment</td>
              <td>{invoice.paid_date || 'Not paid'}</td>
            </tr>
            <tr>
              <td>Notes</td>
              <td>{invoice.notes}</td>
            </tr>
          </tbody>
        </table>

        <h4>Line Items</h4>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th><strong>Amount</strong></th>
            </tr>
          </thead>
          <tbody>
            {this.renderLineItems()}
            <tr>
              <td style={totalStyle} colSpan="3">Total</td>
              <td style={totalStyle}>${calcTotalAmount(invoice)}</td>
            </tr>
          </tbody>
        </table>

        {this.state.document}

        <hr/>
        <div className="clearfix action-controls">
          <div style={{float: 'left'}}>
            <Link to={`/invoices/${invoice.id}/edit`} className="button">Edit Invoice</Link>
            <a href="#pdf" onClick={this.handleGeneratePdf} className="action button">Generate PDF</a>
          </div>
          <a style={{float: 'right'}} href="#del" onClick={this.handleDeleteInvoice} className="delete button">✖ Delete Invoice</a>
        </div>
      </div>
    );
  }
}

export default withRouter(Invoice);
