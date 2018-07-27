import React, { Component } from 'react';

class ModalLoading extends Component {

  // TODO: Modal* components all copy this, extract
  shouldDisplay = () => {
    if (Object.keys(this.props).includes('if')) {
      return this.props.if;
    }
    return true;
  }

  render() {
    const { children, message } = this.props;
    if (!this.shouldDisplay()) {
      return null;
    }
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card">
          <section className="modal-card-body has-text-centered">
            {children || message || 'Loading…'}
          </section>
        </div>
      </div>
    );
  }
}

export default ModalLoading;
