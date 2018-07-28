import React from 'react';

const ErrorContext = React.createContext();

export const ErrorProvider = ErrorContext.Provider;

export function withErrors(Component) {
  return function(props) {
    return (
      <ErrorContext.Consumer>
        {value =>
            <Component {...props} {...value} />}
      </ErrorContext.Consumer>
    );
  }
}

export default {
  ErrorProvider,
  withErrors,
}
