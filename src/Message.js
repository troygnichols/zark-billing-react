import React, { Component } from 'react';
import './styles/Message.css';


class Message extends Component {

  getClasses() {
    return (this.getMessageTypeClass()
      + ' ' + (this.props.className||'notification')).trim();
  }

  getMessageTypeClass() {
    const props = this.props;
    const types = [
      'primary', 'link', 'info', 'success', 'warning', 'danger'
    ];
    return types.reduce((acc, type) => (
      props[type] ? acc + ` is-${type}` : acc + ' '
    ), '').trim();
  }

  shouldDisplay() {
    if (Object.keys(this.props).includes('if')) {
      return this.props.if;
    }
    return true;
  }

  render() {
    if (this.shouldDisplay()) {
      return (
        <div className={this.getClasses()}>
          {this.props.children}
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Message;
