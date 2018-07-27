import React, { Component } from 'react';
import { calcAmount, calcTotalAmount } from './lib/util.js';
import './styles/InvoiceForm.css';
import Message from './Message.js';
import { getErrorMessages } from './lib/util.js';
import InputField from './InputField.js';
import TextArea from './TextArea.js';

class InvoiceForm extends Component {

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

  handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name;

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

  handleDeleteLineItem = (event) => {
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

  handleAddLineItem = (event) => {
    event.preventDefault();
    const prevInvoice = this.props.invoice;
    const newKey = this.getNextLineItemKey(prevInvoice.items);
    const newInvoice = { ...prevInvoice, items: {
      [newKey]: { description: '', quantity: '', unit_price: 0 },
      ...prevInvoice.items
    }};
    this.props.onChange(newInvoice);
  }

  render() {
    const { invoice, errors={} } = this.props;
    const errMsgs = getErrorMessages(errors);
    return (
      <form>
        <Message danger if={errMsgs.length}>
          {errMsgs.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </Message>
        <div className="columns">
          <div className="column is-half">
            <InputField
              label="Your Business" name="entity_name"
              object={invoice} errors={errors}
              onChange={this.handleChange} />
            <TextArea
              label="Your Business Address" name="entity_address"
              object={invoice} errors={errors}
              onChange={this.handleChange} rows="2" />
            <InputField
              label="Your Client" name="client_name"
              object={invoice} errors={errors}
              onChange={this.handleChange} />
            <InputField
              label="Invoice ID" name="invoice_id"
              object={invoice} errors={errors}
              onChange={this.handleChange} />
            <InputField
              label="Subject" name="subject"
              object={invoice} errors={errors}
              onChange={this.handleChange} />
            <TextArea
              label="Notes" name="notes"
              object={invoice} errors={errors}
              onChange={this.handleChange} rows="2" />
            <InputField type="date"
              label="Date Issued" name="issue_date"
              object={invoice} errors={errors}
              onChange={this.handleChange} />
            <InputField type="date"
              label="Due Date" name="due_date"
              object={invoice} errors={errors}
              onChange={this.handleChange} />
            <InputField type="date"
              label="Paid Date" name="paid_date"
              object={invoice} errors={errors}
              onChange={this.handleChange} />
          </div>
        </div>
        <div className="field">
          <label className="label">Line Items</label>
          <div className="control">
            <div className="columns item-header">
              <div className="column is-5">Description</div>
              <div className="column is-2">Quantity</div>
              <div className="column is-2">$ Unit Price</div>
              <div className="column is-2">Amount</div>
              <div className="column is-1"></div>
            </div>
            {
              this.getOrderedKeys(
                this.props.invoice.items||[]).map((key, index) => {
                  const item = this.props.invoice.items[key];
                  return (
                    <div key={index} className="columns">
                      <div className="column is-5">
                        <input type="text" name={`items.description.${key}`} required
                          placeholder="Development on new features"
                          className="input"
                          value={item.description || ''}
                          onChange={this.handleChange} />
                      </div>
                      <div className="column is-2">
                        <input type="number" name={`items.quantity.${key}`}
                          required value={item.quantity || 0}
                          className="input" onChange={this.handleChange} />
                      </div>
                      <div className="column is-2">
                        <input type="number" name={`items.unit_price.${key}`}
                          required value={item.unit_price || 0}
                          className="input" onChange={this.handleChange} />
                      </div>
                      <div className="column is-2">
                        <input type="text" name={`items.amount.${key}`}
                          disabled className="input" value={calcAmount(item)} />
                      </div>
                      <div className="column is-1">
                        <button className="is-danger button"
                          onClick={this.handleDeleteLineItem} data-key={key}>
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
            }
            <div className="columns">
              <div className="column is-7">
                <button className="button is-small"
                  onClick={this.handleAddLineItem}>&#65291; New Line Item
                </button>
              </div>
              <div className="column is-2">
                <p className="is-pulled-right">Amount Due:</p>
              </div>
              <div className="column is-3">
                <strong>$ {calcTotalAmount(
                  {items: Object.values(invoice.items||{})})}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default InvoiceForm;
