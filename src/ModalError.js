import React, { Component } from 'react';
import './styles/ModalError.css';

class ModalError extends Component {

  shouldDisplay = () => {
    if (Object.keys(this.props).includes('if')) {
      return this.props.if;
    }
    return true;
  };

  handleCancel = (event) => {
    event.preventDefault();
    this.props.onCancel();
  };

  render() {
    const { children } = this.props;
    if (!this.shouldDisplay()) {
      return null;
    }
    return (
      <div className="modal modal-error is-active">
        <div className="modal-background"></div>
        <div className="modal-card">
          <section className="modal-card-body">
            {children}
          </section>
        </div>
      </div>
    );
  }
}

export default ModalError;
