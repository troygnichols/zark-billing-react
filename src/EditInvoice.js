import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link } from 'react-router-dom';
import { buildInvoicePayload } from './lib/util.js';
import { getConfig } from './config.js';
import difference from 'lodash.difference';
import InvoiceForm from './InvoiceForm.js';
import { getAuthToken } from './lib/auth.js';
import { toast } from 'react-toastify';
import ModalLoading from './ModalLoading.js';
import ModalError from './ModalError.js';
import ButtonControls from './ButtonControls.js';

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
    const history = this.props.history;
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
  }

  handleChange(invoice) {
    this.setState((prevState) => ({...prevState, invoice}));
  }

  handleSubmit(event) {
    event.preventDefault();
    const { history }  = this.props;
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
          this.setState({
            modalError: 'Server error, could not update invoice!'
          });
      };
    }).catch(err => {
      console.error('Communication error', err);
      this.setState({
        modalError: 'There was a problem communicating with the server!'
      });
    });
  }

  findIdsToDel() {
    const { items } = this.state.invoice;
    const newItemIds = Object.keys(items).map((key) => (items[key].id));
    return difference(this.state.originalItemIds, newItemIds);
  }

  isLoading() {
    const { modalError, hasLoaded } = this.state;
    return !modalError && !hasLoaded;
  }

  render() {
    const { modalError, invoice, errors } = this.state;
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
        <ModalLoading if={this.isLoading()} />
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

export default withRouter(EditInvoice);
