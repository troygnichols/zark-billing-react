import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';


class Invoice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      invoice: {}
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    fetch(`http://localhost:4000/invoices/${id}`)
      .then(resp => resp.json())
      .then((data) => {
        console.log('data', data);
        this.setState({
          invoice: data.invoice
        });
      });
  }

  render() {
    const invoice = this.state.invoice;
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>Invoice ID</td>
              <td>{invoice.invoice_id}</td>
            </tr>
            <tr>
              <td>Your Business</td>
              <td>{invoice.entity_id}</td>
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
              <td>{invoice.paid_at || 'Not paid'}</td>
            </tr>
            <tr>
              <td>Notes</td>
              <td>{invoice.notes}</td>
            </tr>
          </tbody>
        </table>

        <hr/>
        <Link to={`/invoices/${invoice.id}/edit`}>Edit Invoice</Link>
      </div>
    );
  }
}

export default withRouter(Invoice);
