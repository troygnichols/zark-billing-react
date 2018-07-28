import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import InvoiceForm from './InvoiceForm.js';
import { getConfig } from './config.js';
import { buildInvoicePayload } from './lib/util.js';
import { getAuthToken, getUserProfile, isLoggedIn } from './lib/auth.js';
import { toast } from 'react-toastify';
import ButtonControls from './ButtonControls.js';
import { withErrors } from './ErrorProvider.js';

class NewInvoice extends Component {

  constructor(props) {
    super(props);
    const {name, address} = getUserProfile();
    this.state = {
      invoice: {
        entity_name: name,
        entity_address: address
      },
    };
  }

  handleChange = (invoice) => {
    this.setState((prevState) => ({...prevState, invoice: invoice}));
  };

  componentDidMount() {
    const { history } = this.props;
    if (!isLoggedIn()) {
      history.push('/login');
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { history, error: globalError } = this.props;
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
          globalError('Server error, could not load invoices!');
      }
    }).catch(err => {
      console.error('Communication error', err);
      globalError('There was a problem communicating with the server!');
    });
  };

  render() {
    const { invoice, errors } = this.state;
    return (
      <div ref="top" className="container">
        <nav className="breadcrumb">
          <ul>
            <li><Link to="/invoices">Invoices</Link></li>
            <li className="is-active"><a href="#new">New Invoice</a></li>
          </ul>
        </nav>
        <InvoiceForm
          invoice={invoice} errors={errors}
          onChange={this.handleChange} />

        <hr/>
        <ButtonControls>
          <Link to="/invoices" className="cancel button">Cancel</Link>
          <a href="#save" className="button is-link has-text-weight-bold"
            onClick={this.handleSubmit}>Save</a>
        </ButtonControls>
      </div>
    );
  }
}

export default withErrors(NewInvoice);
