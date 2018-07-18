import React, { Component } from 'react';
import './App.css';

import { Link } from 'react-router-dom';

class InvoiceList extends Component {
  constructor() {
    super();
    this.state = {
      invoices: []
    };
  }

  componentDidMount() {
    fetch('http://localhost:4000/invoices')
      .then(resp => resp.json())
      .then((data) => {
        this.setState({
          invoices: this.buildInvoices(data)
        });
      });
  }

  buildInvoices(data) {
    return data.invoices.map((invoice) => {
      const paid = invoice.paid_date ? 'Yes' : 'No';
      return (
        <tr key={invoice.id}>
          <td>{invoice.invoice_id}</td>
          <td>{invoice.entity_name}</td>
          <td>{invoice.client_name}</td>
          <td>{invoice.issue_date}</td>
          <td>{invoice.due_date}</td>
          <td>{invoice.subject}</td>
          <td>{invoice.notes}</td>
          <td>{paid}</td>
          <td>
            <Link to={`/invoices/${invoice.id}`}>View</Link>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Your Business</th>
            <th>Client</th>
            <th>Issued</th>
            <th>Due</th>
            <th>Subject</th>
            <th>Notes</th>
            <th>Paid?</th>
            <th>
            </th>
          </tr>
        </thead>
        <tbody>
          {this.state.invoices}
        </tbody>
      </table>
    );
  }
}

export default InvoiceList;
