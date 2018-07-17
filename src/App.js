import React, { Component } from 'react';
import './App.css';
import EditInvoice from './EditInvoice';

class App extends Component {
  render() {
    const invoice = {};

    return (
      <div className="App">
        <EditInvoice invoice={invoice} />
      </div>
    );
  }
}

export default App;
