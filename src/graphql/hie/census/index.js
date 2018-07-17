const types = require('./types');
const Census = require('../../../domain/hie/census');

module.exports = {
  types: types,
  resolvers: {
    HieRoot: {
      census: () => true
    },
    Census: {
      state: (_, args, ctx) => Census().state(args.state)
    }
  }
};
