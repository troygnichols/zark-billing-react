import React, { Component } from 'react';
import { calcAmount } from './util.js';

class InvoiceForm extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleAddLineItem = this.handleAddLineItem.bind(this);
    this.handleDeleteLineItem = this.handleDeleteLineItem.bind(this);
  }

  getOrderedKeys(items) {
    const keys =  Object.keys(items).map((key) => {
      return parseInt(key, 10)
    })
    return keys.sort(function(a, b) { return a > b });
  }

  getNextLineItemKey(items) {
    if (typeof(items) === 'undefined' || items === null) {
      return 0;
    }
    const keys = Object.keys(items);
    const highestKey = this.getOrderedKeys(items)[keys.length-1];
    return (parseInt(highestKey, 10) || 0) + 1;
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name || target.getAttribute('data-name');

    const prevInvoice = this.props.invoice;
    let newInvoice;

    if (name.startsWith('items')) {
      const [, fieldName, index] = name.split('.');
      newInvoice = { ...prevInvoice, items: {
        ...prevInvoice.items,
        [index]: {
          ...prevInvoice.items[index],
          [fieldName]: value } }
      }
    } else {
      newInvoice = { ...prevInvoice, [name]: value }
    }
    this.props.onChange(newInvoice);
  }

  handleDeleteLineItem(event) {
    event.preventDefault();
    const keyToDel = event.target.getAttribute('data-key');
    const newItems = {};
    const prevInvoice = this.props.invoice;
    this.getOrderedKeys(prevInvoice.items).forEach((key, index) => {
      const item = prevInvoice.items[key];
      if (key !== parseInt(keyToDel, 10)) {
        newItems[Object.keys(newItems).length] = item;
      }
    });
    const newInvoice = { ...prevInvoice, items: newItems };
    this.props.onChange(newInvoice);
  }

  handleAddLineItem(event) {
    event.preventDefault();
    const prevInvoice = this.props.invoice;
    const newKey = this.getNextLineItemKey(prevInvoice.items);
    const newInvoice = { ...prevInvoice, items: {
      [newKey]: { description: '', quantity: '', unit_price: 0 },
      ...prevInvoice.items
    }};
    this.props.onChange(newInvoice);
  }

  renderLineItems() {
    const items = this.props.invoice.items || [];
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
              value={calcAmount(item)} />
          </td>
          <td>
            <button onClick={this.handleDeleteLineItem} data-key={key}>✖</button>
          </td>
        </tr>
      );
    })
  }

  render() {
    const invoice = this.props.invoice;
    return (
      <form className="edit-form">
        <div>
          <label>Your Business</label>
          <input type="text" name="entity_name" required autoFocus
            placeholder="Foobar LLC"
            value={invoice.entity_name || ''}
            onChange={this.handleChange} />
        </div>
        <div>
          <label>Your Business Address</label>
          <br/>
          <textarea data-name="entity_address" value={invoice.entity_address}
            onChange={this.handleChange} cols="40" rows="2" />
        </div>
        <div>
          <label>Your Client</label>
          <input type="text" name="client_name" required
            placeholder="Bankcorp"
            value={invoice.client_name || ''}
            onChange={this.handleChange} />
        </div>
        <div>
          <label>Invoice ID</label>
          <input type="text" name="invoice_id" required
            value={invoice.invoice_id || ''}
            onChange={this.handleChange} />
        </div>
        <div>
          <label>Date Issued</label>
          <input type="date" name="issue_date" required
            value={invoice.issue_date || ''}
            onChange={this.handleChange} />
        </div>
        <div>
          <label>Due Date</label>
          <input type="date" name="due_date" required
            value={invoice.due_date || ''}
            onChange={this.handleChange} />
        </div>
        <div>
          <label>Paid Date</label>
          <input type="date" name="paid_date"
            value={invoice.paid_date || ''}
            onChange={this.handleChange} />
        </div>
        <div>
          <label>Subject</label>
          <input type="text" name="subject" required
            value={invoice.subject || ''}
            onChange={this.handleChange} />
        </div>
        <div>
          <label>Notes</label>
          <br/>
          <textarea data-name="notes" value={invoice.notes}
            onChange={this.handleChange} cols="40" rows="5" />
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
        <br/>
        <button onClick={this.handleAddLineItem}>New Line Item</button>
        <hr/>
      </form>
    );
  }
}

export default InvoiceForm;
