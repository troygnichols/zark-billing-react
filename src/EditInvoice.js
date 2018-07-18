import React, { Component } from 'react';

class EditInvoice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      entityName: '',
      clientName: '',
      invoiceId: '',
      dueDate: '',
      issueDate: '',
      paidDate: '',
      subjectText: '',
      lineItems: {
        2: {description: 'foobar', quantity: 2, unitPrice: 100},
        1: {description: 'barz', quantity: 3, unitPrice: 75},
      },
      ...props.invoice
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddLineItem = this.handleAddLineItem.bind(this);
    this.handleDeleteLineItem = this.handleDeleteLineItem.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name;

    if (name.startsWith('lineItems')) {
      const [, fieldName, index] = name.split('.');
      this.setState((prevState) => {
        return {
          ...prevState,
          lineItems: {
            ...prevState.lineItems,
            [index]: {
              ...prevState.lineItems[index],
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
      const newLineItems = {};
      const keys = self.getOrderedKeys(prevState.lineItems);
      keys.forEach((key, index) => {
        if (key !== parseInt(keyToDel, 10)) {
          newLineItems[Object.keys(newLineItems).length] = prevState.lineItems[key];
        }
      });
      return {
        ...prevState,
        lineItems: newLineItems
      };
    });
  }

  handleAddLineItem(event) {
    event.preventDefault();
    this.setState((prevState) => {
      return {
        ...prevState,
        lineItems: {
          [this.getNextLineItemKey(prevState.lineItems)]: {
            description: '', quantity: '', unitPrice: 0
          },
          ...prevState.lineItems
        }
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('saving state', this.state);
  }

  getNextLineItemKey(lineItems) {
    const keys = Object.keys(lineItems);
    const highestKey = keys.sort()[keys.length-1];
    return (parseInt(highestKey, 10) || 0) + 1;
  }

  calcAmount(item) {
    const amt = parseInt(item.quantity, 10) * parseInt(item.unitPrice, 10);
    return amt || 0;
  }

  getOrderedKeys(items) {
    const keys =  Object.keys(items).map((key) => {
      return parseInt(key, 10)
    })
    return keys.sort(function(a, b) { return a > b });
  }

  renderLineItems() {
    const lineItems = this.state.lineItems;
    return this.getOrderedKeys(lineItems).map((key, index) => {
      const item = lineItems[key];
      return (
        <tr key={parseInt(key, 10)}>
          <td>
            <input type="text" name={`lineItems.description.${key}`} required
              placeholder="Development on new features"
              value={item.description}
              onChange={this.handleChange} />
          </td>
          <td>
            <input type="text" name={`lineItems.quantity.${key}`} required
              value={item.quantity}
              onChange={this.handleChange} />
          </td>
          <td>
            <input type="text" name={`lineItems.unitPrice.${key}`} required
              value={item.unitPrice}
              onChange={this.handleChange} />
          </td>
          <td>
            <input type="text" name={`lineItems.amount.${key}`} disabled
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
    return (
      <div className="container">
        <h1>Edit Invoice</h1>
        <form className="edit-form" onSubmit={this.handleSubmit}>
          <div>
            <label>Your Business</label>
            <input type="text" name="entityName" required autoFocus
              placeholder="Foobar LLC"
              value={this.state.entityName}
              onChange={this.handleChange} />
          </div>
          <div>
            <label>Your Client</label>
            <input type="text" name="clientName" required
              placeholder="Bankcorp"
              value={this.state.clientName}
              onChange={this.handleChange} />
          </div>
          <div>
            <label>Invoice ID</label>
            <input type="text" name="invoiceId" required
              value={this.state.invoiceId}
              onChange={this.handleChange} />
          </div>
          <div>
            <label>Date Issued</label>
            <input type="date" name="issueDate" required
              value={this.state.issueDate}
              onChange={this.handleChange} />
          </div>
          <div>
            <label>Due Date</label>
            <input type="date" name="dueDate" required
              value={this.state.dueDate}
              onChange={this.handleChange} />
          </div>
          <div>
            <label>Paid</label>
            <input type="date" name="dueDate"
              value={this.state.paidDate}
              onChange={this.handleChange} />
          </div>
          <div>
            <label>Subject</label>
            <input type="text" name="subject" required
              value={this.state.subjectText}
              onChange={this.handleChange} />
          </div>
          <div>
            <label>Notes</label>
            <textarea value={this.state.notes} />
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
        </form>
      </div>
    );
  }
}

export default EditInvoice;
