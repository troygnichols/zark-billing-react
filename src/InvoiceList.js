import React, { Component } from 'react';
import './App.css';

import { Link } from 'react-router-dom';

import './InvoiceList.css';

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
          <td className="hidesmall">{invoice.entity_name}</td>
          <td>{invoice.client_name}</td>
          <td>{invoice.issue_date}</td>
          <td className="hidesmall">{invoice.due_date}</td>
          <td className="hidesmall">{invoice.subject}</td>
          <td className="hidesmall">{invoice.notes}</td>
          <td className="hidesmall">{paid}</td>
          <td>
            <Link to={`/invoices/${invoice.id}`}>View</Link>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <table border="1" className="invoice-list-table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th className="hidesmall">Your Business</th>
            <th>Client</th>
            <th>Issued</th>
            <th className="hidesmall">Due</th>
            <th className="hidesmall">Subject</th>
            <th className="hidesmall">Notes</th>
            <th className="hidesmall">Paid?</th>
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
