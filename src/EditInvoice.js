import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { calcAmount } from './util';
import { getConfig } from './config.js';

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
        paid_date: '',
        subject: '',
        items: {}
      },
      itemIdsToDelete: new Set()
      /*
       * instead of ^^^^^^^, make an initial list of item ids and and
       * when submitting, calculate the ones that are gone and add them
       * to the delete array. that way the child form component doesn't
       * need to communicate so much info back and forth with this one.
      */
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddLineItem = this.handleAddLineItem.bind(this);
    this.handleDeleteLineItem = this.handleDeleteLineItem.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    fetch(`${getConfig('api.baseUrl')}/invoices/${id}`)
      .then(resp => resp.json())
      .then((data) => {
        this.setState((prevState) => (
          { ...prevState, invoice: data.invoice }
        ));
      });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name || target.getAttribute('data-name');

    if (name.startsWith('items')) {
      const [, fieldName, index] = name.split('.');
      this.setState((prevState) => (
        { ...prevState, invoice: {
            ...prevState.invoice, items: {
              ...prevState.invoice.items,
              [index]: {
                ...prevState.invoice.items[index],
                [fieldName]: value } } } }
      ));
    } else {
      this.setState((prevState) => (
        { ...prevState, invoice: {
            ...prevState.invoice, [name]: value } }
      ));
    }
  }

  handleDeleteLineItem(event) {
    event.preventDefault();
    const keyToDel = event.target.getAttribute('data-key');
    const self = this;
    this.setState((prevState) => {
      const newItems = {};
      const keys = self.getOrderedKeys(prevState.invoice.items);
      const itemIdsToDel = prevState.itemIdsToDelete;
      keys.forEach((key, index) => {
        const item = prevState.invoice.items[key];
        if (key === parseInt(keyToDel, 10)) {
          if (typeof(item.id) !== 'undefined' && item.id !== null) {
            itemIdsToDel.add(item.id)
          }
        } else {
          newItems[Object.keys(newItems).length] = item;
        }
      });
      return {
        ...prevState,
        invoice: {
          ...prevState.invoice,
          items: newItems
        },
        itemIdsToDelete: itemIdsToDel
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
    const history = this.props.history;
    const id = this.state.invoice.id;
    fetch(`${getConfig('api.baseUrl')}/invoices/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: this.buildInvoicePayload()
    })
      .then(resp => resp.json)
      .then(data => {
        history.push(`/invoices/${id}`);
      });
  }

  buildInvoicePayload() {
    const invoice = this.state.invoice;
    const itemIdsToDel = this.state.itemIdsToDelete;
    const itemAttrs = this.getOrderedKeys(invoice.items).map((key) => {
      const item = invoice.items[key];
      return item;
    }).concat([...itemIdsToDel].map(id => (
      {id, _destroy: true}
    )));
    const payload = {
      invoice: {
        ...invoice,
        ...{ items_attributes: itemAttrs
        }
      }
    };
    delete payload.invoice.items;
    return JSON.stringify(payload);
  }

  getNextLineItemKey(items) {
    const keys = Object.keys(items);
    const highestKey = this.getOrderedKeys(items)[keys.length-1];
    return (parseInt(highestKey, 10) || 0) + 1;
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
    const invoice = this.state.invoice;
    return (
      <div className="container">
        <nav>
          <ul className="breadcrumb">
            <li><Link to="/invoices">Invoices</Link></li>
            <li><Link to={`/invoices/${invoice.id}`}>Invoice {invoice.invoice_id}</Link></li>
            <li>Edit Invoice</li>
          </ul>
        </nav>
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
            <label>Your Business Address</label>
            <br/>
            <textarea data-name="entity_address" value={invoice.entity_address}
              onChange={this.handleChange} cols="40" rows="2" />
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
            <label>Paid Date</label>
            <input type="date" name="paid_date"
              value={invoice.paid_date || ''}
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
          <a href="#" className="button" onClick={this.handleSubmit}>Save</a>
          <Link to={`/invoices/${invoice.id}`} className="cancel button">Cancel</Link>
          <br/>
          <br/>

        </form>
      </div>
    );
  }
}

export default withRouter(EditInvoice);
