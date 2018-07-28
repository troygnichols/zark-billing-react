import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getConfig } from './config.js';
import { getAuthToken, isLoggedIn } from './lib/auth.js';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import './styles/InvoiceList.css';
import SimpleTable from './SimpleTable.js';
import { calcAmount, calcTotalAmount } from './lib/util.js';
import { withErrors } from './ErrorProvider.js';

class InvoiceList extends Component {
  constructor() {
    super();
    this.state = {
      invoices: [],
    };
  }

  componentWillMount() {
    if (!isLoggedIn()) {
      this.props.history.push('/login');
    }
  }

  componentDidMount() {
    const { history, error: globalError } = this.props;
    fetch(`${getConfig('api.baseUrl')}/invoices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getAuthToken()
      }
    }).then(resp => {
      switch(resp.status) {
        case 200:
          resp.json().then(({invoices}) => {
            this.setState({ invoices, hasLoaded: true });
          });
          break;
        case 401:
          history.push('/login');
          break;
        default:
          console.error('Could not load invoices data', resp);
          globalError('Server error, could not load invoices!', () =>
            history.push('/'));
      }
    }).catch(err => {
      console.error('Communication error', err);
      globalError('There was a problem communicating with the server!', () =>
        history.push('/login'));
    });
  }

  paidStyle(paid) {
    return paid ? {color: 'rgb(153, 204, 51)'} : {color: 'red'};
  }

  render() {
    const missing = (msg) => <em>{msg}</em>;
    const { invoices, hasLoaded } = this.state;

    return (
      <div>
        <h1 className="title">Invoices</h1>
        <ReactTable data={invoices}
          noDataText={hasLoaded ? 'No invoices found' : 'Loading…'}
          columns={[
            { Header: 'ID', accessor: 'invoice_id' },
            { Header: 'Name', accessor: 'entity_name' },
            { Header: 'Client', accessor: 'client_name' },
            { Header: 'Issued', accessor: 'issue_date' },
            { Header: 'Due', accessor: 'due_date' },
            {
              Header: 'Paid?', accessor: 'paid_date',
              Cell: props =>
                <span style={this.paidStyle(props.value)}>{
                  props.value ? 'Yes' : 'No'}</span>,
              filterMethod: (filter, row) => {
                switch (filter.value) {
                  case 'paid':
                    return !!row[filter.id];
                  case 'unpaid':
                    return !row[filter.id];
                  default:
                    return true;
                }
              },
              Filter: ({filter, onChange}) =>
                <select onChange={(event) => onChange(event.target.value)}
                  style={{width: '100%', height: '100%'}}>
                  <option value="all"></option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
            },
            {
              accessor: 'id', Cell: props =>
                <Link to={`/invoices/${props.value}`}
                  style={{fontWeight: 'bold'}}>More&#8230;</Link>,
              Filter: () => null
            }
          ]}
          filterable
          defaultFilterMethod={(filter, row) => (
            String(row[filter.id]).toLowerCase().includes(
              String(filter.value).toLowerCase())
          )}
          defaultPageSize={10}
          className="-striped -highlight invoice-list-table"
          SubComponent={({original: invoice}) => {
            const {subject, notes, items, paid_date} = invoice;
            return (
              <div className="details">
                <h4>Subject</h4>
                <p>{subject || missing('No subject')}</p>
                <h4>Notes</h4>
                <p>{notes || missing('No notes')}</p>
                <h4>Line Items</h4>
                {items.length
                    ?
                    <div>
                      <SimpleTable className="item-table" data={items} columns={[
                        { Header: 'Description', accessor: 'description' },
                        { Header: 'Qty', accessor: 'quantity' },
                        { Header: 'Unit $', accessor: 'unit_price' },
                        { Header: 'Amount $', fn: (item) => calcAmount(item) },
                      ]} />
                  </div>
                    : <p>{missing('No line items')}</p>
                }
                <h4>{paid_date ? 'Amount Paid' : 'Amount Due'}:&nbsp;
                  ${calcTotalAmount(invoice)}</h4>
              </div>
            );
          }}
        />
        <div className="section">
          <Link style={{float: 'right'}}to="/invoices/new"
            className="button">&#65291; New Invoice</Link>
        </div>
      </div>
    );
  }
}

export default withErrors(InvoiceList);
