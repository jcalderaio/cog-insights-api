const types = require('./types');
const Searches = require('../../../domain/hie/searches');

module.exports = {
  types: types,
  resolvers: {
    HieRoot: {
      searches: () => true
    },
    Searches: {
      byMonth: (_, args, ctx) => Searches(ctx.hsMdxClient).byMonth(args.startDate, args.endDate),
      history: (_, args, ctx) => Searches(ctx.hsMdxClient).history(args.filter || {}),
      list: (_, args, ctx) => Searches(ctx.hsMdxClient).list(args.filter || {})
    }
  }
};
