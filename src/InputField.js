import React, { Component } from 'react';

class InputField extends Component {
  render() {
    const {
      name, object, label, errors={}, type='text',
      ...rest
    } = this.props;

    return (
      <div className="field">
        <label className="label">{label}</label>
        <div className="control">
          <input type={type} name={name} {...rest}
            className={'input ' + (errors[name] ? 'is-danger' : '')}
            value={object[name] || ''} />
        </div>
      </div>
    );
  }
}

export default InputField;
