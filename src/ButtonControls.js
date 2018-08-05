import React, { Component } from 'react';

function ensureArray(things) {
  if (Array.isArray(things)) {
    return things;
  } else {
    return Array(things);
  }
}

class ButtonControls extends Component {
  render() {
    const { children, className='' } = this.props;
    return (
      <div className="button-controls is-clearfix">
        <div className={'field is-grouped ' + className}>
          {ensureArray(children).map((child, i) =>
            <p key={i} className="control">{child}</p>)}
        </div>
      </div>
    );
  }
}

export default ButtonControls;
