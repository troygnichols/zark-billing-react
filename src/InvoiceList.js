import React, { Component } from 'react';
import './App.css';
import './InvoiceList.css';
import { Link } from 'react-router-dom';
import { getConfig } from './config.js';
import { getAuthToken, isLoggedIn } from './auth.js';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import SimpleTable from './SimpleTable.js';
import { calcAmount, calcTotalAmount } from './util.js';

class InvoiceList extends Component {
  constructor() {
    super();
    this.state = {
      invoices: []
    };
  }

  componentWillMount() {
    if (!isLoggedIn()) {
      this.props.history.push('/login');
    }
  }

  componentDidMount() {
    const history = this.props.history;
    fetch(`${getConfig('api.baseUrl')}/invoices`, {
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
            invoices: data.invoices
          });
        }
      });
  }

  paidStyle(paid) {
    return paid ? {} : {color: 'red'};
  }

  render() {
    const paidStyle = this.paidStyle;
    const missing = (msg) => <em>{msg}</em>;

    return (
      <div className="invoice-list-container">
        <ReactTable data={this.state.invoices}
          columns={[
            { Header: 'ID', accessor: 'invoice_id' },
            { Header: 'Name', accessor: 'entity_name' },
            { Header: 'Client', accessor: 'client_name' },
            { Header: 'Issued', accessor: 'issue_date' },
            { Header: 'Due', accessor: 'due_date' },
            {
              Header: 'Paid?', accessor: 'paid_date',
              Cell: props =>
                <span style={paidStyle(props.value)}>{
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
                <Link to={`/invoices/${props.value}`}>More...</Link>,
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
        <div className="clearfix action-controls">
          <Link style={{float: 'right'}}to="/invoices/new"
            className="button">New Invoice</Link>
        </div>
      </div>
    );
  }
}

export default InvoiceList;
