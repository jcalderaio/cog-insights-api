const types = require('./types');
const Cities = require('../../../domain/hie/cities');

module.exports = {
  types: types,
  resolvers: {
    HieRoot: {
      cities: (_, args, ctx) => Cities(ctx.wso2db).list()
    }
  }
};
