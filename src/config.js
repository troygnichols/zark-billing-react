import get from 'lodash.get';

const config = {

  development: {
    api: {
      baseUrl: 'http://localhost:4000'
    }
  },

  production: {
    api: {
      baseUrl: 'https://zark-billing-api.herokuapp.com'
    }
  }

};

export function getConfig(prop) {
  return get(config[process.env.NODE_ENV], prop);
}

export default {
  getConfig
}
