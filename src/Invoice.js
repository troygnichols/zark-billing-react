import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { createInvoice } from './lib/pdf.js';
import blobStream from 'blob-stream';
import { calcAmount, calcTotalAmount } from './lib/util.js';
import './styles/Invoice.css';
import { getConfig } from './config.js';
import { getAuthToken } from './lib/auth.js';
import ModalConfirm from './ModalConfirm.js';

class Invoice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      invoice: { items: [] }
    };
    this.handleGeneratePdf = this.handleGeneratePdf.bind(this);
    this.handleDeleteInvoice = this.handleDeleteInvoice.bind(this);
    this.commitDelete = this.commitDelete.bind(this);
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
    this.setState(prevState => (
      { ...prevState, showConfirmDeleteModal: true }
    ));
  }

  commitDelete() {
    const id = this.state.invoice.id;
    const history = this.props.history;
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

  renderLineItems() {
    return ;
  }

  render() {
    const invoice = this.state.invoice;
    const totalStyle = { backgroundColor: '#99CC33', color: '#000', fontSize: '120%'};
    return (
      <div>
        <ModalConfirm if={this.state.showConfirmDeleteModal}
          title="Confirm Delete" confirmText="Yes, delete it"
          onConfirm={this.commitDelete}
          onCancel={() => {
            this.setState(prevState => (
              {...prevState, showConfirmDeleteModal: false}
            ))}}>
          <p>Are you sure you want to delete invoice {invoice.invoice_id} for {invoice.client_name || <em>unknown client</em>}?</p>
        </ModalConfirm>

        <nav className="breadcrumb">
          <ul>
            <li><Link to='/invoices'>Invoices</Link></li>
            <li className="is-active"><a href="#invoice">Invoice {invoice.invoice_id}</a></li>
          </ul>
        </nav>

          <div className="columns">
            <div className="column">
              <table className="table is-bordered is-striped is-fullwidth">
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
                    <td style={{whiteSpace: 'pre-line'}}>
                      {(invoice.entity_address||'')}</td>
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
                </tbody>
              </table>
              </div>
              <div className="column">
                { invoice.notes ?
                    <div className="zark-notes-display">
                      <h2>Notes</h2>
                      <p className="zark-notes-display">{invoice.notes}</p>
                    </div> : null
                }
              </div>
          </div>

        <div className="zark-line-items">
          <h2>Line Items</h2>
          <table className="invoice-table table is-bordered">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th><strong>Amount</strong></th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.invoice.items.map(item => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit_price}</td>
                    <td>${calcAmount(item)}</td>
                  </tr>
                ))
              }
              <tr>
                <td style={totalStyle} colSpan="3">Total</td>
                <td style={totalStyle}>${calcTotalAmount(invoice)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr/>
        <div className="field is-grouped is-pulled-left">
          <p className="control">
            <Link to={`/invoices/${invoice.id}/edit`}
              className="button">Edit Invoice</Link>
          </p>
          <p className="control">
          <button onClick={this.handleGeneratePdf}
            className="button is-primary">Generate PDF</button>
          </p>
        </div>
          <button onClick={this.handleDeleteInvoice}
            className="is-pulled-right button is-danger">
            <i className="delete"></i>&nbsp;Delete Invoice</button>
      </div>
    );
  }
}

export default withRouter(Invoice);
