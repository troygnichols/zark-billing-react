import React, { Component } from 'react';

class ButtonControls extends Component {
  render() {
    const { children, className='' } = this.props;
    return (
      <div className="button-controls is-clearfix">
        <div className={'field is-grouped ' + className}>
          {children.map((child, i) => <p key={i} className="control">{child}</p>)}
        </div>
      </div>
    );
  }
}

export default ButtonControls;
