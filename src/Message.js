import React, { Component } from 'react';
import './Message.css';


class Message extends Component {
  render() {
    if (this.props.if) {
      return (
        <div className="message">
          {this.props.children}
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Message;
