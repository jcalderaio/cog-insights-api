const types = require('./types');
const Mpiids = require('../../../domain/hie/mpiids');

module.exports = {
  types: types,
  resolvers: {
    HieRoot: {
      mpiids: () => true
    },
    Mpiids: {
      byMonth: (_, args, ctx) => Mpiids(ctx.hsregistrydb).byMonth(args.startDate, args.endDate)
    }
  }
};
