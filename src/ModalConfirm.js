import React, { Component } from 'react';

class ModalConfirm extends Component {

  constructor(props) {
    super(props);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleConfirm(event) {
    event.preventDefault();
    this.props.onConfirm();
  }

  handleCancel(event) {
    event.preventDefault();
    this.props.onCancel();
  }

  shouldDisplay() {
    if (Object.keys(this.props).includes('if')) {
      return this.props.if;
    }
    return true;
  }

  render() {
    if (!this.shouldDisplay()) {
      return null;
    }
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{this.props.title}</p>
            <button className="delete" aria-label="close"
              onClick={this.handleCancel}></button>
          </header>
          <section className="modal-card-body">
            {this.props.children}
          </section>
          <footer className="modal-card-foot is-pulled-right">
            <button className="button is-danger" onClick={this.handleConfirm}>
              {this.props.confirmText||'Confirm'}</button>
            <button className="button"
              onClick={this.handleCancel}>{this.props.cancelText||'Cancel'}</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default ModalConfirm;
