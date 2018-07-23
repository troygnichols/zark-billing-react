import React, { Component } from 'react';

class SimpleTable extends Component {
  render() {
    const {props: {data, columns, className}} = this;
    return (
      <table className={className}>
        <thead>
          <tr>
            {columns.map(({Header}, index) => (
              <th key={index}>{Header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map(({accessor, fn}, index) => (
                <td key={index}>{accessor ? row[accessor] : fn(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default SimpleTable;
