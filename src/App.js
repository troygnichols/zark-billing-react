import React, { Component } from 'react';
import './App.css';
import InvoiceList from './InvoiceList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <InvoiceList />
      </div>
    );
  }
}

export default App;
