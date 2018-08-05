import React, { Component } from 'react';
import Message from './Message.js';
import { getErrorMessages } from './lib/util.js';
import InputField from './InputField.js';

class ChangePasswordForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      password_confirmation: '',
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state);
  }

  handleChange = (event) => {
    event.preventDefault();
    const {target: {name, value}} = event;
    this.setState(prev => ({...prev, [name]: value}));
  };

  render() {
    const { errors, email, children, autoFocus=false } = this.props;
    const errMsgs = getErrorMessages(errors);

    return (
      <div>
        <Message danger if={errMsgs.length}>
          {errMsgs.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </Message>
        <form onSubmit={this.handleSubmit} className="profile-form">
          <div className="card">
            <div className="card-content">
              {/* This invisible input is to help
                browser-based password savers find the username/email  */}
              <input type="text" name="email" value={email}
                style={{display: 'none'}} readOnly />

              <InputField type="password" label="Password" name="password"
                errors={errors} object={this.state} required
                autoFocus={autoFocus} onChange={this.handleChange} />
              <InputField type="password" label="Confirm Password"
                name="password_confirmation" errors={errors} required
                object={this.state} onChange={this.handleChange} />
              {children}
            </div>
          </div>
        </form>

      </div>
    );
  }
}

export default ChangePasswordForm;
