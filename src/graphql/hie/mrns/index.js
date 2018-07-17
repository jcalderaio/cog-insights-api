const types = require('./types');
const Mrns = require('../../../domain/hie/mrns');

module.exports = {
  types: types,
  resolvers: {
    HieRoot: {
      mrns: () => true
    },
    Mrns: {
      byMonth: (_, args, ctx) =>
        Mrns(ctx.hsregistrydb, ctx.provisioningLink).byMonth(
          args.startDate,
          args.endDate,
          args.organization,
          args.city
        ),
      byOrganization: (_, args, ctx) =>
        Mrns(ctx.hsregistrydb, ctx.provisioningLink).byOrganization(
          args.startDate,
          args.endDate,
          args.organization,
          args.city
        )
    }
  }
};
