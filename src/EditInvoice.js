import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

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
        paid_at: '',
        subject: '',
        items: {
          // 2: {description: 'foobar', quantity: 2, unit_price: 100},
          // 1: {description: 'barz', quantity: 3, unit_price: 75},
        }
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddLineItem = this.handleAddLineItem.bind(this);
    this.handleDeleteLineItem = this.handleDeleteLineItem.bind(this);
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

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name;

    if (name.startsWith('items')) {
      const [, fieldName, index] = name.split('.');
      this.setState((prevState) => {
        return {
          ...prevState,
          items: {
            ...prevState.invoice.items,
            [index]: {
              ...prevState.invoice.items[index],
              [fieldName]: value
            }
          }
        };
      });
    } else {
      this.setState({ [name]: value });
    }
  }

  handleDeleteLineItem(event) {
    event.preventDefault();
    const keyToDel = event.target.getAttribute('data-key');
    const self = this;
    this.setState((prevState) => {
      const newItems = {};
      const keys = self.getOrderedKeys(prevState.invoice.items);
      keys.forEach((key, index) => {
        if (key !== parseInt(keyToDel, 10)) {
          newItems[Object.keys(newItems).length] = prevState.invoice.items[key];
        }
      });
      return {
        ...prevState,
        invoice: {
          ...prevState.invoice,
          items: newItems
        }
      };
    });
  }

  handleAddLineItem(event) {
    event.preventDefault();
    this.setState((prevState) => {
      const newKey = this.getNextLineItemKey(prevState.invoice.items);
      return {
        ...prevState,
        invoice: {
          ...prevState.invoice,
          items: {
            [newKey]: {
              description: '', quantity: '', unit_price: 0
            },
            ...prevState.invoice.items
          }
        }
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('saving state', this.state);
  }

  getNextLineItemKey(items) {
    const keys = Object.keys(items);
    const highestKey = this.getOrderedKeys(items)[keys.length-1];
    return (parseInt(highestKey, 10) || 0) + 1;
  }

  calcAmount(item) {
    const amt = parseInt(item.quantity, 10) * parseInt(item.unit_price, 10);
    return amt || 0;
  }

  getOrderedKeys(items) {
    const keys =  Object.keys(items).map((key) => {
      return parseInt(key, 10)
    })
    return keys.sort(function(a, b) { return a > b });
  }

  renderLineItems() {
    const items = this.state.invoice.items;
    return this.getOrderedKeys(items).map((key, index) => {
      const item = items[key];
      return (
        <tr key={parseInt(key, 10)}>
          <td>
            <input type="text" name={`items.description.${key}`} required
              placeholder="Development on new features"
              value={item.description}
              onChange={this.handleChange} />
          </td>
          <td>
            <input type="text" name={`items.quantity.${key}`} required
              value={item.quantity}
              onChange={this.handleChange} />
          </td>
          <td>
            <input type="text" name={`items.unit_price.${key}`} required
              value={item.unit_price}
              onChange={this.handleChange} />
          </td>
          <td>
            <input type="text" name={`items.amount.${key}`} disabled
              value={this.calcAmount(item)} />
          </td>
          <td>
            <button onClick={this.handleDeleteLineItem} data-key={key}>✖</button>
          </td>
        </tr>
      );
    })

  }

  render() {
    const invoice = this.state.invoice;
    return (
      <div className="container">
        <h1>Edit Invoice</h1>
        <form className="edit-form" onSubmit={this.handleSubmit}>
          <div>
            <label>Your Business</label>
            <input type="text" name="entity_name" required autoFocus
              placeholder="Foobar LLC"
              value={invoice.entity_name}
              onChange={this.handleChange} />
          </div>
          <div>
            <label>Your Client</label>
            <input type="text" name="client_name" required
              placeholder="Bankcorp"
              value={invoice.client_name}
              onChange={this.handleChange} />
          </div>
          <div>
            <label>Invoice ID</label>
            <input type="text" name="invoice_id" required
              value={invoice.invoice_id}
              onChange={this.handleChange} />
          </div>
          <div>
            <label>Date Issued</label>
            <input type="date" name="issue_date" required
              value={invoice.issue_date}
              onChange={this.handleChange} />
          </div>
          <div>
            <label>Due Date</label>
            <input type="date" name="due_date" required
              value={invoice.due_date}
              onChange={this.handleChange} />
          </div>
          <div>
            <label>Paid</label>
            <input type="date" name="due_date"
              value={invoice.paid_at || ''}
              onChange={this.handleChange} />
          </div>
          <div>
            <label>Subject</label>
            <input type="text" name="subject" required
              value={invoice.subject}
              onChange={this.handleChange} />
          </div>
          <div>
            <label>Notes</label>
            <textarea value={invoice.notes} />
          </div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>$ Unit Price</th>
                <th>$ Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.renderLineItems()}
            </tbody>
          </table>

          <hr/>
          <button onClick={this.handleAddLineItem}>New Line Item</button>
          <hr/>
          <button type="submit">Save</button>
          <br/>
          <br/>
          <Link to={`/invoices/${invoice.invoice_id}`}>Cancel</Link>
        </form>
      </div>
    );
  }
}

export default withRouter(EditInvoice);
