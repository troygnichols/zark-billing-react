import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { buildInvoicePayload } from './lib/util.js';
import { getConfig } from './config.js';
import difference from 'lodash.difference';
import InvoiceForm from './InvoiceForm.js';
import { getAuthToken } from './lib/auth.js';
import { toast } from 'react-toastify';
import ModalLoading from './ModalLoading.js';
import ButtonControls from './ButtonControls.js';
import { withErrors } from './ErrorProvider.js';

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
    this.invoiceForm = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
          resp.json().then(({invoice, ...{items}}) => {
            this.setState((prevState) => ({
              ...prevState, hasLoaded: true, invoice,
              originalItemIds: (items || []).map(item => (item.id)),
            }));
          });
          break;
        case 401:
          history.push('/login');
          break;
        default:
          console.error('Could not load invoice data', resp);
          globalError('Server error, could not load invoice!', () =>
            history.push('/'));
      }
    }).catch(err => {
      console.error('Communication error', err);
      globalError('There was a problem communicating with the server!', () =>
        history.push('/'));
    }).finally(() => {
      this.setState(prev => ({...prev, hasLoaded: true}));
    });
  }

  handleChange(invoice) {
    this.setState((prevState) => ({...prevState, invoice}));
  }

  handleSubmit(event) {
    event.preventDefault();
    const { history, error: globalError }  = this.props;
    const { invoice } = this.state;
    const idsToDel = this.findIdsToDel();
    fetch(`${getConfig('api.baseUrl')}/invoices/${invoice.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getAuthToken()
      },
      body: buildInvoicePayload(this.state.invoice, idsToDel)
    }).then(resp => {
      switch(resp.status) {
        case 200:
          resp.json().then(() => {
            toast.success('Invoice updated');
            history.push(`/invoices/${invoice.id}`);
          })
          break;
        case 401:
          history.push('/login');
          break;
        case 422:
          resp.json().then(errors => this.setState({errors}));
          ReactDOM.findDOMNode(this.refs.top).scrollIntoView();
          break;
        default:
          console.error('Save invoice failed', resp);
          globalError('Server error, could not update invoice!');
      };
    }).catch(err => {
      console.error('Communication error', err);
      globalError('There was a problem communicating with the server!');
    });
  }

  findIdsToDel() {
    const { items } = this.state.invoice;
    const newItemIds = Object.keys(items).map((key) => (items[key].id));
    return difference(this.state.originalItemIds, newItemIds);
  }

  render() {
    const { hasLoaded, invoice, errors } = this.state;
    return (
      <div ref="top" className="container">
        <ModalLoading if={!hasLoaded} />
        <nav className="breadcrumb">
          <ul>
            <li><Link to="/invoices">Invoices</Link></li>
            <li><Link to={`/invoices/${invoice.id}`}>Invoice {invoice.invoice_id}</Link></li>
            <li className="is-active"><a href="#edit">Edit Invoice</a></li>
          </ul>
        </nav>
        <h1 className="title">Edit Invoice</h1>
        <InvoiceForm
          invoice={invoice} errors={errors}
          onChange={this.handleChange} />
        <hr/>
        <ButtonControls>
          <Link to={`/invoices/${invoice.id}`} className="cancel button">Cancel</Link>
          <a href="#save" className="is-link button has-text-weight-bold" onClick={this.handleSubmit}>Save</a>
        </ButtonControls>
      </div>
    );
  }
}

export default withErrors(EditInvoice);
