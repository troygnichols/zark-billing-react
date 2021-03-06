import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { createInvoice } from './lib/pdf.js';
import blobStream from 'blob-stream';
import { calcAmount, calcTotalAmount } from './lib/util.js';
import './styles/Invoice.css';
import { getConfig } from './config.js';
import { getAuthToken } from './lib/auth.js';
import ModalConfirm from './ModalConfirm.js';
import ModalLoading from './ModalLoading.js';
import { toast } from 'react-toastify';
import ButtonControls from './ButtonControls.js';
import { withErrors } from './ErrorProvider.js';

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
    const { history, error: globalError } = this.props;
    fetch(`${getConfig('api.baseUrl')}/invoices/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getAuthToken()
      }
    }).then(resp => {
      switch(resp.status) {
        case 200:
          resp.json().then(({invoice}) => {
            this.setState({ invoice, hasLoaded: true });
          });
          break;
        case 401:
          history.push('/login');
          break;
        default:
          console.error('Could not load invoices data', resp);
          globalError(
            'Server error, could not load invoices!', () =>
            history.push('/login'))
      }
    }).catch(err => {
      console.error('Communication error', err);
      globalError(
        'There was a problem communicating with the server!',
        history.push('/'));
    }).finally(() => {
      this.setState(prev => ({...prev, hasLoaded: true}));
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
    const { id } = this.state.invoice;
    const { history, error: globalError } = this.props;
    fetch(`${getConfig('api.baseUrl')}/invoices/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getAuthToken()
      }
    }).then(resp => {
      switch(resp.status) {
        case 200:
        case 202:
        case 204:
          toast.success('Invoice successfully deleted');
          history.push('/invoices');
          break;
        case 401:
          history.push('/login');
          break;
        default:
          console.error('Delete invoice failed', resp);
          globalError('Server error, could not delete invoice!');
      }
    }).catch(err => {
      console.error('Communication error', err);
      globalError('There was a problem communicating with the server!');
    });
  }

  render() {
    const { invoice, showConfirmDeleteModal, hasLoaded } = this.state

    const totalStyle = {
      backgroundColor: '#99CC33', color: '#000', fontSize: '120%'
    };

    return (
      <div>
        <ModalLoading if={!hasLoaded} />
        <ModalConfirm if={showConfirmDeleteModal}
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
                    <td>Invoice ID</td>
                    <td>{invoice.invoice_id}</td>
                  </tr>
                  <tr>
                    <td>Issued On</td>
                    <td>{invoice.issue_date || '--'}</td>
                  </tr>
                  <tr>
                    <td>Due On</td>
                    <td>{invoice.due_date || '--'}</td>
                  </tr>
                  <tr>
                    <td>Payment</td>
                    <td>{ invoice.paid_date
                        ? invoice.paid_date
                        : <em>Not paid</em>}
                    </td>
                  </tr>
                  <tr>
                    <td>Subject</td>
                    <td>{invoice.subject}</td>
                  </tr>
                </tbody>
              </table>
              </div>
              <div className="column">
                { invoice.notes ?
                    <div className="zark-notes-display">
                      <h2>Notes</h2>
                      <p>{invoice.notes}</p>
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
                invoice.items.map(item => (
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
        <div className="is-pulled-left">
          <ButtonControls className="is-pulled-left">
            <Link to={`/invoices/${invoice.id}/edit`}
              className="button">Edit Invoice</Link>
            <button onClick={this.handleGeneratePdf}
              className="button is-primary">Generate PDF</button>
          </ButtonControls>
        </div>
        <button onClick={this.handleDeleteInvoice}
          className="is-pulled-right button is-danger">
            <i className="delete"></i>&nbsp;Delete Invoice</button>
      </div>
    );
  }
}

export default withErrors(Invoice);
