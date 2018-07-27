import React, { Component } from 'react';

class TextArea extends Component {
  render() {
    const {
      name, object, errors, label,
      ...rest
    } = this.props;

    return (
      <div className="field">
        <label className="label">{label}</label>
        <div className="control">
          <textarea type="text" name={name} {...rest}
            className={'textarea ' + (errors[name] ? 'is-danger' : '')}
            value={object[name] || ''} />
        </div>
      </div>
    );
  }
}

export default TextArea;

