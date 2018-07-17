const types = require('./types');
const Organizations = require('../../../domain/hie/organizations');

module.exports = {
  types: types,
  resolvers: {
    HieRoot: {
      organizations: (_, args, ctx) => Organizations(ctx.provisioningApi).list()
    }
  }
};
