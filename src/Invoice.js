import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';


class Invoice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      invoice: { items: [] }
    };
    this.handleGeneratePdf = this.handleGeneratePdf.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    fetch(`http://localhost:4000/invoices/${id}`)
      .then(resp => resp.json())
      .then((data) => {
        this.setState({
          invoice: data.invoice
        });
      });
  }

  // TODO: this is duplicated in EditInvoice.js, extract somewhere
  calcAmount(item) {
    const amt = parseInt(item.quantity, 10) * parseInt(item.unit_price, 10);
    return amt || 0;
  }

  calcTotalAmount(invoice) {
    const self = this;
    return invoice.items.reduce((acc, item) => (
      acc + self.calcAmount(item)
    ), 0);
  }

  handleGeneratePdf(event) {
    event.preventDefault();
    console.log('gen pdf');
  }

  renderLineItems() {
    return this.state.invoice.items.map((item) => (
      <tr key={item.id}>
        <td>{item.description}</td>
        <td>{item.quantity}</td>
        <td>{item.unit_price}</td>
        <td>${this.calcAmount(item)}</td>
      </tr>
    ));
  }

  render() {
    const invoice = this.state.invoice;
    return (
      <div>
        <table border="1">
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

        <table border="1">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {this.renderLineItems()}
            <tr>
              <td colSpan="3"><strong>Total</strong></td>
              <td>${this.calcTotalAmount(invoice)}</td>
            </tr>
          </tbody>
        </table>

        <hr/>
        <button onClick={this.handleGeneratePdf}>Generate PDF</button>
        <br/>
        <br/>
        <Link to={`/invoices/${invoice.id}/edit`}>Edit Invoice</Link>
      </div>
    );
  }
}

export default withRouter(Invoice);
